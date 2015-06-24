The purpose of this implementation is to launch the UI separately from the runtime
which runs the application itself (the host).

Instead of UI controls driving the emulated plugin state by directly calling
the plugin emulation API, it is now done remotely.

This implementation relies on the prototype https://github.com/busykai/ws-rpc
which allows calling remote API and generating/receiving events.
