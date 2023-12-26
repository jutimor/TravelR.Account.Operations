type Event<
  EventType extends string = string,
  EventData extends Record<string, unknown> = Record<string, unknown>
> = Readonly<{
  type: Readonly<EventType>;
  data: Readonly<EventData>;
}>;

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
    OperationAmount: number;
    OperationDate: Date;
  }
>;

type AccountDebited = Event<
  'AccountDebited',
  {
    accountId: string;
    OperationAmount: number;
    OperationDate: Date;
  }
>;

type AccountClosed = Event<
  'AccountClosed',
  {
    accountId: string;
    accountClosureDate: Date;
  }
>;

class Account { 

    constructor(
        private _accountId: string,
        private _clientId: string,
        private _accountLabel: string,
        private _openingDate: Date,
        private _closureDate: Date,
        private _balance: number
    ) {  }

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

    public evolve = ({ type, data: event }: AccountEvent): void => {
        switch (type) {
            case "AccountOpened":
                this._accountId = event.accountId;
                this._clientId = event.clientId;
                this._accountLabel = event.accountLabel;
                this._openingDate = event.accountOpeningDate;
                this._balance = 0;
                break;
            case "AccountCredited":
                this._balance += event.OperationAmount;
                break;
            case  "AccountDebited":
                this._balance -= event.OperationAmount;
                break;
            case  "AccountClosed":
                this._closureDate = event.accountClosureDate;
                break;
        }
    }
}


const getAccount = (events: AccountEvent[]): Account => {
    return events.reduce<Account>((state, event) => {
      state.evolve(event);
      return state;
    }, new Account(undefined!, undefined!, undefined!, undefined!,undefined!,undefined!));
  };

type AccountEvent =
  | AccountOpened
  | AccountCredited
  | AccountDebited
  | AccountClosed;

export {
  Event,
  AccountEvent, 
  AccountOpened,
  AccountCredited,
  AccountDebited,
  AccountClosed,
  
   Account, getAccount,
  
}