/**
 * Event emitter for ORA Browse
 */

export type EventCallback<T = unknown> = (data: T) => void | Promise<void>;

export interface TypedEventMap {
  [event: string]: unknown;
}

export class EventEmitter<EventMap extends TypedEventMap = TypedEventMap> {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
    const eventName = event as string;
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(callback as EventCallback);
  }

  off<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
    const eventName = event as string;
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.delete(callback as EventCallback);
    }
  }

  once<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
    const onceCallback: EventCallback<EventMap[K]> = (data) => {
      this.off(event, onceCallback);
      return callback(data);
    };
    this.on(event, onceCallback);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const eventName = event as string;
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          const result = callback(data);
          if (result instanceof Promise) {
            result.catch(err => {
              console.error(`Error in async event handler for ${eventName}:`, err);
            });
          }
        } catch (err) {
          console.error(`Error in event handler for ${eventName}:`, err);
        }
      });
    }
  }

  removeAllListeners(event?: keyof EventMap): void {
    if (event) {
      this.listeners.delete(event as string);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount(event: keyof EventMap): number {
    const callbacks = this.listeners.get(event as string);
    return callbacks ? callbacks.size : 0;
  }
}

// Default event emitter instance
export const defaultEventEmitter = new EventEmitter();
