# Layer Client API Change Log

## ENTER RELEASE DATE HERE

Identity is now a core part of the Client APIs, simplifying building chat into your applications in a variety of ways.  This involves major changes to the API.

This is a major version increment, and can only be accessed by updating your `Accept` header in REST requests, and your `protocol` for WebSocket connections.

This update contains breaking changes to the APIs and existing integrations will need to be updated to take advantage of the new capabilities.

### Changes

* Introduces the [Identity Object](../introduction/identity) and [Identity API](../rest/identity).  This change also results in replacing the `user_id` as the primary means of Identifying a user; users are now identified using a Layer ID: `layer:///identities/your_user_id`.  The introduction of the Identity Object and the new way of Identifying users results in the following changes:
    1. All Conversation Creation must use an array of Identity `id` strings instead of `userId` strings; Conversion can be done as `"layer:///identities/" + encodeURIComponent(userId)`
    2. All Participant PATCH operations must replace `"value": "userId"` with `"id": "layer:///identities/" + encodeURIComponent(userId)`
    4. All processing of Websocket Change events with Operation of `patch` should now expect an operation string of `update`
    5. All Websocket change events that update `participants` will Identify the Participant by `id` rather than by `value`.  further, all `add` events will contain a `value` that represents a Basic Identity Object.
    6. All REST API calls for updating the `participants` will identify the user in the Patch operation using `"id": "layer:///identities/user_id"` rather than `"value": "user_id"`
    7. All `recipient_status` properties will be based on `layer:///identities/user_id` rather than `user_id`
    8. Any Conversation object returned by the server will contain an array of Basic Identities, not `user_id` strings.
    9. All Message `sender` properties now contain an Identity Object, allowing easy rendering of sender information.
* To have access to these changes, update Websocket Connect code to use `layer-2.0` for the `protocol` and REST API `Accept` Header to use `application/vnd.layer+json; version=2.0`

## April 29, 2016
 Announcements and fixes

 #### Enhancements

 * New APIs to access announcements. Receipts and deletion are supported. Announcements can only be sent via the platform api

#### Bug Fixes

* When paginating through Messages, on the final page the `Layer-Count` header will continue to return the total number of results. Previously it would start returning the number of results in the final page

## April 5, 2016

Improved deletion functionality.

#### Enhancements

* Deleting Conversations and Messages can now be done for `my_devices` or for `all_participants`
* Deleting Conversations can be accompanied by a `leave=true` parameter to remove the user from the Conversation.
* Deleting with `destroy=true` is now deprecated; use `mode=all_participants` instead.

## March 29, 2016

Deduplication Support added.

#### Enhancements

* There is now deduplication support when sending a `POST` request to create a Message or Conversation.

## January 21, 2016

Adds support for running apps from a WebView.

#### Enhancements

* Register a device for [Push Notifications](rest#push-tokens) to support mobile apps running a WebView.

## January 8, 2016

#### Bug Fixes

* Fixed sorting by `last_message` and paginating.
* Optimized posting conversations

## November 12, 2015

#### Bug Fixes

* The `Layer-Count` header is now returned with all collections, and not solely when there are more resources to load.
* Improved handling of WebSockets and XHR requests that involve a deleted Session Token
* The `last_message` property is now returned when a Create Conversation request returns an existing Distinct Conversation.
* Fixes overly long timeouts

#### Enhancements

* Conversations can now be sorted by `last_message.sent_at`, not just by `created_at`.
* Now supports `X-HTTP-Method-Override: PATCH` as an alternate way of issuing a PATCH request.


## October 6, 2015

Initial public release

#### Enhancements

* Authentication
* CRUD methods on conversations, messages, and content
* Websocket notifications
* Websocket conversation and message creation methods
