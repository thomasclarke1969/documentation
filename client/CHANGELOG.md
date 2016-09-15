# Layer Client API Change Log

## September 15, 2016

#### Bug Fixes

* Formerly, you'd get a `503 Service Unavailable` error response (with `code` of `1` in the Error object) not only when a dependent service was unavailable, but also when any unexpected exception occurred.  We now distinguish those scenarios properly.  Now you'll get `500 Internal Server Error` (with `code` of `100`) if something unexpected happens.  If you see a `500`, please report it to us immediately, particularly if it's repeatable.

## August 30, 2016

#### Bug Fixes

* Users who left a conversation with `?mode=my_devices&leave=true` and were subsequently re-added were seeing an empty `participants` list.  Now the full list is back in all its glory.

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
