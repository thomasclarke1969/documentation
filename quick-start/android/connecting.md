#Connecting

```emphasis
We have created an application for you titled %%C-INLINE-APPNAME%% and the sample code below contains your application's key.
```

This key is specific to your application and should be kept private at all times. Copy and paste the following code into your `Application` object's `onCreate()` method.

```java
// Create a LayerClient object
UUID appID = UUID.fromString("%%C-INLINE-APPID%%")
LayerClient layerClient = LayerClient.newInstance(this, appID, "GCM ID");
```

## Listeners
The `LayerClient` object leverages the listener pattern to notify your application to specific events. You will need to implement the `LayerConnectionListener` and `LayerAuthenticationListener` interfaces. Examples are below.

```java
public class MyAuthenticationListener implements LayerAuthenticationListener {

	@Override
	public void onAuthenticated(LayerClient client, String arg1) {
		System.out.println("Authentication successful");

	}

	@Override
	public void onAuthenticationChallenge(LayerClient client, String nonce) {
		// TODO Auto-generated method stub
	}

	@Override
	public void onAuthenticationError(LayerClient layerClient, int arg1, String arg2) {
		// TODO Auto-generated method stub
		System.out.println("There was an error authenticating");
	}

	@Override
	public void onDeauthenticated(LayerClient client) {
		// TODO Auto-generated method stub

	}
}
```

```java
public class MyConnectionListener implements LayerConnectionListener {

	@Override
	public void onConnectionConnected(LayerClient client) {
		client.authenticate();
	}

	@Override
	public void onConnectionDisconnected(LayerClient arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onConnectionError(LayerClient arg0, int arg1, String arg2) {
		// TODO Auto-generated method stub

	}

}
```

Once implemented, register both on the `LayerClient` object.


```java
layerClient.registerConnectionListener(new MyConnectionListener());
layerClient.registerAuthenticationListener(new MyAuthenticationListener());
```

## Connect
Once you have registered your listeners, you connect the SDK

```java
// Asks the LayerSDK to establish a network connection with the Layer service
layerClient.connect();
```
