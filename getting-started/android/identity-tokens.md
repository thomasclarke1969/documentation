#Identity Tokens
To successfully authenticate, Layer requires that your backend application generate `Identity Tokens` on behalf of client applications. This token is simply a [JSON Web Signature](https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-32). There are libraries available in many popular languages for implementing JWS and generating `Identity Tokens`. A few are listed below

* [Node.js](https://github.com/brianloveswords/node-jws)
* [Go](https://github.com/dgrijalva/jwt-go)
* [Python](https://github.com/progrium/pyjwt/)
* [Ruby](https://github.com/progrium/ruby-jwt)

Sample backend implementations are available in:

* Node.js - [Layer Node.js gist](https://gist.github.com/kcoleman731/246bacfe7f7bc3603f33)
* Python - [Layer Python gist](https://gist.github.com/rroopan/82037dd295fdb2f26efa)
* Ruby - [Layer Ruby gist](https://gist.github.com/rroopan/92438bea429c14756d74)

##Setup
Before your backend application can begin generating `Identity Tokens` and authenticating Layer applications, some setup must be performed. A `Provider ID` and `Key ID` must be retained by your back end application and used in the generation of the token.

```emphasis
**Provider ID** - The following `Provider ID` is specific to your account and should be kept private at all times.
```

%%C-PROVIDERID%%

```emphasis
**Key ID** - In order to acquire a `Key ID`, you must first generate an RSA cryptographic key pair by clicking the button below. Layer will upload the public portion to our service and the private key will appear in a pop up. Please copy and save the private key as it must be retained by your backend application and used to sign Identity Tokens.
```

%%C-KEYID%%

To manage your authentication keys please visit the [dashboard](/dashboard/account/auth).

##Identity Token Structure
Layer `Identity Tokens` are conceptually simple, consisting of a small pair of JSON dictionary structures (the JWS Header and Claim) and a cryptographic signature generated over them.

The Layer External Identity Token has the following structure for the Header and Claim:

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

If you are constructing Layer `Identity Token` without the aid of a 3rd party library, the tokens can be constructed in the following manner:

1. Base64 URL encode the `JWS Header`
2. Base64 URL encode the `JWS Claim`
3. Concatenate the encoded header and encoded claim with a ‘.’
4. Sign the concatenated string with the RSA (.pem) key
5. Concatenate both the unsigned string and the signed string with another ‘.’

The full structure of the Layer Identity Token looks like the following:

```console
(Base64URL JWS Header).(Base64URL JWS Claim).(Base64URL RSA Signature of ((Base64URL JWS Header).(Base64URL JWS Claim)))
```

##User Representation With Layer
Included in the generation of the Layer `Identity Token` is your backend's identifier representing the user attempting to authenticate.

```emphasis
This allows you to represent your users within the Layer service via your existing user identifiers. Participation in a Layer conversation is also represented by this same identifier.
```

##Identity Token Validation
We provide an [identity token validation tool](/dashboard/account/tools) in the Layer developer portal. To ensure you are generating identity tokens correctly, please validate your tokens.
