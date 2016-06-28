# Layer Client API Change Log

## ENTER RELEASE DATE HERE

Identity is now a core part of the Client APIs, simplifying building chat into your applications in a variety of ways.  This involves major changes to the API.

This is a major version increment, and can only be accessed by updating your `Accept` header in REST requests, and your `protocol` for WebSocket connections.

This update contains breaking changes to the APIs and existing integrations will need to be updated to take advantage of the new capabilities.

### Changes

* Websocket Connections require `layer-2.0` for the `protocol`
* All REST API requests require `Accept: application/vnd.layer+json; version=2.0`
* Websocket now uses `operation` value of `update` instead of `patch` (this is as documented, but not as implemented)
* All processing of Websocket Change events with Operation of `patch` should now expect an operation string of `update`
* Introduces the [Identity Object](../introduction/identity) and [Identity API](../rest/identity).
* Throughout the APIs, use of `user_id` values is replaced with the user of either Layer Identity IDs or Layer's Basic Identity Objects. Affected APIs include:
    * Conversation Object `participants` array
        * Creating a conversation now takes Layer Identity IDs; Conversion can be done as `"layer:///identities/" + encodeURIComponent(userId)`
        * Sending/Receiving Changes to participants has a new Layer Patch syntax
        * The `participants` array returned by the server is an array of Basic Identity Objects
    * Message/Announcement Object `sender` object
        * Messages from server now have `sender` as a Basic Identity
        * Support for `sender.name` to represent a Bot is no longer supported.  Both users and Bots will have an Identity, and that Identity will be in the `sender` object.
    * Message/Announcement Object `recipient_status` object
        * Messages from server now use a hash of Layer Identity IDs rather than User IDs


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
