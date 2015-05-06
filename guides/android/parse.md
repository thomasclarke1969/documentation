# Parse Integration
[Layer-Parse-Android-Example](https://github.com/layerhq/Layer-Parse-Android-Example) is a sample application highlighting how to integrate the Layer communications platform with a Parse backend. It presents a very simple example of a chat app.

## Setup

This application requires Android Studio. Dependencies are managed via maven to simplify installation.

1. Clone the project from Github: `$ git clone https://github.com/layerhq/Layer-Parse-Android-Example.git`
2. Open the project in Android Studio.
3. In LayerImpl.java replace LayerAppID with your App ID: `%%C-INLINE-APPID%%`
4. In ParseImpl.java replace the ParseAppID and ParseClientKey with the Keys from the Parse Dashboard (found under Settings -> Keys)
5. Add the [Layer Parse Module](https://github.com/layerhq/layer-parse-module) to your Parse Cloud Code to serve as an authentication manager.
6. Build and run the application and tap the "Sign Up" button to create a new user and begin messaging!

## Sign Up and Authentication

The Layer-Parse-Android-Example app uses Parse for user management. The app requires a username, email, and password for user registration. After a successful login or successful signup, the app authenticates that user with Layer using the `ParseUser` Object Id. This object identifier is used to track participants in conversations, and a lookup is executed to determine the human-readable username.

In this example, all users can message any other registered user, but it would be fairly straightforward to add rules around user management so that users can only message known "friends".

## Query Adapters and RecyclerViews

The UI for both conversations and messages within conversations is driven with QueryAdapters. These take a Layer query and handle inserting and removing items from the associated RecyclerView. When the query returns an item, the QueryAdapter inflates a view and populates any specified fields. All changes are handled automatically by the query adapter, so you don't have to worry about explicitly checking for updates in order to drive the UI.

