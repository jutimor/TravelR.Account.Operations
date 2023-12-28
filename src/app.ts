import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { AccountService , OpenAccount, CloseAccount} from "./account-service"; 
import { EventStoreRepository } from "./core";
import { Account } from "./account";
import { AccountEvent } from "./account-events";
import { EventStoreDBClient } from "@eventstore/db-client";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;


export const mapAccountStreamId = (id: string) => `account-${id}`;


const eventStore = EventStoreDBClient
.connectionString(`esdb://localhost:2113?tls=false&throwOnAppendFailure=false`);

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
    res.send();
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
    res.send();
  } catch(e)
  {  
    console.error(e);
    res.status(400).send((e as Error).message)
  }
});

app.post("/account/debit", async (req: Request, res: Response) => {
  try {
    await accountService.debit(req.body);
    res.send();
  } catch(e)
  {  
    console.error(e);
    res.status(400).send((e as Error).message)
  }
});

app.post("/account/close", async (req: Request, res: Response) => {
  try {
    await accountService.close(req.body);
    res.send();
  } catch(e)
  {  
    console.error(e);
    res.status(400).send((e as Error).message)
  }
});

app.get("/account", async (req: Request, res: Response) => {
  try {
    const account = await accountService.get(req.query.accountId as string);

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