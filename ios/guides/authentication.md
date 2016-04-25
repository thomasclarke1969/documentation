# Authentication

```emphasis
Once you are ready for production implementation, you will need to write your own backend controller to generate identity tokens. You will not be able to use the identity provider from the Quick Start guide.
```

To authenticate a user, the SDK requires that your backend server application generate an identity token and return it to your application.

## Step 1 - Backend Setup
A `Provider ID` and `Key ID` must be retained by your backend application and used in the generation of the token.

```emphasis
**Provider ID** - The following `Provider ID` is specific to your account and should be kept private at all times.
```

%%C-PROVIDERID%%

```emphasis
**Key ID** - In order to acquire a `Key ID`, you must first generate an RSA cryptographic key pair by clicking the button below. Layer will upload the public portion to our service and the  private key will appear in a pop up. Please copy and save the private key as it must be retained by your backend application and used to sign Identity Tokens.
```

%%C-KEYID%%

To manage your authentication keys please visit [Developer Dashboard](https://developer.layer.com/projects/keys).

## Step 2 - Start the Authentication process

The main logic will reside in the `requestAuthenticationNonceWithCompletion` method.

```objectivec
[layerClient requestAuthenticationNonceWithCompletion:^(NSString *nonce, NSError *error) {
   NSLog(@"Authentication nonce %@", nonce);

   /*
    *  CODE goes here. POST the nonce to your backend, generate and return a JWT identity token
    */
}];
```

## Step 3 - POST the nonce and generate identity token
A nonce value will be obtained from Layer and passed into the completion block of the `requestAuthenticationNonceWithCompletion` method. POST this value to your backend and use it to generate a JWT identity token.

A Layer `Identity Token` is a JSON Web Token (JWT) structure that encodes a cryptographically signed set of claims that assert the identity of a particular user within your application. A JWT is transmitted as a compact string value that is formed by concatenating a pair of JSON dictionary structures (the JOSE Header and JWT Claims Set) and a cryptographic signature generated over them. The structure is as follows:

```
// JOSE Header
{
    "typ": "JWT", // String - Expresses a MIME Type of application/JWT
    "alg": "RS256" // String - Expresses the type of algorithm used to sign the token, must be RS256
    "cty": "layer-eit;v=1", // String - Express a Content Type of Layer External Identity Token, version 1
    "kid": "%%C-INLINE-KEYID%%" // String - Layer Key ID used to sign the token. This is your actual Key ID
}

// JWT Claims Set
{
    "iss": "%%C-INLINE-PROVIDERID%%", // String - The Layer Provider ID, this is your actual provider ID
    "prn": "APPLICATION USER ID", // String - Provider's internal ID for the authenticating user
    "iat": "TIME OF TOKEN ISSUANCE AS INTEGER", // Integer - Time of Token Issuance as Unix timestamp ex 1461020965
    "exp": "TIME OF TOKEN EXPIRATION AS INTEGER", // Integer - Arbitrary time of Token Expiration as Unix timestamp ex 1461020965
    "nce": "LAYER ISSUED NONCE" // The nonce obtained via the Layer client SDK.
    "first_name" : "IDENTITY FIRST NAME FOR USER ID" // String - Provider's internal first name.  Optional.
    "last_name" : "IDENTITY LAST NAME FOR USER ID" // String - Provider's internal last name.  Optional.
    "display_name" : "IDENTITY DISPLAY NAME FOR USER ID" // String - Provider's internal display name.  Optional.
    "avatar_url" : "IDENTITY AVATAR URL FOR USER ID" // String - Provider's internal avatar URL. Optional.
}
```

You can learn more about the JSON Web Token standard draft from [jwt.io](http://jwt.io) or by consulting the [specification](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) directly.

Prebuilt JWT Libraries are available for many languages:

* [Node.js](https://github.com/brianloveswords/node-jws)
* [Go](https://github.com/dgrijalva/jwt-go)
* [Python](https://github.com/progrium/pyjwt/)
* [Ruby](https://github.com/progrium/ruby-jwt)

To assist in setting up a backend, Layer provides sample backend implementations for the following languages:

* [Node.js](https://github.com/layerhq/layer-identity-token-nodejs) (also available as a [Parse Cloud module](https://github.com/layerhq/layer-parse-module))
* [Python](https://github.com/layerhq/layer-identity-token-python)
* [Ruby](https://github.com/layerhq/layer-identity-token-ruby)
* [Java](https://github.com/layerhq/layer-identity-token-java)
* [Scala](https://github.com/layerhq/layer-identity-token-scala)
* [PHP](https://github.com/layerhq/layer-identity-token-php)
* [Go](https://github.com/layerhq/support/tree/master/identity-services-samples/go)

Third Party Libraries
* [Ruby Gem](https://rubygems.org/gems/layer-identity_token)
* [.Net C#](https://github.com/khanhvu161188/LayerNet)
* [Layer Token Service](https://github.com/dreimannzelt/layer-token_service)  - basic webservice for testing your Layer client

If you build your own libraries and want to be included, send an email to [support@layer.com](mailto:support@layer.com).

## Step 4 - Notify Layer Client when your backend returns the token
Once you have received a valid Identity Token call the following code in the `requestAuthenticationNonceWithCompletion` method

```objectivec
  [layerClient authenticateWithIdentityToken:@"generatedIdenityToken" completion:^(LYRIdentity *authenticatedUser, NSError *error) {
     NSLog(@"Authenticated as %@", authenticatedUser.userID);
  }];
```

## Troubleshooting

You can validate your identity token by using the [identity token validation tool](/projects/tools) in your developer dashboard.

### Error Messages

| Name    | Description |
|---------|:------:|
| eit_claim_not_found | Invalid claim. Missing values.  |      
| eit_claim_wrong_type |Invalid claim. Wrong value type specified. |        
| eit_expired  | Token expired. Check your expiration timestamp found in the `exp` field. |             
| eit_header_param_not_found | Invalid header. Missing parameters |    
| eit_header_param_wrong_type | Invalid header. Wrong type |  
| eit_header_param_wrong_value | Invalid header. Should be set to JWT |  
| eit_key_deleted | The Key ID you specified has been deleted. Please use a different key or create a new one. | 
| eit_key_disabled | The Key ID you specified has been disabled. Please use a different key or create a new one. |  
| eit_key_malformed | The Key ID you specified is malformed |             
| eit_key_not_found | 'Authentication Key in the `kid` field is invalid. Make sure you provide a valid Authentication Key (Should start with layer:///keys/...) |
| eit_malformed_base64url | Invalid identity token structure. Should be Base64 URL encoded. |    
| eit_malformed_json | Invalid identity token structure. Please refer to our documentation on how to create a valid token.  |      
| eit_nonce_not_found | Nonce not found or has expired |          
| eit_not_before | This identity token can not be used before the `iat` timestamp.  |             
| eit_provider_not_bound_to_app | This Provider ID found in the `iss` field is not bound to a valid Application. |  
| eit_provider_not_found | A valid Provider ID should be set in the `iss` field. |   
| eit_signature_verification_failed |Signature verification failed. This usually means that the token was signed by a different private key which does not match the Authentication Key ID provided in the `kid` field. |
| eit_user_suspended |  Provided User ID found in the `prn` field has been blacklisted.     |     
| eit_wrong_jws_part_count | Invalid identity token structure. Please refer to our documentation on how to create a valid token. | 

