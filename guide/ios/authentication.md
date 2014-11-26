# Authentication

```emphasis
Once you are ready for production implementation, you will need to write your own backend controller to generate an identity token. You will not be able to use the authentication implemenation from the Quick Start guide.
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

To manage your authentication keys please visit the [Layer Dashboard](/dashboard/projects).

##Step 2 - Start the Authentication process
The main logic will reside in the `requestAuthenticationNonceWithCompletion` method.

```objectivec
[layerClient requestAuthenticationNonceWithCompletion:^(NSString *nonce, NSError *error) {
   NSLog(@"Authentication nonce %@", nonce);

   /*
    *  CODE goes here. POST the nonce to your backend, sign it using JWT and return an identity token  
    */
}];
```

##Step 3 - POST the nonce and generate identity token
A nonce value will be passed into the `requestAuthenticationNonceWithCompletion` method. POST that value to your backend and sign it using JWT.

`Identity Tokens` are a pair of JSON dictionary structures (the JWS Header and Claim) and a cryptographic signature generated over them. The structure is as follows:

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

To assist in setting up a backend, Layer provides sample backend implementations for the followin languages:

* [Node.js](https://github.com/layerhq/support/blob/master/identity-services-samples/nodejs/layer.js)
* [Python](https://github.com/layerhq/support/blob/master/identity-services-samples/python/controller.py)
* [Ruby](https://github.com/layerhq/support/tree/master/identity-services-samples/ruby)
* [Java](https://github.com/layerhq/support/tree/master/identity-services-samples/java)
* [PHP](https://github.com/layerhq/support/tree/master/identity-services-samples/php)

There is also a sample backend available as a [Parse module](https://github.com/layerhq/layer-parse-module).

Please also contact <support@layer.com> if you have any questions.

##Step 4 - Notify Layer Client when your backend returns the token
Once you have received a valid Identity Token call the following code in the `requestAuthenticationNonceWithCompletion` method

```objectivec
  [layerClient authenticateWithIdentityToken:@"generatedIdenityToken" completion:^(NSString *authenticatedUserID, NSError *error) {
     NSLog(@"Authenticated as %@", authenticatedUserID);
  }];
```

You can validate your identity token by using our tool here - [identity token validation tool](/dashboard/projects).
