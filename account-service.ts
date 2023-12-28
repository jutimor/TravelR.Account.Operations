import { Account } from "./account";
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

export type CloseAccount = {
    accountId: string;
    now: Date;
};

export class AccountService extends ApplicationService<
  Account,
  AccountEvent
> {
  constructor(
    protected repository: Repository<Account, AccountEvent>
  ) {
    super(repository);
  }

  public open = ({ accountId, clientId, accountLabel, now }: OpenAccount) =>
    this.on(accountId, (account) =>
        account.open(accountId, clientId, accountLabel, now)
    );

  public close = ({ accountId, now }: CloseAccount) =>
    this.on(accountId, (account) => account.close(accountId, now));
}