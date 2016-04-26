# Authentication

```emphasis
Download tutorial project: [authentication.zip](http://static.layer.com/web/docs/tutorials/authentication.zip).
```

Your application will undoubtedly run better if its authenticated.  So, lets build a simple application that authenticates, and on completing authentication, welcomes the user.

We start with a very basic project template:

* `index.js`: This initializes the Application and will initialize the Layer Client.
* `controller.js`: This is your App controller which will use the Layer Client.
* `views/`: This folder contains your UI Views.
* `identity-services.js`: script that gets you an identity token from Layer's Sample Identity Service
* A CSS folder to make everything render nicely as we progress
* An html file because, well, it would be embarrassing to forget that.

You should be able to run this application without any changes.  It won't do much, but you should see the Titlebar View render `Welcome to the Tutorial Sample App`.

## Step 1: Set the App ID

The first thing we need to do is to set the App ID for your application.
Open up your `index.html` file and update the `layerSampleConfig.appId` variable:

```javascript
window.layerSampleConfig = {
  appId: '%%C-INLINE-APPID%%',
  userId: 'Tutorial User'
};
```

## Step 2: Instantiate the Client.

The Layer Client is your main interface to the Layer Services.  Before writing any Layer-specific code, we need to instantiate the Layer Client.

Open your `index.js` file and add:

```javascript
// Tutorial Step 2: Instantiate the Client and start the authentication process
layerSampleApp.client = new layer.Client({
    appId: window.layerSampleConfig.appId
})
layerSampleApp.client.connect(window.layerSampleConfig.userId);
```

## Step 3: Handle the Authentication Challenge

The Authentication Challenge is a `challenge` event that is triggered to provide a nonce to your app.
Your app provides this nonce to your identity service to get an Identity Token.  In this case,
you'll use a Sample Identity Service, using the `Identities.getIdentityToken()` method provided in `identity-services.js`.

On getting an Identity Token via `getIdentityToken`'s callback, we call the challenge callback to procede with authentication.  The event comes with two properties:

* **evt.nonce**: Nonce to provide to identity service
* **evt.callback**: Callback to call once we have an Identity Token

Open your `index.js` file and insert this code after the client has been instantiated:

```javascript
// Tutorial Step 3: Handle authentication challenge
layerSampleApp.client.on('challenge', function(evt) {
    layerSampleApp.Identities.getIdentityToken({
        appId: window.layerSampleConfig.appId,
        userId: window.layerSampleConfig.userId,
        nonce: evt.nonce,
        callback: function(identityToken) {
            evt.callback(identityToken);
        }
    });
});
```

There is some stuff going on here that we are avoiding discussing; what is this Identity Service? How does one build an Identity Service?  This tutorial is about how to develop using the Web SDK, and so we've provided a sample Identity Service; you can learn more about building your own Identity Service in our [Authentication Guide](/docs/websdk/guides/#authentication).  Here's what you *Should* understand from this:

1. Creating a Client instance caused it to get a *Nonce* from *Layer's server*.
2. The *Nonce* is provided to your app via the `challenge` event.
3. Your app uses the *Nonce* to get an *Identity Token* from *your server* (such as is done above with the `getIdentityToken()` call).
4. Your app provides the *Identity Token* to the Client via `evt.callback(identityToken)`.
5. The Client will now establish an authenticated session with *Layer's server*.

## Step 4: Handle the Ready Event

Once the Layer Client has created a Session with the Layer servers, it will trigger its `ready` event.  Once the client is ready, you can start rendering your UI.

Open your `index.js` file and add after the client has been instantiated:

```javascript
// Tutorial Step 4: Initialize UI once the client is ready
layerSampleApp.client.on('ready', function(evt) {
    layerSampleApp.initialize();
});
```

You can now run this app.  It will render the same exact UI as before, but assuming authentication is happening correctly, it will render the UI after you have authenticated.

## Step 5: Render a Welcome Message

Open up `views/titlebar.js`, and replace the render method with:

```javascript
render: function(conversation) {
    // Tutorial Steps 5 and 6: Show the User Name
    var title = 'Logged in as: ' + layerSampleApp.client.userId;
    this.$el.html('<div class="title">' + title + '</div>');
}
```

The Client has a `userId` property that stores the userId of the user of the current session.  That userId may be any string, but is typically a unique identifier string from your own database, and is rarely an ID that has meaning to the user.

Run this app; you should see a UI that logs in and then displays `Logged in as: 0`.

## Step 6: Fixing the Welcome Message

So, why did it show the userId as `0`?  Because for this Sample Identity Service, Unique User ID strings are `0`, `1`, `2`, `3`, etc...  We don't actually want to display the userId, we want to display the user's name.  The `identity-services.js` file exposes a `getDisplayName` function that takes the userId as input and returns the display name.

Open up `views/titlebar.js`, and replace the render method with:

```javascript
render: function(conversation) {
    // Tutorial Steps 5 and 6: Show the User Name
    var title = 'Logged in as: ' +
        layerSampleApp.Identities.getDisplayName(layerSampleApp.client.userId);
    this.$el.html('<div class="title">' + title + '</div>');
}
```

You should now be able to run this application and once logged in, see `Logged in as: Tutorial User`.
