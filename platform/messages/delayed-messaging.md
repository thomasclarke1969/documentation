# Delayed Messaging with Typing Indicators

This feature allows you to schedule a message for delivery in the near future, optionally including a typing indicator while in the delay period.

This is done using the same endpoint and object format as [sending any other message](/docs/platform/messages#send-a-message), with the addition of the `schedule` object.

```request
POST /apps/:app_uuid/conversations/:conversation_uuid/messages
```

### Example Request: Sending a Delayed Message

```json
{
    "sender": {
        "name": "nicebot"
    },
    "parts": [
        {
            "body": "Good morning!  How can I help you today?",
            "mime_type": "text/plain"
        }
    ],
    "schedule": {
        "delay_in_seconds": 5.0,
        "typing_indicator_in_seconds": 3.0
    }
}
```

### Successful Response

```text
202 (Accepted)
```

### Parameters

| Name    | Type | Min Value | Max Value |  Description  |
|---------|------|-----------|-----------|---------------|
| **schedule** | object |  |  | When present, the message will be sent after a delay |
| **schedule.delay_in_seconds** | number | 1.0 | 300.0 | Delay before the message is sent |
| [**schedule.typing_indicator_in_seconds**](#botnote) | number | 1.0 | min(300.0, delay_in_seconds) | (optional) Duration for which a typing indicator is displayed |

<a name="botnote"></a>
```emphasis
** NOTE **:
When a typing indicator is scheduled, its duration is "anchored" to the end of the message delay.
```


```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"parts": [{"body": "Hello world", "mime_type": "text/plain"}], "notification": {"text": "Howdy"}, "sender": {"name": "Your Master"}, "schedule": {"delay_in_seconds": 5.0, "typing_indicator_in_seconds": 3.0}}' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_UUID/messages
```

### Examples

Wait 3.4 seconds, type for 4.6 seconds, then send the message:

```json
    "schedule": {
        "delay_in_seconds": 8.0,
        "typing_indicator_in_seconds": 4.6
    }
```

Start typing immediately, type for 6 seconds, then send the message:

```json
    "schedule": {
        "delay_in_seconds": 6,
        "typing_indicator_in_seconds": 6
    }
```

Send a message after 10 seconds with no typing indicator:

```json
    "schedule": {
        "delay_in_seconds": 10
    }
```

### Caveats

Here are some things to consider when using the delayed messaging feature:

1. The conversation could be deleted during the delay.  If this happens, the message will obviously not be sent.
1. The sender could be removed from the conversation during the delay.  Likewise, the message will not be sent in this case.
1. Even though we support fractional second delays, don't be surprised if you see a bit of additional latency (on the order of 250ms) as a result of the queueing system, and a bit more for message delivery.  In other words: you can't set your watch by this feature, but it will be very close.
