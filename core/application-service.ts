import { Repository } from "./repository";
import { Event } from "./event";

export abstract class ApplicationService<Entity, StreamEvent extends Event> {
    constructor(protected repository: Repository<Entity, StreamEvent>) {}
  
    protected on = async (
      id: string,
      handle: (state: Entity) => StreamEvent | StreamEvent[]
    ) => {
      const { entity: aggregate, revision: expectedRevision } =
        await this.repository.find(id);
  
      const result = handle(aggregate);
  
      return this.repository.store(
        id,
        expectedRevision,
        ...(Array.isArray(result) ? result : [result])
      );
    };
  }