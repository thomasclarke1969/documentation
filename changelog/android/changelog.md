## 0.9.0

LayerKit v0.9.0 includes numerous feature enhancements and API changes in preparation for the upcoming 1.0 release. The API changes were made to 
make LayerKit more intuitive and prepare for future platform enhancements. These changes are detailed in the [LayerKit v0.9.0 Transition Guide](https://developer.layer.com/docs/transition-guide/ios#v0.9.0).

#### Public API changes

* Layer object initializers were changed such that Conversations and Messages must now be initialized through the client instead of directly via the class. This change enables object identifiers to be populated earlier and is part of a larger migration of functionality from the client onto the model objects themselves.
* `[LYRConversation conversationWithParticipants:]` has been deprecated in favor of `[LYRClient conversationWithParticipants:options:error:]`.
* `[LYRMessage messageWithConversation:parts:]` has been deprecated in favor of `[LYRClient newConversationWithParticipants:options:error:]`.
* `[LYRMessage messageWithConversation:parts:]` has been deprecated in favor of `[LYRClient newMessageWithConversation:parts:options:error:]`.
* Push Notification alert text and sounds can now be assigned at Message initialization time via the `options:` argument.
* `[LYRClient setMetadata:onObject:]` has been deprecated in favor of the `LYRMessage` options and `LYRConversation` mutable metadata API's.
* `[LYRClient addParticipants:toConversation:error:]` has been deprecated in favor of `[LYRConversation addParticipants:error:]`.
* `[LYRClient removeParticipants:fromConversation:error:]` has been deprecated in favor of `[LYRConversation removeParticipants:error:]`.
* `[LYRClient sendMessage:error:]` has been deprecated in favor of `[LYRConversation sendMessage:error:]`.
* `[LYRClient markMessageAsRead:error:]` has been deprecated in favor of `[LYRMessage markAsRead:]`.
* `[LYRClient deleteMessage:mode:error:]` has been deprecated in favor of `[LYRMessage delete:error:]`.
* `[LYRClient deleteConversation:mode:error:]` has been deprecated in favor of `[LYRConversation delete:error:]`.
* `[LYRClient sendTypingIndicator:toConversation:]` has been deprecated in favor of `[LYRConversation sendTypingIndicator:]`;
* `[LYRClient conversationForIdentifier:]` has been deprecated, use querying support to fetch conversations based on identifier.
* `[LYRClient conversationsForIdentifiers:]` has been deprecated, use querying support to fetch conversations based on a set of identifiers.
* `[LYRClient conversationsForParticipants:]` has been deprecated, use querying support to fetch conversations based on a set of participants.
* `[LYRClient messagesForIdentifiers:]` has been deprecated, use querying support to fetch messages based on a given set of identifiers.
* `[LYRClient messagesForConversation:]` has been deprecated, use querying support to fetch messages for specific conversation.
* `[LYRClient countOfConversationsWithUnreadMessages:]` has been deprecated, use querying support to count all unread messages.
* `[LYRClient countOfUnreadMessagesInConversation:]` has been deprecated, use querying support to count unread messages for given conversation.
* `LYRMessage` and `LYRConversation` objects now use a consistent identifier scheme that won't change.
* `LYRMessagePushNotificationAlertMessageKey` key constant has been deprecated in favor of `LYRMessageOptionsPushNotificationAlertKey`.
* `LYRMessagePushNotificationSoundNameKey` key constant has been deprecated in favor of `LYRMessageOptionsPushNotificationSoundNameKey`.

#### Enhancements

* `LYRConversation` now supports synchronized, mutable developer assigned metadata. Metadata is synchronized across participants on a per-key basis using last writer wins semantics. See the header documentation on `LYRConversation` for details of the API.
* Added querying for conversations and messages, see `LYRQuery` and `LYRPredicate`.
* Added query controller that can be used to drive the UI, see `LYRQueryController`.

#### Bug Fixes

* Fixes an issue where the LYRClient might crash when detecting a remotely deleted conversation leaving the client with unsent changes that fail to get reconciled.
* Fixed an issue where push device tokens would not be updated after a connection was established in some circumstances.

## 0.8.8

#### Bug Fixes

* Fixes an issue where LYRClient might crash if a user had deleted a conversation locally and then received a global deletion of a conversation caused by other participant.
* Fixes an issue where LYRClient might produce two different object instances when fetching objects.
* Fixes an issue where LYRClient wasn't capable of receiving pushed events via transport after transitioning into an active application state. 
* Fixes an issue where LYRClient crashed when dealing with outdated membership changes for deleted conversations.
* Fixes an issue where LYRClient crashed when allocating the work load across synchronization cycles.
* Fixes an issue where LYRClient tried to open push channel even when in unauthenticated state.

## 0.8.7

#### Enhancements

* Added typing indicators, see LYRClient.h for more details.
* Enhanced connection management to handle connectivity situations where the server is reachable but unresponsive.

#### Bug Fixes

* `LYRClient` now schedules a synchronization process as the `UIApplication` becomes active.
* Message recipient status change notification behavior was updated to be more predictable and consistent.
* Fixed an issue with the calculation of message part size limits.
* Session state is now segregated by appID, facilitating graceful authentication handling when switching between appID's (i.e. between staging and production).
* Fixed an issue in the storage of user identifiers that could result in incorrect querying by participants for applications that use very large numeric values for user ID's.

## 0.8.6

##### Bug Fixes

* Ensure that Layer managed database files have the `NSURLIsExcludedFromBackupKey` resource value applied.

## 0.8.5

#### Bug Fixes

* Fixes an issue when querying against certain sets of participant user identifiers.

## 0.8.4

#### Bug Fixes

* Removed a faulty migration file from the resources bundle.

## 0.8.3

#### Public API changes

* `layerClient:didFinishSynchronizationWithChanges` changed to `layerClient:objectsDidChange:`
* `layerClient:didFailSynchronizationWithError` changed to `layerClient:didFailOperationWithError:`
* `deleteConversation:error:` changed to `deleteConversation:mode:error:`
* `deleteMessage:error:` changed to `deleteMessage:mode:error:`

#### Enhancements

* Improved stability and performance around the synchronization process.
* Improved performance on public API methods.
* Added support for local object deletion (see LYRClient.h for more info).
* Performing conversation and message fetches from different threads doesn't cause them to lock anymore.
* `LYRClient` now manages connection state.
* `LYRClient` now reports more friendly network errors.

#### Bug Fixes

* Fixed an issue where the `lastMessage` property didn't get updated regularly.
* Fixed an issue where it occasionally caused an DATABASE BUSY log warning.

## 0.8.2

#### Bug Fixes

* Fixed the "Database in use" warnings.
* Fixed an issue where frequent calls to markMessageAsRead on the same object caused an EXC_BAD_ACCESS error.
* Added countermeasures to prevent synchronization of duplicate conversations and messages.
* LayerKit doesn't raise an exception if user de-authenticates during a synchronization process.

## 0.8.1

#### Bug Fixes

* Fixed a symbol collision with a third-party dependency.

## 0.8.0

#### Enhancements

* Updated LayerKit to communicate with the new developer.layer.com environment.
* Added `isConnecting` to the `LYRClient` public API for introspecting connection status.

#### Bug Fixes

* Assertion on an intermittent bug that is very hard to reproduce. We encourage developers to send us the crash report (the traced error message, exception and the stack trace).
* Improved handling of Push Notifications when transitioning between active, inactive, and background states.
* LYRClient now calls the `layerClient:didFinishSynchronizationWithChanges:` delegate method even if there weren't any changes.
* LYRClient now validates for the maximum number of participants in `sendMessage:` and `addParticipants:` method.
* Fixed an issue where the LYRClient would crash if it received a `nil` message part data.
* LayerKit will now properly handle transport of zero length message parts.

## 0.7.21

#### Bug Fixes

* Improved handling of Layer platform push events while executing in the background.
* Fixed an issue where user generated object identifiers with lowercase strings weren't recognized by `conversationForIdentifiers` or `messagesForIdentifiers`.

## 0.7.21-rc1

#### Bug Fixes

* Fixed a potential crash when the client is asked to establish a connection while a connection attempt is already in progress.

## 0.7.19

#### Enhancements

* Reduced the number of reads in the synchronization process.
* Synchronization work load more consistent across synchronization cycles.
* Improved performance in internal pattern matching logic.

## 0.7.18

#### Bug Fixes

* Fixed an issue where `setMetadata:forObject` queued the message for sending.
* Fixed an intermittent issue where a message got stuck at the end of the conversation forever.

## 0.7.17

#### Enhancements

* Synchronization process doesn't block fetching methods anymore.

#### Bug Fixes

* Fixed an issue where fetching objects during synchronization caused incomplete mutations.

## 0.7.16

#### Bug Fixes

* Fixed an issue where deleted messages brought the conversation into an inconsistent state.
* Fixed an issue where in some situations `lastMessage` property didn't get updated.
* Fixed an issue where conversation synchronization aborted due to a network error resulted in local conversation deletion.
* Fixed an issue where the transport became unresponsive for a moment.

## 0.7.15

#### Enhancements

* Improved performance when synchronizing large data sets.
* Enhanced concurrency and cancellation behaviors in synchronization engine.

#### Bug Fixes

* Fixed SQL errors logged due to persistence of duplicated delivery and read receipts.
* Fixed an error when an attempt is made to delete a Conversation that was already deleted by another participant.
* Fixed an issue where the `sentAt` timestamp was incorrectly truncated on 32 bit processors.
* Fixed several Keychain Services errors.
* Fixed an issue where Push Notification device tokens were not guaranteed to be transmitted across authentication changes.
* Fixed an intermittent issue where `conversationsForParticipants:` could inappropriately return `nil`.
* `LYRClient` delegate method `layerClient:didFailSynchronizationWithError:` now only reports a single error if synchronization fails.

## 0.7.14

#### Enhancements

* LayerKit is now compatible with iOS 8 on an experimental basis.

#### Bug Fixes

* Fix exception related to marking messages as read.

## 0.7.13

#### Enhancements

* All public API methods that accept a collection now perform type checks to provide clear feedback on input violations.

#### Bug Fixes

* LYRClient reports unprocessable pushed payloads via `layerClient:didFailSynchronizationWithError:`.
* The sync engine will no longer attempt to write delivery receipts when you are no longer a participant in a Conversation.
* conversationsForParticipants: didn't fetch any conversations.

## 0.7.12

#### API changes

* Method `conversationForParticipants:` which returned a single result, changed to `conversationsForParticipants:` which now returns a set of conversations.
* `LYRMessage`'s `recipientStatusByUserID` property now populated immediately after the `sendMessage:` call.
* LYRConversation's `conversationWithParticipants:` method now accepts an `NSSet` instead of an `NSArray` of participants.
* LYRClient's `conversationsForParticipants:` method now accepts an `NSSet` instead of an `NSArray` of participants.
* LYRClient's `addParticipants:toConversation:error:` method now accepts an `NSSet` instead of an `NSArray` of participants.
* LYRClient's `removeParticipants:fromConversation:error:` method now accepts an `NSSet` instead of an `NSArray` of participants.

#### Enhancements

* Many API methods on `LYRClient` will now validate authentication state and log warnings when invoked from an unauthenticated state.
* `LYRClient` will now enforce a single authentication request limit. If concurrent authentication cycles are begun the latest request will cancel its predecessors.

#### Bug Fixes

* Attempts to authenticate while already connected will now return errors.
* Silent push notifications no longer start synchronization.
* Fixed an issue where incorrect conversations could be returned by `conversationForParticipants:`.
* Object change notifications will no longer return non-uniqued instances of a given object.
* Receivers don't generate delivery events anymore for messages already marked as delivered or read.
* `conversationsForParticipants:` will now implicitly include the current user in the queried set.
* Fixed an issue where messages sent during a synchronization process had incorrect index values.

## 0.7.11

#### Enhancements

* Distribution is now done via an .embeddedframework for easier non-CocoaPods installation.

#### Bug Fixes

* Fixed an issue with incorrect message ordering.
* Ensure that 64bit values are handled consistently across CPU architectures.
* Fixed a race condition that could result in multiple connection attempts from the client during push notifications.
* Ensure that the deauthentication callback is always delivered on the main thread.

## 0.7.10

#### Bug Fixes

* Miscellaneous internal bug fixes.

## 0.7.9

#### Enhancements

* Deauthentication now includes a completion callback.

#### Bug Fixes

* Ensure that `createdAt` is populated on `LYRConversation` objects
* Fixed issue wherein timestamp properties were incorrectly populated with the Epoch date.
* Fixed an issue where `lastMessage` could be nil during change notifications.
* The `LYRClient` delegate will no longer receive authentication challenge callbacks during initial connection (as documented).

## 0.7.8

#### Bug Fixes

* Fix issue with updating Push Notification tokens.

## 0.7.7

#### Bug Fixes

* Push Notification synchronization callbacks are now guaranteed delivery on the main thread, avoiding potential crashes.

## 0.7.6

#### Enhancements

* Internal improvements to client/server configuration negotiation.

## 0.7.5

#### Enhancements

* Message creation notifications are now delivered ahead of updates.

## 0.7.4

Initial preview release of LayerKit.
