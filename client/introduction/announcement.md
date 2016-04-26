# Announcements

The Announcement is a special class of Message; it differs from the Message object in the following ways:

* Announcements can not be sent using the Client API; only received
* The Announcement `sender` object will never have a `sender.user_id` only a `sender.name`
* The Announcement object will not have a `conversation` property
* Because there is no `conversation` that this Announcement is a part of, one can not reply to an Announcement
* The Announcement `id` will be `layer:///announcements/UUID`
* The Announcement does not show other recipients of the Announcement; `recipient_status` will only show the authenticated user and their status, and no other user's read/delivered/sent state.

Announcements are a tool for sending system level Messages to users; Messages that are global and not part of any one Conversation.  Announcements can only be sent through your web service using the [Platform API](https://developer.layer.com/docs/platform).
