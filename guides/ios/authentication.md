# Authentication

```emphasis
Once you are ready for production implementation, you will need to write your own backend controller to generate identity tokens. You will not be able to use the identity provider from the Quick Start guide.
```

To authenticate a user, the SDK requires that your backend server application generate an identity token and return it to your application.

##Step 1 - Backend Setup
A `Provider ID` and `Key ID` must be retained by your backend application and used in the generation of the token.

```emphasis
**Provider ID** - The following `Provider ID` is specific to your account and should be kept private at all times.
```

%%C-PROVIDERID%%

```emphasis
**Key ID** - In order to acquire a `Key ID`, you must first generate an RSA cryptographic key pair by clicking the button below. Layer will upload the public portion to our service and the  private key will appear in a pop up. Please copy and save the private key as it must be retained by your backend application and used to sign Identity Tokens.
```

%%C-KEYID%%

To manage your authentication keys please visit the [Layer Dashboard](/projects).

##Step 2 - Start the Authentication process
The main logic will reside in the `requestAuthenticationNonceWithCompletion` method.

```objectivec
[layerClient requestAuthenticationNonceWithCompletion:^(NSString *nonce, NSError *error) {
   NSLog(@"Authentication nonce %@", nonce);

   /*
    *  CODE goes here. POST the nonce to your backend, generate and return a JWT identity token
    */
}];
```

##Step 3 - POST the nonce and generate identity token
A nonce value will be obtained from Layer and passed into the completion block of the `requestAuthenticationNonceWithCompletion` method. POST this value to your backend and use it to generate a JWT identity token.

A Layer `Identity Token` is a JSON Web Token (JWT) structure that encodes a cryptographically signed set of claims that assert the identity of a particular user within your application. A JWT is transmitted as a compact string value that is formed by concatenating a pair of JSON dictionary structures (the JOSE Header and JWT Claims Set) and a cryptographic signature generated over them. The structure is as follows:

```
// JOSE Header
{
    "typ": "JWS", // String - Expresses a MIME Type of application/JWS
    "alg": "RS256" // String - Expresses the type of algorithm used to sign the token, must be RS256
    "cty": "layer-eit;v=1", // String - Express a Content Type of Layer External Identity Token, version 1
    "kid": "%%C-INLINE-KEYID%%" // String - Layer Key ID used to sign the token. This is your actual Key ID
}

// JWT Claims Set
{
    "iss": "%%C-INLINE-PROVIDERID%%", // String - The Layer Provider ID, this is your actual provider ID
    "prn": "APPLICATION USER ID", // String - Provider's internal ID for the authenticating user
    "iat": "TIME OF TOKEN ISSUANCE AS INTEGER", // Integer - Time of Token Issuance in RFC 3339 seconds
    "exp": "TIME OF TOKEN EXPIRATION AS INTEGER", // Integer - Arbitrary time of Token Expiration in RFC 3339 seconds
    "nce": "LAYER ISSUED NONCE" // The nonce obtained via the Layer client SDK.
}
```

You can learn more about the JSON Web Token standard draft from [jwt.io](http://jwt.io) or by consulting the [specification](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) directly.

Prebuilt JWT Libraries are available for many languages:

* [Node.js](https://github.com/brianloveswords/node-jws)
* [Go](https://github.com/dgrijalva/jwt-go)
* [Python](https://github.com/progrium/pyjwt/)
* [Ruby](https://github.com/progrium/ruby-jwt)

To assist in setting up a backend, Layer provides sample backend implementations for the followin languages:

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

##Step 4 - Notify Layer Client when your backend returns the token
Once you have received a valid Identity Token call the following code in the `requestAuthenticationNonceWithCompletion` method

```objectivec
  [layerClient authenticateWithIdentityToken:@"generatedIdenityToken" completion:^(NSString *authenticatedUserID, NSError *error) {
     NSLog(@"Authenticated as %@", authenticatedUserID);
  }];
```

You can validate your identity token by using our tool here - [identity token validation tool](/projects).
