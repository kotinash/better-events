import { EventEmitter as NodeEventEmitter } from "events"

type Callback = (...args: any[]) => void

class Event {
	public name: string

	public fields: any

	public cancelled: boolean = false

	public callback: Callback

	public cancel_callback: Callback

	constructor(name: string, fields?: any, callback?: Callback, cancel_callback?: Callback) {
		this.name = name
		this.fields = fields
		this.callback = callback
		this.cancel_callback = cancel_callback
	}

	public emit(event_emitter: NodeEventEmitter, cancellable: boolean = !(this.callback === undefined)) {
		setTimeout(() => {
			event_emitter.emit(this.name, {
				...this.fields,
				cancellable,
				cancel: () => {
					if (!cancellable) {
						throw new Error("Event is not cancellable")
					}

					(this.cancel_callback ?? (() => {}))();

					this.cancelled = true
				},
			})

			if (!this.cancelled && this.callback) {
				(this.callback ?? (() => {}))();
			}
		}, 0)
	}
}

class EventEmitter {
	private static event_emitter: NodeEventEmitter = new NodeEventEmitter()

	static emit(event: Event, cancellable: boolean = true) {
		event.emit(this.event_emitter, cancellable)
	}

	static on(eventName: string, callback: Callback): void {
		this.event_emitter.on(eventName, callback)
	}

	static once(eventName: string, callback: Callback): void {
		this.event_emitter.once(eventName, callback)
	}
}

export { Event, EventEmitter }
