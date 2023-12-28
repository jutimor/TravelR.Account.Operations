import { Aggregate } from "./core";
import { 
    AccountClosed, 
    AccountEvent, 
    AccountOpened, 
    AccountCredited, 
    AccountDebited } from "./account-events";

export class Account  { 

  constructor(
      private _accountId: string,
      private _clientId: string,
      private _accountLabel: string,
      private _openingDate: Date,
      private _closureDate: Date,
      private _balance: number,
      private _status: AccountStatus
  ) { }

  get accountId() {
      return this._accountId;
  }

  get clientId() {
      return this._clientId;
  }

  get accountLabel() {
      return this._accountLabel;
  }

  get openingDate() {
      return this._openingDate;
  }
  
  get closureDate() {
      return this._closureDate;
  }

  get balance() {
      return this._balance;
  }

  get status() {
      return this._status;
  }

  public static evolve = (
      state: Account,{ type, data: event }: AccountEvent): Account => {
      switch (type) {
          case "AccountOpened":
              state._accountId = event.accountId;
              state._clientId = event.clientId;
              state._accountLabel = event.accountLabel;
              state._openingDate = event.accountOpeningDate;
              state._balance = 0;
              state._status = AccountStatus.Opened;
              return state;
          case "AccountCredited":
              state._balance += event.operationAmount;
              return state;
          case  "AccountDebited":
              state._balance -= event.operationAmount;
              return state;
          case  "AccountClosed":
              state._closureDate = event.accountClosureDate;
              state._status = AccountStatus.Closed;
              return state;
          default: {
                  const _: never = type;
                  throw new Error('UNKNOWN_EVENT_TYPE');
                }
      }
  }

  public static default = () =>
    new Account(
      undefined!,
      undefined!,
      undefined!,
      undefined!,
      undefined!,
      undefined!,
      undefined!
    )


  public open = (accountId: string, clientId: string, accountLabel: string, accountOpeningDate: Date) : AccountOpened => {
    
    this.assertAccountDoesntExist();

    if (!accountOpeningDate)
    {
        accountOpeningDate = new Date()
    }
    
    return {
      type: 'AccountOpened',
      data: { accountId, clientId, accountLabel, accountOpeningDate  },
    };
  }

  public accountCredited = (accountId: string, operationAmount: number, operationDate: Date)
    : AccountCredited => { 

    this.assertAccountExist();
    this.assertAccountIsOpen();

    return {
      type: 'AccountCredited',
      data: { accountId, operationAmount, operationDate },
    };
  }
    
    
  public accountDebited = (accountId: string, operationAmount: number, operationDate: Date)
    : AccountDebited => {
      
    this.assertAccountExist();
    this.assertAccountIsOpen();

    return {
      type: 'AccountDebited',
      data: { accountId, operationAmount, operationDate },
    };
  }

  public close = (accountId: string,  accountClosureDate: Date) : AccountClosed => {
      
    this.assertAccountExist();
    this.assertAccountIsOpen();

    if (!accountClosureDate)
    {
      accountClosureDate = new Date()
    }
    return {
      type: 'AccountClosed',
      data: { accountId,  accountClosureDate},
    };
  }

  private assertAccountDoesntExist = (): void => {
    if (this._accountId) {
      console.log(this._accountId)
      throw new Error(AccountErrors.ACCOUNT_ALREADY_EXIST);
    }
  }

  private assertAccountExist = (): void => {
    if (!this._accountId) {
      throw new Error(AccountErrors.ACCOUNT_DOESNT_EXIST);
    }
  }

  private assertAccountIsOpen = (): void => {
    if (!this._closureDate) {
      throw new Error(AccountErrors.ACCOUNT_IS_CLOSED);
    }
  }
}

enum AccountStatus {
  Opened = 'Opened',
  Closed = 'Closed',
}

export const enum AccountErrors {
  ACCOUNT_DOESNT_EXIST = 'ACCOUNT_DOESNT_EXIST',
  ACCOUNT_ALREADY_EXIST = 'ACCOUNT_ALREADY_EXIST',
  ACCOUNT_IS_CLOSED = 'ACCOUNT_IS_CLOSED',
}