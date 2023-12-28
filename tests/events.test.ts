import { v4 as uuid } from 'uuid';
import { EventStoreDBClient } from '@eventstore/db-client';

import { AccountEvent,  } from '../src/account-events';
import { appendToStream, readStream } from '../src/core/event-store';
import { Account, OperationType } from '../src/account';



const getAccount = (events: AccountEvent[]): Account => {
    return events.reduce<Account>((state, event) => {
        state = Account.evolve(state, event);
        return state;
      }, <Account>new Account(undefined!, undefined!, undefined!, undefined!, undefined!,undefined!,undefined!,undefined!));
    };

describe('Events definition', () => {
    it('all event types should be defined', () => {
        const accountId = uuid();
        const clientId = uuid();

        const events: AccountEvent[] = [
            {
                type: 'AccountOpened',
                data: {
                    accountId: accountId,
                    clientId: clientId,
                    accountLabel: 'string',
                    accountOpeningDate: new Date()
                },
            },
            {
                type: 'AccountCredited',
                data: {
                    accountId: accountId,
                    operationType: OperationType.Credit,
                    operationCategory: "Category",
                    operationLabel: 'First Credit Operation',
                    operationAmount: 25,
                    operationDate: new Date()
                },
            },
            {
                type: 'AccountDebited',
                data: {
                    accountId: accountId,
                    operationType: OperationType.Debit,
                    operationCategory: "Category",
                    operationLabel: 'First Debit Operation',
                    operationAmount: 20,
                    operationDate: new Date()
                },
            },
            {
                type: 'AccountClosed',
                data: {
                    accountId: accountId,
                    accountClosureDate: new Date()
                },
            }
        ]

        
        expect(events.length).toBe(4);
    })
});

  
describe('Aggregate evaluation', () => {

    let eventDbConnexionString : string;
    if (!process.env.EVENT_DB_CONN)
    {
        throw Error("No Mongo connexion string");
    }
    eventDbConnexionString = process.env.EVENT_DB_CONN;
    
    const client = EventStoreDBClient
    .connectionString(eventDbConnexionString);
    
    test('Account should be Good', async  () => {

        const accountId = uuid();
        const clientId = uuid();

        const events: AccountEvent[] = [
            {
                type: 'AccountOpened',
                data: {
                    accountId: accountId,
                    clientId: clientId,
                    accountLabel: 'Mon Compte',
                    accountOpeningDate: new Date()
                },
            },
            {
                type: 'AccountCredited',
                data: {
                    accountId: accountId,
                    operationType: OperationType.Credit,
                    operationLabel: 'First Credit Operation',
                    operationCategory: "Category",
                    operationAmount: 25,
                    operationDate: new Date()
                },
            },
            {
                type: 'AccountDebited',
                data: {
                    accountId: accountId,
                    operationType: OperationType.Debit,
                    operationLabel: 'First Debit Operation',
                    operationCategory: "Category",
                    operationAmount: 20,
                    operationDate: new Date()
                },
            },
            {
                type: 'AccountClosed',
                data: {
                    accountId: accountId,
                    accountClosureDate: new Date()
                },
            }
        ]
        
        const streamName = `account-${accountId}`;

        const appendResult = await appendToStream(client, streamName, events); 

        expect(Number(appendResult.nextExpectedRevision)).toBe(events.length - 1);
  
        const accountValue = getAccount(events); 
        expect(accountValue).toBeTruthy();
        expect(accountValue.accountId).toBe(accountId);
        expect(accountValue.clientId).toBe(clientId);
        expect(accountValue.accountLabel).toBe('Mon Compte');
        expect(accountValue.balance).toBe(5);

        const streamEvents = await readStream<AccountEvent>(client, streamName);
        const accountFromDb = getAccount(streamEvents);
    })
});