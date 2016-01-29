# Metadata

Metadata provides an elegant mechanism for expressing and synchronizing contextual information about Conversations. This is implemented as a free-form structure of string key-value pairs that is automatically synchronized among the participants in a conversation. Example use cases of metadata include:

1. Setting a conversation title.
2. Attaching dates or tags to the Conversation.
3. Storing a reference to a background image URL for the Conversation.

The following demonstrates setting `metadata` on a conversation:

```javascript
conversation.setMetadataProperties({
    theme: {
        background_color: '333333',
        text_color: 'F8F8EC',
        link_color: '21AAE1'
    }
});
```

Given an initial metadata of `{}`, this code will change the metadata to:

```json
{
    "theme": {
        "background_color": "333333",
        "text_color": "F8F8EC",
        "link_color": "21AAE1"
    }
}
```

Individual properties can be updated with:

```javascript
conversation.setMetadataProperties({
    'title': 'This is a really good Conversation'
});
```

Subproperties can be updated with `.` separated paths:

```javascript
conversation.setMetadataProperties({
    'theme.text_color': '000000'
});
```

While this feature is both powerful and convenient, it is not designed to serve as a general purpose data store. It's important to understand the intended use cases and limitations associated with the feature to ensure an ideal user experience. Please see the [Metadata Guide](/docs/websdk/guides#layer-metadata) for more detail.
