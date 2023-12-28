import { 
    AccountClosed, 
    AccountEvent, 
    AccountOpened, 
    AccountCredited, 
    AccountDebited } from "./account-events";

export  enum OperationType {
      Debit = "Debit",
      Credit = "Credit"
    }

export class Operation {
  constructor(
    private _operationType: OperationType,
    private _operationCategory: string,
    private _operationLabel: string,
    private _operationAmount: number,
    private _operationDate: Date) {
  }
  
  get operationType() {
    return this._operationType;
  }

  get operationCategory() {
    return this._operationCategory;
  }

  get operationLabel() {
    return this._operationLabel;
  }
  get operationAmount() {
    return this._operationAmount;
  }
  get operationDate() {
    return this._operationDate;
  }
}
export class Account  { 

  constructor(
      private _accountId: string,
      private _clientId: string,
      private _accountLabel: string,
      private _openingDate: Date,
      private _closureDate: Date,
      private _balance: number,
      private _operations : Operation[],
      private _status: AccountStatus
  ) { 
    if (!_operations)
    this._operations = [];
  }

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

  get operations() {
    return this._operations;
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
              state._operations.push(new Operation(OperationType.Credit,
                event.operationType, event.operationLabel, event.operationAmount,event.operationDate
             ))
              return state;
          case  "AccountDebited":
              state._balance -= event.operationAmount;
              state._operations.push(new Operation(OperationType.Debit,
                 event.operationType, event.operationLabel, event.operationAmount,event.operationDate
              ))
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

  public accountCredited = (accountId: string, operationType: string, operationLabel: string, operationAmount: number, operationDate: Date)
    : AccountCredited => { 

    this.assertAccountExist();
    this.assertAccountIsOpen();

    if (!operationDate)
    {
      operationDate = new Date()
    }
    
    return {
      type: 'AccountCredited',
      data: { accountId, operationType, operationLabel, operationAmount, operationDate },
    };
  }
    
    
  public accountDebited = (accountId: string, operationType: string, operationLabel: string, operationAmount: number, operationDate: Date)
    : AccountDebited => {
      
    this.assertAccountExist();
    this.assertAccountIsOpen();

    return {
      type: 'AccountDebited',
      data: { accountId, operationType, operationLabel, operationAmount, operationDate },
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
    if (this._closureDate) {
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