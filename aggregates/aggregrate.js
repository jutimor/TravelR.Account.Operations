const { loadEvents } = require("../event-store");

class Aggregate  {
    aggregateId;
    events;
    state;
    constructor(aggregateId) {
        this.aggregateId = aggregateId; 
    }

    async init() {
        this.events = await loadEvents(this.aggregateId);
    }

    async setState() {
        this.state = {
            aggregateId: this.aggregateId
        }
    }
}


module.exports = { Aggregate }