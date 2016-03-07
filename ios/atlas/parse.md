# Parse Integration
[Layer-Parse-iOS-Example](https://github.com/layerhq/Layer-Parse-iOS-Example) is a sample application highlighting how to integrate Atlas, the iOS UI Kit for the Layer communications platform with Parse to handle user management. It presents a very simple example of a chat app.

## Setup

This project requires Xcode and the iOS SDK v8.0, and uses [Cocoapods](cocoapods.org).

1. Clone the project from GitHub: `git clone https://github.com/layerhq/Layer-Parse-iOS-Example.git`
2. Install the dependencies in the root directory via CocoaPods: `pod install`
3. Open `Layer-Parse-iOS-Example.xcworkspace` in Xcode.
4. Replace `LayerAppIDString` , `ParseAppIDString` , and `ParseClientKeyString` in `AppDelegate.m` with your Layer and Parse credentials.
5. Add the [Layer Parse Module](https://github.com/layerhq/layer-parse-module) to your Parse Cloud Code to serve as an authentication manager.
6. (Recommended) If you want test users, import the User.json file found under Supporting Files from the Xcode project into your User class on Parse.
7. Build and run the application on your Simulator to create a new user and begin messaging!

## Sign Up and Authentication

### ParseUI and SignUp

The `ViewController` controls the ParseUI and Layer+Atlas instantiation.  If there is no localized Parse user then we present a `PFLogInViewController` that includes an instance of `PFSignUpViewController`.

```objc
    if (![PFUser currentUser]) { // No user logged in
        // Create the log in view controller
        self.logInViewController = [[PFLogInViewController alloc] init];
        ...
        // Create the sign up view controller
        PFSignUpViewController *signUpViewController = [[PFSignUpViewController alloc] init];

        // Assign our sign up controller to be displayed from the login controller
        [self.logInViewController setSignUpController:signUpViewController];
        ...
        // Present the log in view controller
        [self presentViewController:self.logInViewController animated:YES completion:nil];
```

The ParseUI controllers are flexible, and our sample requires a username, email, and password for signup.  Both controllers interact with the application through the `PFLogInViewControllerDelegate` and `PFSignUpViewControllerDelegate` protocols respectively. After either a successful login or a successful signup we instantiate the Layer instance.

```objc
// Sent to the delegate when a PFUser is logged in.
- (void)logInViewController:(PFLogInViewController *)logInController didLogInUser:(PFUser *)user
{
    [self dismissViewControllerAnimated:YES completion:nil];
    [self loginLayer];
}

// Sent to the delegate when a PFUser is signed up.
- (void)signUpViewController:(PFSignUpViewController *)signUpController didSignUpUser:(PFUser *)user
{
    [self dismissViewControllerAnimated:YES completion:nil];
    [self loginLayer];
}
```

### Layer Authentication

Layer authentication gets the property `objectId` of the `[PFUser currentUser]` and uses that as the `userID`.  The Layer authentication step uses the Parse Cloud Code function you set up in step 5 to create an `identityToken` from your specific application ensuring the highest level of security. Upon a successful authentication, an `ConversationListController` instance is created and presented on the screen.

```objc
    [self.layerClient connectWithCompletion:^(BOOL success, NSError *error) {
        if (!success) {
            NSLog(@"Failed to connect to Layer: %@", error);
        } else {
            PFUser *user = [PFUser currentUser];
            NSString *userID = user.objectId;
            [self authenticateLayerWithUserID:userID completion:^(BOOL success, NSError *error) {
                if (!error){
                    [self presentConversationListViewController];
                } else {
                    NSLog(@"Failed Authenticating Layer Client with error:%@", error);
                }
            }];
        }
    }];
```
## Users

### Sample Users and Testing

To let you test the features without needing a device, we've created test Parse Users that can be used as participants in a sample conversation.  Find the `Users.json` file under Supporting Files in your Xcode project, go to your Parse User table, select import, and drag the file to complete.  The `UserManager` handles all querying and caching of `PFUser`s for the application, and Users `Bob Test` and `Jane Test` will be available.

### PFUser + ATLParticipant

Atlas requires that User objects adhere to the `ATLParticipant` protocol to fully leverage all of its features.  We've created a category on the `PFUser` class that will satisfy this requirement.  Feel free to customize the implementation to return the values you desire from your `PFUser`'s custom properties.

