# Layer Platform API Change Log

## August 30, 2016

#### Bug Fixes

* Users who left a conversation with `?mode=my_devices&leave=true` and were subsequently re-added were seeing an empty `participants` list.  Now the full list is back in all its glory.

## June 21, 2016

#### Enhancements

* Response objects have explicit `null` where before the attributes were simply absent.
* When making a request on behalf of a user (i.e. `/apps/:app_uuid/users/:user_id/...`), if that user _does not exist in our system yet_, you will get a `404` response with a clear error.  Prior to now, the user was always created in our system on the fly.

## June 9, 2016

#### Enhancements

* Add support for sending delayed messages with typing indicators.

## May 5, 2016

#### Enhancements

* Add support for configuring default session TTL.
* Add support for deleting sessions.

## March 1, 2016

#### Enhancements

* Add support for deleting messages.

## February 24, 2016

#### Enhancements

* Add support for rich content.  Now you can post messages with content exceeding 2KB.  This functionality has existed in Client API since day one, and Platform API now supports it as well.

## January 11, 2016

#### Enhancements

* Add new message data access APIs.  These enable you to retrieve a list of messages or a single message from a conversation, either on behalf of a participant or irrespective of user.

## December 29, 2015

#### Bug Fixes

* Conversation creation with metadata is now atomic, meaning you won't get separate webhooks calls for conversation creation and metadata update.

## December 23, 2015

#### Enhancements

* Add new user-specific conversation data access APIs.  These enable you to access one or all of a given user's conversations in the context of that user -- meaning additional attributes such as unread count, last message, etc.

## November 30, 2015

#### Deprecations

* Discontinued support for `"recipients": "everyone"` when sending announcements.

## November 18, 2015

#### Bug Fixes

* Recipient status for the sender of a message is now `read` instead of `sent`.

## October 9, 2015

#### Enhancements

* The conversation object now has a `messages_url` attribute.

## September 30, 2015

#### Bug Fixes

* Deleting an already-deleted conversation is treated as a success now.

## September 24, 2015

#### Bug Fixes

* Fixed an issue with base64 encoded non-UTF-8 binary data in message parts.

## September 23, 2015

#### Enhancements

* Add support for deleting conversations.

## September 16, 2015

#### Enhancements

* Add support for bulk block list manipulation.
* Add support for the `X-HTTP-Method-Override` header.
* Change `303` to `200` response status when a `distinct` conversation exists.

## September 3, 2015

#### Enhancements

* Add support for version `1.1` with new interactive push notification format.
* Content negotiation is now required.

## August 21, 2015

#### Bug Fixes

* Respond with `500` status code (formerly `503`) for internal server errors.
* Serve an appropriate error when an inline message part body is >2kb.
* Return `503` if an announcement cannot be enqueued.

## August 2, 2015

#### Bug Fixes

* Set `url` in all error responses.
* Graceful handling of invalid base64 encoded message part bodies.
* Fix conversation creation with metadata and no participants.

## July 10, 2015

#### Bug Fixes

* Simultaneous use of `sender.name` and `sender.user_id` is now treated as an error.

## July 9, 2015

#### Bug Fixes

* Proper and graceful handling of method rejection (`405 Method Not Allowed` with an `Allow` header).

## June 23, 2015

#### Enhancements

* Add support for patching conversation metadata.

## June 17, 2015

#### Enhancements

* Add support for creating distinct conversations with metadata.
* When sending an announcement, `"everyone"` must now be explicit (formerly implied).

## June 5, 2015

#### Enhancements

* Add support for patching conversation participants.

## June 4, 2015

#### Enhancements

* Add support for sending announcements.
* Add blocking policy APIs.
