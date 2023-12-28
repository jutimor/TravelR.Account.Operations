import { v4 as uuid } from 'uuid';
import { AccountEvent, getAccount } from './account-events';
import { EventStoreDBClient } from '@eventstore/db-client';
import { appendToStream, readStream } from './core/event-store';

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
                    operationAmount: 25,
                    operationDate: new Date()
                },
            },
            {
                type: 'AccountDebited',
                data: {
                    accountId: accountId,
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

    const client = EventStoreDBClient
    .connectionString(`esdb://localhost:2113?tls=false&throwOnAppendFailure=false`);
    
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
                    operationAmount: 25,
                    operationDate: new Date()
                },
            },
            {
                type: 'AccountDebited',
                data: {
                    accountId: accountId,
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