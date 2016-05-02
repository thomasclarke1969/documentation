# The Identity Object

The following JSON represents a typical Identity; referred to throughout this document as `<Identity>`:

```json
{
  "id": "layer:///identities/frodo115",
  "url": "https://api.layer.com/identities/frodo115",
  "user_id": "frodo115",
  "display_name": "https://myserver.com/frodo115.gif",
  "first_name": "Frodo",
  "last_name": "The Dodo",
  "phone_number": "1-800-fro-dodo",
  "email_address": "frodo_the_dodo@myserver.com",
  "public_key": "<RSA Key>",
  "metadata": {
    "your-key": "your-value"
  }
}
```

| Name    | Type |  Description  |
|---------|------|---------------|
| **id** | string | Layer's internal ID for this user |
| **url** | string | A URL for accessing the Identity via the REST API |
| **user_id** | string | Your application's ID for this user |
| **display_name** | string | Optional display name used when rendering this user in a UI |
| **first_name** | string | Optional first name of the user |
| **last_name** | string | Optional last name of the user |
| **avatar_url** | string | Optional url to an avatar image |
| **phone_number** | string | Optional phone number for the user. Third party Webhook services may use this for SMS fallback for unread messages.  |
| **email_address** | string | Optional email address for the user. Third party Webhook services may use this for email fallback for unread messages. |
| **public_key** | string | RSA public key |
| **metadata** | object | Custom data associated with the Identity that is viewable by all users |



```emphasis
Note, that all values that are put into the Identity object can be observed by all users of your system.  Its probably fine to expose phone numbers and email addresses to coworkers, but not to contacts on a social network.
```

Identity objects can be created in two ways:

* Creating a Layer Session with an Identity Token will create an Identity if one does not yet exist.  The Identity Token can be used to define the following fields of your Identity:
    * user_id
    * display_name
    * avatar_url
    * public_key
* Identities can be created, updated and deleted via the [Platform API](https://developer.layer.com/docs/platform/users#managing-identity); only the Platform API can be used to set ALL fields of the Identity.


## Following an Identity

Every user within Layer has a set of users that they follow.  `User A` follows `User B` if they have ever had a Conversation with them, OR if they have performed an operation to explicitly follow them.  By following `User B`, `User A` can quickly load that user's Identity, and can receive changes to that Identity.