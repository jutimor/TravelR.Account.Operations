import { v4 as uuid } from 'uuid';
import { Account, AccountEvent, getAccount } from './events';

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
                    OperationAmount: 25,
                    OperationDate: new Date()
                },
            },
            {
                type: 'AccountDebited',
                data: {
                    accountId: accountId,
                    OperationAmount: 20,
                    OperationDate: new Date()
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
    it('Account should be Good', () => {

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
                    OperationAmount: 25,
                    OperationDate: new Date()
                },
            },
            {
                type: 'AccountDebited',
                data: {
                    accountId: accountId,
                    OperationAmount: 20,
                    OperationDate: new Date()
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

        const accountValue: Account = getAccount(events);
        
        expect(accountValue).toBeTruthy();
        expect(accountValue.accountId).toBe(accountId);
        expect(accountValue.clientId).toBe(clientId);
        expect(accountValue.accountLabel).toBe('Mon Compte');
        expect(accountValue.balance).toBe(5);

    })
});