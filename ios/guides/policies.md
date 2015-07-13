# Policies

Very often you will want control how your users communicate with each other or how your app communicates with your users. For example, a user may want to block another user or your app may want to blacklist another user. To this end, Layer has introduced the concept of Policy: a set of rules by which different actors and actions in the system are determined and governed. Policies are represented by the `LYRPolicy` class.

##Fetching Policies

To acquire all the policies, access `policies` property of `LYRClient`. To acquire all polices applied to an individual participant you can filter by using a `NSPredicate`:

```objc
NSOrderedSet *policies = self.layerClient.policies;
NSString *participant =  "<PARTICIPANT>";
NSPredicate *policyPredicate = [NSPredicate predicateWithFormat:@"SELF.sentByUserID = %@", participant];
NSOrderedSet *filteredPolicies = [policies filteredOrderedSetUsingPredicate:policyPredicate];
for (LYRPolicy *policy in filteredPolicies.array) {
// Enumerate through policies
}
 ```    

##Blocking

Block is a user policy that defines how two users in your app can communicate. The action of blocking a user results in the Blockee losing certain privileges in relation to the Blocker. For more in-depth information about blocking check out [What happens when I apply a Block policy?](https://support.layer.com/hc/en-us/articles/204050814)

To block a user:
```objc
LYRPolicy *blockPolicy = [LYRPolicy policyWithType:LYRPolicyTypeBlock];
blockPolicy.sentByUserID = @"<USER_TO_BLOCK>";

NSError *error = nil;
BOOL success = [self.layerClient addPolicy:blockPolicy error:&error];
if (!success) {
    NSLog(@"Failed adding policy with error %@", error);
}
```    

To unblock the user, simply remove the policy:
```objc
// First check to see if a policy between the already exists
NSOrderedSet *policies = self.layerClient.policies;
NSString *participant = self.participantIdentifiers[indexPath.row];
NSPredicate *policyPredicate = [NSPredicate predicateWithFormat:@"SELF.sentByUserID = %@ AND SELF.type = %d", @"<USER_TO_BLOCK>",LYRPolicyTypeBlock ];
NSOrderedSet *filteredPolicies = [policies filteredOrderedSetUsingPredicate:policyPredicate];

if (filteredPolicies.count) {
    NSError *error = nil;    
    BOOL success = [self.layerClient removePolicy:filteredPolicies.firstObject error:&error];
    if (!success) {
        NSLog(@"Failed removing policy with error %@", error);
    }
}    
```
