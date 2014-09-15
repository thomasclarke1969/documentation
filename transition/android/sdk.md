# SDK 

With this SDK redesign, we placed an emphasis on simplicity and usability by removing much of the complexity that was present in the early access SDK. The first thing you will notice when you begin implementing is that there are far fewer classes to work with. Below are high level descriptions for all classes in LayerKit V0.X

## Classes

  1. **LYRClient **- The primary interface for interacting with the Layer communication platform.
  2. **LYRConversation -** Models a conversations between two or more participants within Layer. A conversation is an on-going stream of messages synchronized among all participants
  3. **LYRMessage **- Represents a message within a conversation within Layer. A message can contain one or many individual pieces of content.
  4. **LYRMessagePart **- Represents a piece of content embedded within a containing message. Each part has a specific MIME Type identifying the type of content it contains. Messages may contain an arbitrary number of parts with any MIME Type that the application wishes to support

Full API Reference can [be found here](/docs/api).