# WebSocket API

The WebSocket API provides a connection through which real time events can be received, allowing clients to receive Messages, metadata and read receipts in real time.

The WebSocket API also supports a number of operations such as sending Messages and creating Conversations.

Establishing a WebSocket connection requires a [Session Token](introduction#authentication).  While a WebSocket connection can be created from any type of client, this document uses a JavaScript client for all examples.

Clients open a WebSocket connection with an HTTPS request on the `/websocket` endpoint with an upgrade request following the WebSocket protocol.  The subprotocol `layer-1.0` is required for this connection. The Layer session token can be sent either in the Authorization header or in the URL's query string.

The JavaScript WebSocket object handles the upgrade handshake, allowing for the following initialization:

```javascript
var ws = new WebSocket('wss://websockets.layer.com/?session_token=keuIjkPoPlkxw==',
    'layer-1.0');
ws.addEventListener('message', myMessageHandler);
```

## Packet Structure

To avoid confusion with Layer messages, events and notifications, we use the term `Packet` to describe messages received through the WebSocket.

Packets have a standard set of top-level fields described below.

| Field | Description |
|-------|-------------|
| **type** | change, request, response, signal |
| **timestamp** | The server timestamp of the notification. |
| **body** | The details of the request being made |
| **counter** | WebSocket index; used for detecting missed packets. |


Packets will be named by the `type` field in this document:

* **Change Packet**: Reports on resources that have changed on the server
* **Request Packet**: The client sends this to request an operation from the server
* **Response Packet**: The server sends this in response to a Request Packet
* **Signal Packet**: An ephemeral event such as typing indicator is sent to or from the server

## Managing a Websocket

Websockets can close for a variety of reasons, caused by the client, the network or the server.  You should be prepared to create a new websocket when the old one closes.  When your session-token is either deleted or expired, the websocket session will automatically close as well.

On reopenning a websocket, you can [catch up on missed events](#recovery).

## Sample Code
For sample code, visit the [Layer for Web Sample Code](https://github.com/layerhq/samples-web-apis) repo on Github.
