# Webhooks

While some applications just want to let users chat, any service that wants to have chat integrated with their service will need webhooks.  Using webhooks, you can subscribe to Message and Conversation events and use these to integrate Layer into your service.  When Messages and Conversations are created or changed, Layer will send an HTTP request to your server allowing your service to take appropriate actions.  Webhooks can drive features such as:

* Add context to conversations: respond to messages mentioning keywords
* Notify another user when they are @mentioned
* Notify users of messages that have remained unread for too long
* Integrate a third-party service (Uber API, Weather Underground, etc) into conversations based on context


### Requirements

You must have a webserver able to receive HTTP/1.1 requests and able to support keepalive requests.

### Setup

Webhooks can be configured using the Layer [Developer Dashboard](https://developer.layer.com/projects/integrations), or using a [REST API](/docs/webhooks/rest).
