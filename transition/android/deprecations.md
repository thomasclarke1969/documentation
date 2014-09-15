# Significant Deprecations

## Layer Users

Our new authentication architecture gives your backend complete control of your user’s identity and the relationships between users. As a result, it is no longer necessary for Layer to maintain an internal model of your users. The concept of a ‘User’ within Layer has been removed. Additionally, the notion of a Layer Address,  Layer Contact, and Layer Contact Controller, which were all tightly coupled with our user model, have also been removed. Going forward, you will send messages to users using your backend’s identifier for that user.

## Backend API 

The Early Access web API exposed functionality related to the import and management of user identity within Layer. With the adoption of the new authentication architecture, this functionality is no longer necessary and has been deprecated. 

## Message Controllers 

In order to display a list of messages comprising a conversation, LayerKit exposed the LYRMessageController, which behaved much like an NSFetchedResultController. Additionally, the SDK supported three types of conversations you could fetch: Thread, Tree, and Participants. While the architecture was built to give you flexibility in the types of conversations you could display, it added unnecessary overhead and complexity. We have eliminated the LYRMessageController and LYRConversationTypes.

## LYRClientState 

Client lifecycle management responsibilities have largely been removed from the Layer SDK and as a result, we have removed the LYRClientState object. 

## Singleton Design Pattern

While the singleton design pattern does present certain advantages, we learned that it was not the best option for LayerKit during early access. Going forward, developers will create and retain a single instance of the LYRClient object.
