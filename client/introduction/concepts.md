# Concepts

There are concepts one should be familiar with before using the Client APIs.

## What is a Conversation?

A Conversation is an Object that represents a set of messages being exchanged by a group of users.  A Conversation has the following properties (See [The Conversation Object](#conversation)) for a complete list of properties)

| Name    | Type |  Description  |
|---------|------|---------------|
| **participants** | string[] | Array of User IDs indicating who is currently participating in a Conversation |
| **metadata** | object | Custom data associated with the Conversation that is viewable/editable by all participants of the Conversation |
| **distinct** | boolean | Indicates if this is a unique reusable Conversation between the participants |


A full JSON description of the Conversation object is shown in [The Conversation Object](#conversation); any API that expects the full Conversation object will simply show `<Conversation>` in this document.


### The `participants` property

A Participant is a User ID.  A User ID is any arbitrary string that your identity provider has placed within its Identity Token to identify a user.  The `participants` property is an array of up to 25 IDs for users who are a part of this Conversation.


### The `metadata` property

Metadata allows custom data to be associated with a Conversation.  For example, there is no `title` property in the Conversation Object.  If your Conversations need a title to share between all participants and render as part of your view, you can add a `title` property to the metadata; this title will be seen by all users.  Use metadata to add any custom data you need associated with the Conversation.

Common use cases:

1. Title
2. Conversation status
3. Database IDs relating this to your domain data
4. Rendering hints

### The `distinct` property

To insure that you don't have multiple Conversations between 2 or more participants, you can flag a Conversation as Distinct, which will prevent redundant new Conversations from being created for further communications between these participants.

When Conversations are Topic based, you typically do NOT want `distinct`; but if you have direct messaging going between two users, they typically only want to ever see a single Conversation between them.

## What is a Message?

The Message Object represents a message sent by a user (or by the server) to the participants within a Conversation. A Message has the following properties  (See the [The Message Object](#message) for a complete list of properties):

| Name    | Type |  Description  |
|---------|------|---------------|
| **sender** | object | Identifies who sent the message |
| **sent_at** | string | Date/time that the message was sent; "2014-09-09T04:44:47+00:00" |
| **recipient_status** | object | Hash of User IDs indicating which users have received/read the message |
| **parts** | MessagePart[] | Array of MessageParts; each part contains some of the contents of the message. |

A full JSON description of the Message object is shown in [The Message Object](#message); any API that expects the full Message object will simply show `<Message>`.

### The `sender` property

The Sender object consists of two properties:

| Name    | Type |  Description  |
|---------|------|---------------|
| **user_id** | string | The user_id is the ID of the participant that sent the message |
| **name** | string | If sent by the [Platform API](https://developer.layer.com/docs/platform), the name is a system name such as "Administrator" or "Moderator"; else its null. |

These two properties are mutually exclusive.  If one has a value, then the other must be null.

### The `is_unread` property

Has the message been read by this user?  This property only describes THIS user's read state; to see the rest of the participants, see `recipient_status` in the [The Message Object](#message).

* THIS user is defined as the user that the Session Token has authenticated.
* You can change this value of this property by sending a (Read Receipt)[#receipts] to the server.


## What is a Message Part?

Message Parts represent the individual pieces of content embedded within a message.  Each Message contains an array of Message Parts, allowing for textual and rich content to be shared.

A Message uses MessageParts to group diverse types of information together.  For example a message can contain a `text/plain` part such as "Here's my picture", an `image/png` part with an image, and a `location/coordinate` part to indicate where the photo was taken.  These three MessageParts together represent a single Message.  More detail can be found in [The MessagePart Object](#message-part).

