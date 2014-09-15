# New Concepts

## Authentication 

As mentioned above, our new authentication architecture allows you to authenticate users within the Layer service without sharing credentials. With this architecture, your backend application will act as an identity provider for your client application. It will need to generate identityTokenson behalf of your application, which will in turn be used to to authenticate your users within the Layer service. For instructions on how to implement Layer Authentication, please see the [Layer Authentication Guide](/docs/resources#authentication-guide). 

## Conversations

The Layer SDK V0.8 brings the notion of a ‘Conversation’ front and center. Whereas with the early access SDK, messages were sent to a specific LYRAddress, with the latest release, you explicitly create conversation objects and send messages with the context of that conversation. This represents a much more intuitive way to work with ongoing streams of communication between one or many users. 

## Participants

As mentioned above, we have dropped the notion of a Layer address. Going forward messages will be routed based on participation in a conversation. Conversation objects are now initialized with an array of participants (which is simply an array of user identifiers) and all participants will receive all messages sent within the context of that conversation. 


Additionally, we have added the ability to add or remove participants from an existing conversation. Participants added to an existing conversation will have access to all previous messages sent within the context of that conversation.

## Message Parts

LYRMessageParts represent a piece of content embedded within a message. Each part has a specific MIME Type identifying the type of content it contains. Messages may contain an arbitrary number of parts with any MIME Type that the application wishes to support. 


## Sync Notifications

The Layer client now provides a flexible notification system for informing applications when changes have
occured on domain objects in response to synchronization activities. The system is designed to be general
purpose and models changes as the creation, update, or deletion of an object. Changes are modeled as simple
dictionaries with a fixed key space.

## Deletion

Many of our early access customers asked for the ability to delete messages and conversations. Based on this feedback, we are introducing deletion functionality. When a message or conversation is deleted, that event is synchronized across all devices, revoking the object and any corresponding data from local data store. 



## Auto Downloads

While the Layer SDK supports the synchronization of any payload type up to 100KB.  To help applicaitons efficiently download their content, we are introducing the ability for developers to dictate which MIMETypes they would like the SDK to automatically download. MIMETypes that are not automatically downloaded can be fetched whenever the application requires the resource via the following method.  
