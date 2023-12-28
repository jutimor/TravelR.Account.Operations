import { ANY, AppendResult, EventStoreDBClient, StreamNotFoundError, jsonEvent } from "@eventstore/db-client";

import { Event } from "./event";
import { AccountEvent } from "../account-events";

const appendToStream = async (
    eventStore: EventStoreDBClient,
    streamName: string,
    events: AccountEvent[]
  ): Promise<AppendResult> => {
    const serializedEvents = events.map(jsonEvent);
  
    return eventStore.appendToStream(streamName, serializedEvents, {
      expectedRevision: ANY,
    });
  };

const readStream = async <StreamEvent extends Event>(
    eventStore: EventStoreDBClient,
    streamId: string
  ): Promise<StreamEvent[]> => {
    const events = [];
    try {
      for await (const { event } of eventStore.readStream<StreamEvent>(
        streamId
      )) {
        if (!event) continue;
  
        events.push(<StreamEvent>{
          type: event.type,
          data: event.data,
        });
      }
      return events;
    } catch (error) {
      if (error instanceof StreamNotFoundError) {
        return [];
      }
  
      throw error;
    }
  };

export { appendToStream, readStream } 