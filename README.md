# better-events

A Node.JS eventing system with built-in `.cancel()` support

## Example usage
```ts
EventEmitter.on("hello", (event) => {
	event.cancel()
})

EventEmitter.emit(
	new Event(
		"hello",
		{
			field1: true,
		},
		() => {
			console.log("Hello, world!")
		}
	),
	true
)
```
