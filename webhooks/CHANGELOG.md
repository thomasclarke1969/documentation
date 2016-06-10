# Webhooks Change Log

## Release v2.0

Identity is now a core part of the Layer APIs, simplifying building chat into your applications in a variety of ways.  This involves major changes to the Webhook Object structures.

This is a major version increment, and can only be accessed by updating your `Accept` header to `application/vnd.layer.webhooks+json; version=2.0`.

This update contains breaking changes to some objects and existing integrations will need to be updated to take advantage of the new capabilities.

### Changes

* All requests require `Accept: application/vnd.layer.webhooks+json; version=2.0`
* All `version` properties should be updated to `2.0`
    1. Update your endpoint code to expect the new payload format.
    1. Create a new webhook(s) explicitly using version 2.0 content negotiation.
    1. Deactivate your old webhook(s) using the Developer Dashboard.
    1. When you're comfortable, delete your old webhook(s) using the Developer Dashboard.
* Throughout the APIs, use of `user_id` values is replaced with the user of either Layer Identity IDs or Layer's Basic Identity Objects. Affected APIs include:
    * Conversation Object
        * `participants` array is now an array of Basic Identity Objects rather than User IDs.
    * Message Object `sender` object
        * `sender` object is now a Basic Identity
        * `sender.name` is no longer supported; bots sending Messages will be identified the same as a user: using a Basic Identity, with a Layer Identity ID.
    * Message Object `recipient_status` object
        * Recipient Status is now a hash of Layer Identity IDs rather than User IDs
    * `event.actor` object is now a Basic Identity

## January 27, 2016

#### Enhancements

* Webhooks 1.0 officially released.

## January 7, 2016

#### Bug Fixes

* Target URL validation improved.
* Relative URLs are now used instead of absolute URLs when hitting your target URL.

## January 1, 2016

#### Bug Fixes

* Fixed a bug where webhooks were not being send when the Unicode `U+FFFD` replacement character appeared in message part content.

## December 21, 2015

#### Bug Fixes

* Fixed an issue with Unicode not being encoded correctly.
