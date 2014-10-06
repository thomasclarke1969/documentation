#Connecting

```emphasis
Skip this section if you've already done it in the Quick Start guide.
```

The `LayerClient` object is the primary interface for interacting with the Layer service. Only one instance of `LayerClient` should be instantiated and used at all times. The object is initialized with a Context, and Application Key, and an GCM Sender ID.

```emphasis
We have created an application for you titled %%C-INLINE-APPNAME%% and the sample code below contains your application's key.
```

Key's are application specific and should be kept private. Copy and paste the following code into your `Application` object's `onCreate()` method.

```java
// Create a LayerClient object
UUID appID = UUID.fromString("%%C-INLINE-APPID%%")
LayerClient layerClient = LayerClient.newInstance(this, appID, "GCM ID");
```

## Listeners
The `LayerClient` object leverages the listener pattern to notify your application to specific events. You will need to implement the `LayerConnectionListener` and `LayerAuthenticationListener' interfaces. Once implemented, register both on the 'layerClient' object.

```java
layerClient.registerConnectionListener(this).registerAuthenticationListener(this);
```

## Connect The SDK
Once you have registered your listeners, you connect the SDK

```java
// Asks the LayerSDK to establish a network connection with the Layer service
layerClient.connect();
```
