import express, { Express, Request, Response } from "express";
import cors  from 'cors';

import dotenv from "dotenv";

import { AccountService } from "./account-service"; 
import { EventStoreRepository, getDatabase, loadAccounts, updateDocument  } from "./core";
import { Account } from "./account";
import {  AccountEvent } from "./account-events";

import { AllStreamJSONRecordedEvent, 
  EventStoreDBClient, 
  START, 
  eventTypeFilter, 
  excludeSystemEvents, 
  streamNameFilter
} from "@eventstore/db-client";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());

export const mapAccountStreamId = (id: string) => `account-${id}`;

let eventDbConnexionString : string;
if (!process.env.EVENT_DB_CONN)
{
    throw Error("No Mongo connexion string");
}
eventDbConnexionString = process.env.EVENT_DB_CONN;

const eventStore = EventStoreDBClient
.connectionString(eventDbConnexionString);

const database = getDatabase();

const filter = eventTypeFilter({
  regex: "AccountOpened|AccountClosed|AccountCredited|AccountDebited",
});

eventStore
  .subscribeToAll({  fromPosition : START, filter })
  .on("data" , async function (resolvedEvent) {
    let accountId : string  = (resolvedEvent.event as AllStreamJSONRecordedEvent<AccountEvent>).data.accountId
     
    const account = await accountService.get(accountId);
    
    updateDocument(account.entity);
  });


const repository = new EventStoreRepository<
      Account,
      AccountEvent
    >(
      eventStore,
      Account.default,
      Account.evolve,
      mapAccountStreamId
    );

const accountService = new AccountService(repository);



app.use(express.json())

app.post("/account/open", async (req: Request, res: Response) => {
   
  try {
    await accountService.open(req.body);
    res.send(req.body.accountId);
  } catch(e)
  {  
    console.error(e);
    res.status(400).send((e as Error).message)
  }
});

app.post("/account/credit", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    await accountService.credit(req.body);
    res.send(req.body.accountId);
  } catch(e)
  {  
    console.error(e);
    res.status(400).send((e as Error).message)
  }
});

app.post("/account/debit", async (req: Request, res: Response) => {
  try {
    await accountService.debit(req.body);
    res.send(req.body.accountId);
  } catch(e)
  {  
    console.error(e);
    res.status(400).send((e as Error).message)
  }
});

app.post("/account/close", async (req: Request, res: Response) => {
  try {
    await accountService.close(req.body);
    res.send(req.body.accountId);
  } catch(e)
  {  
    console.error(e);
    res.status(400).send((e as Error).message)
  }
});

app.get("/account", async (req: Request, res: Response) => {
  const accounts = await loadAccounts();
  res.send(accounts);
});


app.get("/account/:accountId", async (req: Request, res: Response) => {
   

  try {
    const account = await accountService.get(req.params.accountId as string);

    res.send(account.entity);
  } catch(e)
  {  
    console.error(e);
    res.status(400).send((e as Error).message)
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is listening at http://localhost:${port}`);
});