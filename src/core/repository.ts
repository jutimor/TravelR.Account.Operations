import {
    AppendExpectedRevision,
    AppendResult,
    EventStoreDBClient,
    jsonEvent,
    NO_STREAM,
    StreamNotFoundError,
  } from '@eventstore/db-client';

import { Event  } from './event';

export interface Repository<Entity, StreamEvent extends Event> {
    find(id: string): Promise<{ entity: Entity; revision: bigint | 'no_stream' }>;
    store(
      id: string,
      expectedRevision: AppendExpectedRevision,
      ...events: StreamEvent[]
    ): Promise<AppendResult>;
  }

  export class EventStoreRepository<Entity, StreamEvent extends Event>
  implements Repository<Entity, StreamEvent>
{
  constructor(
    private eventStore: EventStoreDBClient,
    private getInitialState: () => Entity,
    private evolve: (state: Entity, event: StreamEvent) => Entity,
    private mapToStreamId: (id: string) => string
  ) {}

  find = async (
    id: string
  ): Promise<{ entity: Entity; revision: bigint | 'no_stream' }> => {
    const state = this.getInitialState();

    let revision: bigint | 'no_stream' = NO_STREAM;

    try {
      const readResult = this.eventStore.readStream<StreamEvent>(
        this.mapToStreamId(id)
      );

      for await (const { event } of readResult) {
        if (!event) continue;

        this.evolve(state, <StreamEvent>{
          type: event.type,
          data: event.data,
        });

        revision = event.revision;
      }
    } catch (error) {
      if (!(error instanceof StreamNotFoundError)) {
        throw error;
      }
    }

    return { entity: state, revision };
  };

  store = async (
    id: string,
    expectedRevision: AppendExpectedRevision,
    ...events: StreamEvent[]
  ): Promise<AppendResult> => {
    return this.eventStore.appendToStream(
      this.mapToStreamId(id),
      events.map(jsonEvent),
      {
        expectedRevision,
      }
    );
  };
}