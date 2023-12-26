
const { AccountAggregate } = require('../aggregates/account-aggregate.js');

async function openAccount(openAccountCommand)
{
    const aggregate = new AccountAggregate(openAccountCommand.id);

    await aggregate.init();
    await aggregate.setState();
}

async function addOperation( AddOperationCommand)
{

}

module.exports = { openAccount, addOperation}