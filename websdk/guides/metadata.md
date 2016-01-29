# Layer Metadata

Communication is not just about what was said. It's a rich experience that encompasses both content and context. With metadata, Layer provides an elegant mechanism for expressing and synchronizing contextual information about Conversations. This is implemented as a free-form structure of string key-value pairs that is automatically synchronized among the participants in a conversation.

While this feature is both powerful and convenient, it is not designed to serve as a general purpose data store. It's important to understand the intended use cases and limitations associated with the feature to ensure an ideal user experience. In particular, please keep in mind that:

1. Metadata is implemented with "last writer wins" semantics on a per key basis. This means that multiple mutations by independent users to a given key will result in a single stored value. No locking or other coordination is performed across participants.
2. Metadata is automatically synchronized by each participant in the conversation. While Layer has gone to great lengths to implement metadata in a way that maximizes efficiency on the wire, it is important that the amount of data stored in metadata is kept to a minimum to ensure the quickest synchronization possible.
3. Metadata values must be represented as strings. To ensure a satisfying user experience developers are strongly discouraged from storing any sort of binary data representation (including thumbnail images) via metadata. Instead, consider storing a URL or other reference to data that is transmitted out of band from
synchronization.
4. Metadata is limited to the storage of a maximum of 2k of data under each key. Keys must be alphanumeric and may include hyphens and underscores, but cannot contain spaces. If your metadata key contains space you may run into issues if you try to query them. Nested structures may be used to facilitate efficient namespacing of content.
5. There is not currently any limit enforced on the number of keys stored into the metadata structure. Because mutations are performed on a per key basis, it is advantageous to structure your data in such a way that smaller amounts of data are stored under a larger number of keys. Note that the lack of a key limit is subject to change in future versions.
5. Mutable Conversation metadata should only be used to store information associated with the Conversation itself -- not individual messages. As the number of metadata keys grow synchronization will take longer to complete. Because Conversations can be very long lived, performance can be severely impacted if dynamically computed keys (such as those built from message identifiers) are utilized.

### Supported Metadata Use Cases

1. Associating a topic with the Conversation.
2. Storing information about participants within the Conversation.
3. Attaching dates or tags to the Conversation.
4. Storing a reference to a background image URL for the Conversation.

## Public API

Metadata access is performed via Conversation methods:

```javascript
// Adds or sets metadata keys for  this conversation.
conversation.setMetadataProperties({
    key1: 'value1',
    key2: 'value2',
    key3: {
        key4: 'value3',
        key5: 'value4'
    }
});

// Add or set metadata keys in subobjects using "." to namespace the property:
conversation.setMetadataProperties({
    'key3.key4': 'I am not a number!'
});

// Delete a metadata key 'key2' and the subproperty of 'key3' named 'key5'
conversation.deleteMetadataProperties(['key2', 'key3.key5']);

// Access the metadata values for read-only use:
var metadata = conversation.metadata;

// Receive notifications of changes to conversation metadata that may be changed
// locally or by other participants:
conversation.on('change', function(evt) {
    // Get only the metadata changes
    var metadataChanges = evt.getChangesFor('metadata');

    // Log each metadata change
    metadataChanges.forEach(function(change) {
        console.log('Metadata was changed from ' +
            JSON.stringify(change.oldValue) + ' to ' +
            JSON.stringify(change.newValue));
    });
});
```

Note that changes to metadata can also be subscribed to more broadly by subscribing to all changes to a query.  A query contains all Conversations known to your UI, and can monitor all changes to their metadata:

```javascript
var query = client.createQuery({
    model: layer.Query.Conversation
});

query.on('change', function(evt) {
    if (evt.type === 'property') {
        var changedConversation = evt.target;
        var metadataChanges = evt.getChangesFor('metadata');
        // Log each metadata change
        metadataChanges.forEach(function(change) {
            console.log('Metadata was changed from ' +
                JSON.stringify(change.oldValue) + ' to ' +
                JSON.stringify(change.newValue));
        });
    }
});
```
