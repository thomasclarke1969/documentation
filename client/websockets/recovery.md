# Recovery

A lot can go wrong on a network.  It could be as simple as a laptop going to sleep, a mobile phone going out of reception, or as ugly as DNS issues.  Ultimately, connections are lost, change packets are missed, and apps need to recover and re-sync.  The recovery tools provides three services:

1. Detecting that an event has been missed
2. Detecting that a connection is no longer alive and must be restarted
3. Requesting missed events

## Detecting Missed Events

Sketchy wifi or mobile connections can cause a connection to be lost and restored without any hint that a message was lost.  Some browsers (Chrome in particular) will attempt to restore a connection rather than report a problem with the connection.

To insure that no events are missed, each event contains a counter.  The counter is associated with the session rather than the event itself (thus we cannot request an event by its counter).

A given WebSocket connection will get an incrementing counter with each message it receives from the server. When a connection is established, the counter is set to 0. When a connection is recreated, its reset to 0. The first Packet will have a counter value of 0, the next message will have a counter value of 1, etc...

A client should expect to see the counter increment by one between each packet.  If it ever increments by more than one, the client can see that it has missed events, and will request missed packets from the server.  If it ever resets to zero, then the client knows that the connection was lost and reconnected automatically.

In the event that the counter has changed by a value other than +1, an `Event.Replay` request can be issued.

## Monitoring Connection Health

JavaScript based WebSocket may not always detect that you have lost a connection.  Chrome in particular will not detect that a WebSocket has lost a connection.  As such, recommended practice is to send "ping" requests through the WebSocket every 30 seconds.  Mobile devices and backgrounded tabs may chose to vary this recommendation to preserve battery life. If the WebSocket connection has been lost and you send a ping request, even Chrome will throw a connection error letting you know that there is a problem and that you may be failing to receive Change Packets.

A ping operation is done by sending a `Counter.read` request to the server.  There are four possible outcomes of this request:

1. The connection fails, and the WebSocket throws an error
    * **Next Step**: initiate reconnect logic, and catchup on missed events on reconnecting.
2. The request fails to return a response (after waiting for 10 seconds, if there is no response, its safe to assume there is a problem).
    * **Next Step**: initiate reconnect logic, and catchup on missed events on reconnecting.
3. A response containing a counter arrives; the counter is the same as the last packet from the server.  All is well.
    * **Next Step**: none.
4. A response containing a counter arrives; the counter has changed; this means Change Packets were probably missed.
    * **Next Step**: Catchup on missed events

### Sending a Ping Request

The following simple script can be used to send the Ping request:

```javascript
window.setInterval(function() {
    mysocket.send(JSON.stringify({
        "type": "request",
        "body": {
            "method": "Counter.read",
            "request_id": "fred.flinstone.31"
        }
    }));
}, 30000);
```

### Connection Error Handling

If there is a connection problem, your ping request should cause the websocket to realize that and then trigger your onError handler. The following retry logic should continue to call your onError handler until you are back online.  Varying the 15 seconds suggested below with some exponential backoff may make sense depending upon your environment.

Note that this error handler can fire due to your ping requests, but may also fire during the normal lifespan of your Websocket connection.

```javascript
mysocket.addEventHandler("error", myErrorHandler);

function myErrorHandler(err) {
    // On Error: Wait 15 seconds and then create a new websocket
    window.setTimeout(function() {
        mysocket = new WebSocket('wss://websockets.layer.com/?session_token=donuts==',
                           'layer-1.0');

       // On successfully opening the websocket, replay missed events
       mysocket.addEventListener("open", function() {
            // How to implement this is described in the next section
            replayFrom(lastEvent.timestamp);
       });

       // Bind this new websocket's error handler to this handler
       mysocket.addEventHandler("error", myErrorHandler);
    }, 15000);
}
```

```emphasis
Note that if you do NOT have the ping request firing periodically, you may go hours without any Change Packets from the server, nor will there be any clue to your user that they are no longer connected to the server.
```


### Using the Ping Response

The response to a ping will contain the current event counter.  Note that the `counter` field will increment as a result of this response, but that the `counter` value returned in the data field will represent the state of the counter at the time of the request.  This means:

1. You will get back a `counter` field in the `data` object, and a second `counter` field in the high level response
2. These two counters will always be different values (`data` reports on the counter of the last packet sent to the client, the response reports the counter associated with this response packet).

```json
{
  "type": "response",
  "timestamp": "2015-01-19T09:15:43+00:00",
  "counter": 36,
  "body": {
    "request_id": "fred.flinstone.31",
    "method": "Counter.read",
    "data": {
      "counter": 35
    }
  }
}
```

The simplest way to use this response is to focus on the high level counter:

```javascript
 ws.addEventListener('message', onMessage);
 var lastCounter = -1;
 function onMessage(evt) {
   var msg = JSON.parse(evt.data);
   var skippedCounter = lastCounter + 1 !== msg.counter;
   lastCounter = msg.counter;
   if (skippedCounter) replayEvents();
 }
```

This code snippet works regardless of whether the message received is a new Conversation, a read receipt, or the response to a Ping.

### When Not to Ping

Ideally, pinging would not be done if any WebSocket messages have been recently received:

```javascript
var intervalId;
var requestIDCounter = 0;
function restartPing() {
    if (intervalId) window.clearInterval(intervalId);
    intervalId = window.setInterval(function() {
        ws.send(JSON.stringify({
            "type": "request",
            "body": {
                "method": "Counter.read",
                "request_id": "fred.flinstone." + requestIDCounter++
            }
        }));
    }, 30000);
}

mysocket.addEventListener("message", function(evt) {
   restartPing();
});
```


## Requesting Missed Events

A request can be sent to replay events.  The result of this request will be to redeliver all Change Packets from the specified timestamp until the present, followed by a Response Packet.

The request involves the following parameters:

| Field | Description |
|-------|-------------|
| **from_timestamp** | The timestamp to replay events from. |

```json
{
  "type": "request",
  "body": {
    "method": "Event.replay",
    "request_id": "fred.flinstone.1003",
    "data": {
      "from_timestamp": "2014-09-09T04:44:47+00:00"
    }
  }
}
```

Note that when all events are replayed, some Change Packets you receive may have been previously received, and some care must be taken in processing these:

* Processing a Create Packet should verify that you haven't already created the object
* Processing a Delete Packet may find you've already deleted the object
* Processing a Update Packet may result in no value change if you've previously received that event

When the replay has completed, the server will send the following Response Packet:

```json
{
  "type": "response",
  "counter": 10053,
  "timestamp": "2014-09-09T04:54:47+00:00",
  "body": {
    "method": "Event.replay",
    "request_id": "fred.flinstone.1003",
    "success": true
  }
}
```
