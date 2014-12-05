# Layer Metadata

Communication is not just about what was said. It's a rich experience that encompasses both content and context. With metadata, Layer provides an elegant mechanism for expressing and synchronizing contextual information about Conversations. This is implemented as a free-form structure of string key-value pairs that is automatically synchronized among the participants in a conversation.

While this feature is both powerful and convenient, it is not designed to serve as a general purpose data store. It's important to understand the intended use cases and limitations associated with the feature to ensure an ideal user experience. In particular, please keep in mind that:

1. Metadata is implemented with "last writer wins" semantics on a per key basis. This means that multiple mutations by independent users to a given key will result in a single stored value. No locking or other coordination is performed across participants.
2. Metadata is automatically synchronized by each participant in the conversation. While Layer has gone to great lengths to implement metadata in a way that maximizes efficiency on the wire, it is important that the amount of data stored in metadata is kept to a mimumum to ensure the quickest synchronization possible.
3. Metadata values must be represented as strings. To ensure a satisfying user experience developers are strongly discouraged from storing any sort of binary data representation (including thumbnail images) via metadata. Instead, consider storing a URL or other reference to data that is transmitted out of band from
synchronization.
4. Metadata is limited to the storage of a maximum of 2k of data under each key. Keys must be alphanumeric and may include hyphens and underscores. Nested structures may be used to facilitate efficient namespacing of content.
5. There is not currently any limit enforced on the number of keys stored into the metadata structure. Because mutations are performed on a per key basis, it is advantageous to structure your data in such a way that smaller amounts of data are stored under a larger number of keys. Note that the lack of a key limit is subject to change in future versions.
5. Mutable Conversation metadata should only be used to store information associated with the Conversation itself -- not individual messages. As the number of metadata keys grow synchronization will take longer to complete. Because Conversations can be very long lived, performance can be severely impacted if dynamically computed keys (such as those built from message identifiers) are utilized.

### Supported Metadata Use Cases

1. Associating a topic with the Conversation.
2. Storing information about participants within the Conversation.
3. Attaching dates or tags to the Conversation.
4. Storing a reference to a background image URL for the Conversation.

## Public API

Metadata access and mutation is performed via public instance methods on the Conversation model objects.

```java

Conversation:

/**
 @abstract Sets the value for a particular metadata key path to the given value.
 @return the metadata for the conversation
 */
   public abstract java.util.Map<java.lang.String,java.lang.Object> getMetadata();

LayerClient:	
/**
 @abstract Replaces or merges the current metadata with a new map of values.
 @param conversation The conversation the metadata should be applied.
 @param metadata The metadata to be assigned or merged.
 @param merge A Boolean value that determines if the given value should be assigned or merged.
 */
    public abstract void putMetadata(com.layer.sdk.messaging.Conversation conversation, java.util.Map<java.lang.String,java.lang.Object> metadata, boolean merge);


/**
 @abstract Sets the value for a particular metadata key path to the given value.
 @param conversation The conversation the metadata should be applied.
 @param keyPath The key-path to the metadata to be created or merged.
 @param value The value that should be stored at the keyPath.
 */
    public abstract void putMetadataAtKeyPath(com.layer.sdk.messaging.Conversation conversation, java.lang.String keyPath, java.lang.String value);


/**
 @abstract Deletes existing values for the specified key-paths from the metadata.
 @param conversation The conversation the metadata should be applied.
 @param keyPath The key-path to the metadata to be deleted.
 */
    public abstract void removeMetadataAtKeyPath(com.layer.sdk.messaging.Conversation conversation, java.lang.String keyPath);


@end

```

## Metadata Key Paths

For convenience and to facilitate the namespacing of information within metadata, values may be manipulated as key paths. A key path is a dot (`.`) delimited string that identifies a series 
of nested keys leading to a leaf value. For example, given a metadata structure that looks like:

```json
{
    "my_app": {
        "user_info": {
            "12345": {
                "full_name": "Blake Watters",
                "screen_name": "El Diablo"
            }
        }
    }
}
```

We could change the `screen_name` of user `"12345"` from `"El Diablo"` to `"El Toro"` by referencing it as a keypath:

```objc
layerClient.putMetadataAtKeyPath(conversation, ""my_app.user_info.12345.screen_name", "El Toro");
```
