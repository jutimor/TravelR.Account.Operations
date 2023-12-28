import { Account } from "./account";
import { Event } from './core';


type AccountOpened = Event<
  'AccountOpened',
  {
    accountId: string;
    clientId: string;
    accountLabel: string;
    accountOpeningDate: Date;
  }
>;

type AccountCredited = Event<
  'AccountCredited',
  {
    accountId: string;
    operationAmount: number;
    operationDate: Date;
  }
>;

type AccountDebited = Event<
  'AccountDebited',
  {
    accountId: string;
    operationAmount: number;
    operationDate: Date;
  }
>;

type AccountClosed = Event<
  'AccountClosed',
  {
    accountId: string;
    accountClosureDate: Date;
  }
>;



const getAccount = (events: AccountEvent[]): Account => {
  return events.reduce<Account>((state, event) => {
      state = Account.evolve(state, event);
      return state;
    }, <Account>new Account(undefined!, undefined!, undefined!, undefined!,undefined!,undefined!,undefined!));
  };


type AccountEvent =
  | AccountOpened
  | AccountCredited
  | AccountDebited
  | AccountClosed;

export {
  getAccount,
  AccountEvent, 
  AccountOpened,
  AccountCredited,
  AccountDebited,
  AccountClosed
}