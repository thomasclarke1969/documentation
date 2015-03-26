# Authentication

```emphasis
Once you are ready for production implementation, you will need to write your own backend controller to generate an identity token. You will not be able to use the authentication implemenation from the Quick Start guide.
```

To authenticate a user, the SDK requires that your backend server application generate an identity token and return it to your application.

##Step 1 - Backend Setup
A `Provider ID` and `Key ID` must be retained by your back end application and used in the generation of the token.

```emphasis
**Provider ID** - The following `Provider ID` is specific to your account and should be kept private at all times.
```

%%C-PROVIDERID%%

```emphasis
**Key ID** - In order to acquire a `Key ID`, you must first generate an RSA cryptographic key pair by clicking the button below. Layer will upload the public portion to our service and the private key will appear in a pop up. Please copy and save the private key as it must be retained by your backend application and used to sign Identity Tokens.
```

%%C-KEYID%%

To manage your authentication keys please visit the [dashboard](/projects).

##Step 2 - Start the Authentication process
Once connected, the `onConnectionConnected()` method will be called, at which time you should call the 'authenticate()' method on the `layerClient`.

```java
 @Override
 // Called when the LayerClient establishes a network connection
 public void onConnectionConnected(LayerClient layerClient) {
     // Ask the LayerClient to authenticate. If no auth credentials are present,
     // an authentication challenge is issued
     layerClient.authenticate();
 }
```

##Step 3 - POST the nonce and generate identity token
The main authentication logic will reside in the `onAuthenticationChallenge` method located in your implementation of the `LayerAuthenticationListener`

```java
@Override
public void onAuthenticationChallenge(final LayerClient layerClient, final String nonce) {
    String mUserId = "USER_ID_HERE";

  /*
   *  CODE goes here. Post the nonce to your backend, generate and return an Identity Token
   */
}
```

##Step 4 - Generate an identity token in your backend
A nonce value will be passed into the `onAuthenticationChallenge` method. POST that value to your backend and sign it using JWT.

`Identity Tokens` are a pair pair of JSON dictionary structures (the JWS Header and Claim) and a cryptographic signature generated over them. The structure is as follows:

```
// JWS Header
{
    "typ": "JWS", // String - Expresses a MIME Type of application/JWS
    "alg": "RS256" // String - Expresses the type of algorithm used to sign the token, must be RS256
    "cty": "layer-eit;v=1", // String - Express a Content Type of Layer External Identity Token, version 1
    "kid": "%%C-INLINE-KEYID%%" // String - Layer Key ID used to sign the token. This is your actual Key ID
}

// JWS Claim
{
    "iss": "%%C-INLINE-PROVIDERID%%", // String - The Layer Provider ID, this is your actual provider ID
    "prn": "APPLICATION USER ID", // String - Provider's internal ID for the authenticating user
    "iat": "TIME OF TOKEN ISSUANCE AS INTEGER", // Integer - Time of Token Issuance in RFC 3339 seconds
    "exp": "TIME OF TOKEN EXPIRATION AS INTEGER", // Integer - Arbitrary time of Token Expiration in RFC 3339 seconds
    "nce": "LAYER ISSUED NONCE" // The nonce obtained via the Layer client SDK.
}
```

Prebuilt JWT Libraries are available for many languages:

* [Node.js](https://github.com/brianloveswords/node-jws)
* [Go](https://github.com/dgrijalva/jwt-go)
* [Python](https://github.com/progrium/pyjwt/)
* [Ruby](https://github.com/progrium/ruby-jwt)

To assist in setting up a backend, Layer provides sample backend implementations for the following languages:

* [Node.js](https://github.com/layerhq/support/blob/master/identity-services-samples/nodejs/layer.js) (also available as a [Parse Cloud module](https://github.com/layerhq/layer-parse-module))
* [Python](https://github.com/layerhq/support/blob/master/identity-services-samples/python/controller.py)
* [Ruby](https://github.com/layerhq/support/tree/master/identity-services-samples/ruby)
* [Java](https://github.com/layerhq/support/tree/master/identity-services-samples/java)
* [PHP](https://github.com/layerhq/support/tree/master/identity-services-samples/php)
*  [Go](https://github.com/layerhq/support/tree/master/identity-services-samples/go)

Third Party Libraries
* [Ruby Gem](https://rubygems.org/gems/layer-identity_token)
*  [Layer Token Service](https://github.com/dreimannzelt/layer-token_service)  - basic webservice for testing your Layer client

If you build your own libraries and want to be included, send an email to [support@layer.com](mailto:support@layer.com).

##Step 5
Notify the `layerClient` of the new identity token. Add the following code after the logic above.

```java
  layerClient.answerAuthenticationChallenge("IDENTITY_TOKEN");
```

You can validate your identity token by using our tool here - [identity token validation tool](/projects).
