
export abstract class IWorkerService {
    abstract processEvent(data: any): Promise<any>;
}