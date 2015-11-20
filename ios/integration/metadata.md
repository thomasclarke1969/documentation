# Metadata
Metadata provides an elegant mechanism for expressing and synchronizing contextual information about conversations. This is implemented as a free-form structure of string key-value pairs that is automatically synchronized among the participants in a conversation. Example use cases of metadata include:

1. Setting a conversation title.
2. Attaching dates or tags to the conversation.
3. Storing a reference to a background image URL for the conversation.

The following demonstrates setting `metadata` on a conversation:

```objective-c
NSDictionary *metadata = @{@"title" : @"My Conversation",
                           @"theme" : @{
                                @"background_color" : @"333333",
                                @"text_color" : @"F8F8EC",
                                @"link_color" : @"21AAE1"},
                           @"created_at" : @"Dec, 01, 2014",
                           @"img_url" : @"/path/to/img/url"};
[self.conversation setValuesForMetadataKeyPathsWithDictionary:metadata merge:YES];
```

For convenience and to facilitate the namespacing of information within metadata, values may be manipulated as key paths. A key path is a dot (.) delimited string that identifies a series of nested keys leading to a leaf value. For example, given the above metadata structure, an application could change the name of a participant via the following:

```objective-c
[conversation setValue:@"FFFFFF" forMetadataAtKeyPath:@"theme.background_color"];
```

You can also initialize a new conversation with metadata by passing in `LYRConversationOptionsMetadataKey` option.

```
LYRConversation *conversation = [layerClient newConversationWithParticipants:[NSSet setWithObjects:@"USER-IDENTIFIER", nil] options:options:@{LYRConversationOptionsMetadataKey : metadata } error:&error];
```

Applications can fetch metadata for a given conversation by accessing the public `metadata` property on `LYRConversation` objects.

```objective-c
NSString *title = [conversation.metadata valueForKey:@"title"];
```
Below is an example of retrieving nested data. For the example, given the above metadata structure, an application will return the value of "333333."
```objective-c
NSString *color = [conversation.metadata valueForKeyPath:@"theme.background_color"];
```
While this feature is both powerful and convenient, it is not designed to serve as a general purpose data store. It's important to understand the intended use cases and limitations associated with the feature to ensure an ideal user experience. Please see the [Metadata Guide](/docs/ios/guides#metadata) for more detail.
