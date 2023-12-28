import { Account, OperationType } from "./account";
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
    operationType: OperationType;
    operationCategory: string;
    operationLabel: string;
    operationAmount: number;
    operationDate: Date;
  }
>;

type AccountDebited = Event<
  'AccountDebited',
  {
    accountId: string;
    operationType: OperationType;
    operationCategory: string;
    operationLabel: string;
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

type AccountEvent =
  | AccountOpened
  | AccountCredited
  | AccountDebited
  | AccountClosed;

export {
  AccountEvent, 
  AccountOpened,
  AccountCredited,
  AccountDebited,
  AccountClosed
}