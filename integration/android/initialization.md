# Initialization

The `LayerClient` object represents the primary interface for interacting with the Layer service. Only one instance of `LayerClient` should be instantiated by your application and should be retained at all times. The object is initialized with a Context, and Application Key, and an GCM Sender ID.

```emphasis
We have created an application for you titled %%C-INLINE-APPNAME%% and the sample code below contains your application's key.
```

This key is specific to your application and should be kept private at all times. Copy and paste the following code into your `Application` object's `onCreate()` method.

```java
// Instatiates a LayerClient object
UUID appID = UUID.fromString("%%C-INLINE-APPID%%")
LayerClient client = LayerClient.newInstance(this, appID, "GCM ID");
```

You can create additional Layer applications by visiting our [developer dashboard](/dashboard/project/new).

## Listeners
The `LayerClient` object leverages the listener pattern to notify your application to specific events. On launch, your application should register as a `LayerConnectionListener` and `LayerAuthenticationListener`.

```java
client.registerConnectionListener(this).registerAuthenticationListener(this);
```

## Connect The SDK
Once you have registered your listeners, you connect the SDK

```java
// Asks the LayerSDK to establish a network connection with the Layer service
client.connect();
```
