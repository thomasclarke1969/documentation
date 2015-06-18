# Policies

Very often you will want control how your users communicate with each other or how your app communicates with your users. For example, a user may want to block another user or your app may want to blacklist another user. To this end, Layer has introduced the concept of Policy: a set of rules by which different actors and actions in the system are determined and governed. Policies are represented by the `Policy` class.

##Fetching Policies
To acquire all the policies, you can call `getPolicies()` in the `LayerClient` object. 

```java
List<Policy> allPolicies = layerClient.getPolicies();
```

##Blocking

Block is a user policy that defines how two users in your app can communicate. The action of blocking a user results in the Blockee losing certain privileges in relation to the Blocker. For more in-depth information about blocking check out [What happens when I apply a Block policy?](https://support.layer.com/hc/en-us/articles/204050814)

To block a user:
```java
//The authenticated user will block all messages sent by bob
layerClient.addPolicy(Policy.builder(Policy.PolicyType.BLOCK).sentByUserId("bob").build());
```

To unblock the user, simply remove the policy:
```java
//Allows bob to send messages to the authenticated user again
layerClient.removePolicy(Policy.builder(Policy.PolicyType.BLOCK).sentByUserId("bob").build());
```