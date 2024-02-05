import { EventEmitter as NodeEventEmitter } from "events"

type Callback = (...args: any[]) => void

class Event {
	public name: string
	public fields: any
	public cancelled: boolean = false
	public callback: Callback

	constructor(_name: string, _fields: any, _callback: Callback) {
		this.name = _name
		this.fields = _fields
		this.callback = _callback
	}

	public emit(event_emitter: NodeEventEmitter, cancellable: boolean) {
		// TODO: A better way of doing this?
		setTimeout(() => {
			event_emitter.emit(this.name, {
				...this.fields,
				cancellable,
				cancel: () => {
					if (!cancellable) {
						throw new Error("Event is not cancellable")
					}
					this.cancelled = true
				},
			})

			if (!this.cancelled) {
				this.callback()
			}
		}, 0)
	}
}

class EventEmitter {
	static event_emitter: NodeEventEmitter = new NodeEventEmitter()

	static emit(event: Event, cancellable: boolean = true) {
		event.emit(this.event_emitter, cancellable)
	}

	static on(event_name: string, callback: Callback): void {
		this.event_emitter.on(event_name, callback)
	}

	static once(event_name: string, callback: Callback): void {
		this.event_emitter.once(event_name, callback)
	}
}

export { Event, EventEmitter }
