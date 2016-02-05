# Webhooks

While some applications just want to let users chat, any service that wants to have chat integrated with their service will need webhooks.  Using webhooks, you can subscribe to Message and Conversation events and use these to integrate Layer into your service.  When Messages and Conversations are created or changed, Layer will send an HTTP POST request to your server allowing your service to take appropriate actions.  Webhooks can drive features such as:

* Add context to conversations: respond to messages mentioning keywords
* Notify another user when they are @mentioned
* Notify users of messages that have remained unread for too long
* Integrate a third-party service (Uber API, Weather Underground, etc) into conversations based on context


## Requirements

1. Your server must be able to receive `HTTP/1.1` requests and able to support keep-alive requests.
2. Your server needs to respond to `HTTP GET` on your target URL for [verification](/docs/webhooks/rest#verify) purposes.
3. Your server needs to respond to `HTTP POST` on your target URL to capture event [payloads](/docs/webhooks/payloads).

## Setup

Webhooks can be configured using the Layer [Developer Dashboard](https://developer.layer.com/projects/integrations), or using a [REST API](/docs/webhooks/rest).
