# Typing Indicators

Typing Indicators are sent and received using Signal Packets.

The `body` field of a Signal Packet will contain the following fields:

| Field | Description |
|-------|-------------|
| **type** | The type of signal; "typing_indicator" |
| **object** | For signals that relate to a specific object, an optional object field has  been defined that matches the object field used in Create Packets. Required for typing indicators |
| **request_id** | Optional field for use when a confirmation response is desired |
| **data** | Custom data for the signal |

Note that the `object` field when sent from the server should have `id`, `url` and `type` to match Change Packets.  However, when the client sends these to the server, only `id` is needed.


## The `data` field

A Typing indicator uses the `data` field to indicate typing status, and which user that status is associated with:

| Field | Description |
|-------|-------------|
| **user_id** | The identifier of the user whose typing state has changed |
| **action**  | "started", "paused", "finished"; the new state of the typing indicator for that user |

Note that it is not required to send the `user_id` field when sending a typing indicator; this is automatically added by the server.

## Receiving a Typing Indicator Example

```json
{
 "type": "signal",
 "timestamp": "2015-01-19T09:15:43+00:00",
 "body": {
    "request_id": "fred.flinstone.95",
    "type": "typing_indicator",
    "object": {
      "type": "Conversation",
      "id": "layer:///conversations/e67b5da2-95ca-40c4-bfc5-a2a8baaeb50f",
      "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
    },
    "data": {
      "user_id": "12345",
      "action": "started"
    }
  }
}
```

## Sending a Typing Indicator Example

```json
{
 "type": "signal",
 "body": {
    "type": "typing_indicator",
    "request_id": "fred.flinstone.95",
    "object": {
      "id": "layer:///conversations/e67b5da2-95ca-40c4-bfc5-a2a8baaeb50f"
    },
    "data": {
      "action": "started"
    }
  }
}
```

## Working with Typing Indicators

A client should update its typing indicator state every 2.5 seconds. As long as the application considers the user to be actively typing, it should resend "started" every 2.5 seconds.  After a lag of no activity, "paused" should be sent, and should continue to be sent every 2.5 seconds.  Once "finished" is sent, no further typing indicators need to be sent to the server until the state has changed.

Any failure to receive a state update from the client will cause the server to automatically transition to the next state.  If "started" is sent to the server, and then no further states are sent, the server will automatically transition to "paused".  If the state is "paused" and no states are sent by the client, it will transition to "finished".
