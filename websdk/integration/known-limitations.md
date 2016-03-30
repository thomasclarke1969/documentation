# Known limitations:

1. While the Web SDK does provide a Query API, the server at this time only supports querying for All Conversations, and querying for All Messages within a Conversation.
2. The server does not yet support announcements, therefore the Web SDK does not offer any access to announcements.
3. Repeatedly creating layer.Query instances without ever calling `query.destroy()` on old instances will result in memory leaks and performance issues that can affect long running applications.
