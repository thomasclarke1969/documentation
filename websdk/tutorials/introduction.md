# Introduction

This tutorial helps build a simple chat application using Layer's Web SDK. It uses [Backbone.js](http://backbonejs.org/) to provide a basic Event and View structure but keep in mind you don't need to know anything about how Backbone works to reason about the application we are building.

If you are looking for a sample chat application rather than a tutorial, check our [Sample Apps](https://github.com/layerhq/samples-web-apis) where you will find examples built using different Javascript frameworks.

```emphasis
This chat application should work with your %%C-INLINE-APPNAME%%. You can also create a new Application from the Developer Dashboard to run this tutorial.
```

There are three Tutorials:

1. [Basic Authentication](#authentication): Build an application that authenticates with Layer's servers.
2. [Basic Conversations](#conversations): Build an application that creates and lists Conversations.
3. [Basic Messages](#messages): Build an application that sends and receives Messages, and sends Read Receipts.

## Sample Users

This tutorial assumes that you have user's with User IDs '0', '1', '2', '3', '4' and '5'.  Before starting the Tutorial, we'll need to set these users up by registering them with Layer's Identities service.  What you'll need to set this up:

* Find `YOUR_APP_ID` in the `Keys` section of the Developer Dashboard (note: only use the UUID portion of the App ID)
* Find `YOUR_TOKEN` in the `Integration` section of the Developer Dashbaord (note: you may need to Generate a new Token)
* Run the commands below with the appropriate `YOUR_APP_ID` and `YOUR_TOKEN` values

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 0", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/0.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/0/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 1", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/1.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/1/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 2", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/2.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/2/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 3", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/3.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/3/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 4", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/4.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/4/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 5", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/5.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/5/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"distinct": false, "participants": ["0","1","2","3","4","5"]}' \
      https://api.layer.com/apps/YOUR_APP_ID/conversations
```