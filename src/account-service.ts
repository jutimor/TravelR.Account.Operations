import { Account, OperationType } from "./account";
import { AccountEvent } from "./account-events";
import { 
    ApplicationService, 
    Repository } from "./core";


export type OpenAccount = {
    accountId: string;
    clientId: string;
    accountLabel: string;
    now: Date;
  };

export type CreditAccount = {
    accountId: string;
    operationType: OperationType;
    operationCategory: string;
    operationLabel: string;
    operationAmount: number;
    operationDate: Date;
};


export type DebitAccount = {
  accountId: string;
  operationType: OperationType;
  operationCategory: string;
  operationLabel: string;
  operationAmount: number;
  operationDate: Date;
};

export type CloseAccount = {
    accountId: string;
    now: Date;
};

export type AccountCommand = 
OpenAccount |
CreditAccount |
DebitAccount |
CloseAccount;

export class AccountService extends ApplicationService<
  Account,
  AccountEvent
> {
  constructor(
    protected repository: Repository<Account, AccountEvent>
  ) {
    super(repository);
  }

  public get = async (accountId: string) => await this.repository.find(accountId);

  public open = ({ accountId, clientId, accountLabel, now }: OpenAccount) =>
    this.on(accountId, (account) =>
        account.open(accountId, clientId, accountLabel, now)
    );

  public credit = ({ accountId, operationType, operationCategory, operationLabel, operationAmount, operationDate }: CreditAccount) =>
    this.on(accountId, (account) =>
        account.accountCredited(accountId, operationType, operationCategory, operationLabel, operationAmount, operationDate)
    );

  public debit = ({ accountId, operationType, operationCategory, operationLabel, operationAmount, operationDate }: DebitAccount) =>
    this.on(accountId, (account) =>
        account.accountDebited(accountId, operationType, operationCategory, operationLabel, operationAmount,  operationDate)
    );

  public close = ({ accountId, now }: CloseAccount) =>
    this.on(accountId, (account) => account.close(accountId, now));
}