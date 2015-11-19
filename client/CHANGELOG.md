# Layer Client API Change Log

## 1.0.1

### New Features

* Conversations can now be sorted by `last_message.sent_at`, not just by `created_at`.
* Now supports `X-HTTP-Method-Override: PATCH` as an alternate way of issuing a PATCH request.

### Bug Fixes

* The `Layer-Count` header is now returned with all collections, and not solely when there are more resources to load.
* Improved handling of WebSockets and XHR requests that involve a deleted Session Token
* The `last_message` property is now returned when a Create Conversation request returns an existing Distinct Conversation.
