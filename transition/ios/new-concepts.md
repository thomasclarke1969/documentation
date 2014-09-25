# New Concepts

## Authentication

As mentioned above, our new authentication architecture allows you to authenticate users within the Layer service without sharing credentials. With this architecture, your backend application will act as an identity provider for your client application. It will need to generate [identityTokens](https://docs.google.com/a/layer.com/document/d/1isApNdOIZ70f_sfpufyQd98Lkfe1pSziNLdd6d774pM/edit#heading=h.yu9aq0rirnxj)[ ](https://docs.google.com/a/layer.com/document/d/1isApNdOIZ70f_sfpufyQd98Lkfe1pSziNLdd6d774pM/edit#heading=h.yu9aq0rirnxj)on behalf of your application, which will in turn be used to to authenticate your users within the Layer service. For instructions on how to implement Layer Authentication, please see the [Layer Authentication Guide](https://docs.google.com/a/layer.com/document/d/1isApNdOIZ70f_sfpufyQd98Lkfe1pSziNLdd6d774pM/edit#heading=h.fmjl82sm01k2).

Below are the new public methods that your application will need to implement in order to authenticate the LYRClient.

```
//Requests an authentication nonce from Layer.
- (void)requestAuthenticationNonceWithCompletion:(void (^)(NSString *nonce, NSError *error))completion;

//Submits an identity token obtained from your backend application to Layer for validation
- (void)authenticateWithIdentityToken:(NSString *)identityToken completion:(void (^)(NSString *authenticatedUserID, NSError *error))completion;
```

## Conversations

The Layer SDK V0.8 brings the notion of a ‘Conversation’ front and center. Whereas with the early access SDK, messages were sent to a specific LYRAddress, with the latest release, you explicitly create conversation objects and send messages with the context of that conversation. This represents a much more intuitive way to work with ongoing streams of communication between one or many users.

## Participants

As mentioned above, we have dropped the notion of a Layer address. Going forward messages will be routed based on participation in a conversation. Conversation objects are now initialized with an array of participants (which is simply an array of user identifiers) and all participants will receive all messages sent within the context of that conversation. The following public method on LYRClient can be used to create a new conversation with a list of participants.

```
//This method provides a flexible mechanism for retrieving or creating conversations.
- (LYRConversation *)conversationWithIdentifier:(NSString *)identifier participants:(NSArray *)participants;
- ```


Additionally, we have added the ability to add or remove participants from an existing conversation. Participants added to an existing conversation will have access to all previous messages sent within the context of that conversation.

## Message Parts

LYRMessageParts represent a piece of content embedded within a message. Each part has a specific MIME Type identifying the type of content it contains. Messages may contain an arbitrary number of parts with any MIME Type that the application wishes to support. The following are public methods on the LYRMessagePart object used to create LYRMessageParts.

```
+ (instancetype)messagePartWithMIMEType:(NSString *)MIMEType data:(NSData *)data;


+ (instancetype)messagePartWithMIMEType:(NSString *)MIMEType stream:(NSInputStream *)stream;


+ (instancetype)messagePartWithText:(NSString *)text;
```

## Metadata

To make LayerKit as extensible as possible we are introducing the concept of Metadata. Metadata allows you to synchronize contextually relevant information about your conversations or messages among participants and devices. Technically speaking, this allows you to associate Key-Value stores of information with any LYRConversation or LYRMessage object. Context comes in two flavors

  * **Private Metadata** - Information that is available to all participants in a Conversation. A  conversation may have a topic that is assigned by the participants represented as a string value within the metadata dictionary.
  * **Public Metadata**- Information that is private to a given participant, but synchronized among all of their devices. An application may wish to designate certain conversations as being favorites of the current user or allow the user to annotate the conversation with contextual notes for future reference.

## Sync Notifications

The Layer client now provides a flexible notification system for informing applications when changes have
occured on domain objects in response to synchronization activities. The system is designed to be general purpose and alerts your application to the creation, update, or deletion of an object. Changes are modeled as simple dictionaries with a fixed key space.

LayerKit leverages key-value observing to notify your application when changes occur. Your application should observe `LYRClientObjectsDidChangeNotification` in order to recieve notifications.

```objectivec
[[NSNotificationCenter defaultCenter] addObserver:self
									     selector:@selector(didReceiveLayerObjectsDidChangeNotification:)
                                             name:LYRClientObjectsDidChangeNotification object:layerClient];
```

## Deletion

Many of our early access customers asked for the ability to delete messages and conversations. Based on this feedback, we are introducing deletion functionality. When a message or conversation is deleted, that event is synchronized across all devices, revoking the object and any corresponding data from local data store.

```
- (BOOL)deleteMessage:(LYRMessage *)message error:(NSError **)error;

- (BOOL)deleteConversation:(LYRConversation *)message error:(NSError **)error;
```


## Auto Downloads

While LayerKit supports the synchronization of any payload type up to 100KB.  To help applications efficiently download their content, we are introducing the ability for developers to dictate which MIMETypes they would like the SDK to automatically download. MIMETypes that are not automatically downloaded can be fetched whenever the application requires the resource via the following method.  
