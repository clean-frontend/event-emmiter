

type Events = Record<string, unknown>
type Listener<Data = any> = (data: Data) => void

export class EventEmmiter<EventsData extends Events> {

    private listeners: Map<keyof EventsData, Set<Listener>> = new Map();

    on<Key extends keyof EventsData>(event: Key, callback: Listener<EventsData[Key]>) {
        let eventListenersSet = this.listeners.get(event);

        if(!eventListenersSet){
            eventListenersSet = new Set([callback])
            this.listeners.set(event, eventListenersSet);
        } else {
            eventListenersSet.add(callback);
        }


        return () => {
            eventListenersSet.delete(callback);
        }
    }

    emit<Key extends keyof EventsData>(event: Key, ...args: EventsData[Key] extends void ? [] : [EventsData[Key]]) {
        const eventListenersSet = this.listeners.get(event);

        if(eventListenersSet){
            eventListenersSet.forEach((listener) => {
                listener(args[0]);
            });
        }
    }
}


const v = new EventEmmiter<{
    'click': {name: string, value: number},
    'delete': string,
    'v': void
}>()

v.on('click', (data) => {
    data.value
})

v.emit('click', {name: 'John', value: 10})

v.emit('v')