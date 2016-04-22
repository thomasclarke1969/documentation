# Client Libraries

Interacting with the Layer Webhooks API is possible from every language and platform that supports HTTPS. There are several libraries that can make interaction with the API even easier:

## Official

| Language   | Library | Description |
|------------|---------|-------------|
| JavaScript | [layer-webhooks](https://www.npmjs.com/package/layer-webhooks) | Node.js library maintained by [layerhq](https://github.com/layerhq/node-layer-webhooks) for making REST calls to the Webhooks Service. |
| JavaScript | [layer-webhooks-services](https://www.npmjs.com/package/layer-webhooks-services) | Node.js library maintained by [layerhq](https://github.com/layerhq/node-layer-webhooks-services) for Registering webhooks with Layer, listening for webhook events from Layer, and passing them to your callbacks. |

## Demo Integrations

The following integrations are built on top of [layer-webhooks-services](https://www.npmjs.com/package/layer-webhooks-services).  These are not considered production grade, but are good examples of what can be done and how to go about it.

| Service    | Library | Description |
|------------|---------|-------------|
| Sendgrid Integration | [layer-webhooks-services-sendgrid](https://www.npmjs.com/package/layer-webhooks-services-sendgrid) | Detect Messages that have gone unread or undelivered, and email the user about the missed Message.    |
| Nexmo Integration    | [layer-webhooks-services-nexmo](https://www.npmjs.com/package/layer-webhooks-services-nexmo) | Detect Messages that have gone unread or undelivered, and SMS the user about the missed Message.    |
| Zendesk Integration  | [layer-webhooks-services-zendesk](https://www.npmjs.com/package/layer-webhooks-services-zendesk)  | Link Conversations to Zendesk tickets; messages sent in Tickets appear as Conversation Messages; Conversation Messages show as comments in Zendesk Tickets.  |


*Have a library you want noted on this page? Submit a pull request [here](https://github.com/layerhq/documentation/blob/master/platform/platform-api/libraries.md).*
