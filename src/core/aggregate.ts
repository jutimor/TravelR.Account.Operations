import { Event } from ".";

export abstract class Aggregate<E extends Event> {
    #uncommitedEvents: Event[] = [];
  
    abstract evolve(event: E): void;
  
    protected enqueue = (event: E) => {
      this.#uncommitedEvents = [...this.#uncommitedEvents, event];
    };
  
    dequeueUncommitedEvents = (): Event[] => {
      const events = this.#uncommitedEvents;
  
      this.#uncommitedEvents = [];
  
      return events;
    };
  }