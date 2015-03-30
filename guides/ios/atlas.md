# Atlas

Atlas is a lightweight, flexible set of user interface components designed to enable developers to quickly and easily integrate native communications experiences into their applications. It was designed and built from the ground up to integrate with LayerKit, the native iOS SDK for accessing the Layer communications platform. LayerKit provides developers with a simple, object oriented interface to the rich messaging capabilities provided by the Layer platform. Atlas, in turn, provides ready-made UI components that expose these capabilities directly to users.

## Installation

Atlas can be installed directly into your application via CocoaPods or by directly importing the source code files. Please note that Atlas has a direct dependency on LayerKit that must be satisfied in order to build the components.

#### CocoaPods Installation

The recommended path for installation is [CocoaPods](http://cocoapods.org/). You can add Atlas to your project via CocoaPods by adding the following line to your Podfile:

```ruby
pod 'Atlas'
```

Complete the installation by executing:

```sh
$ pod install
```

#### Source Code Installation

If you wish to install Atlas directly into your application from source, then clone the [repository](https://github.com/layerhq/Atlas-iOS) and add code and resources to your application:

1. Drag and drop the files from the `Code` and `Resources` directories onto your project, instructing Xcode to copy items into your destination group's folder.
2. Update your project settings to include the linker flags: `-ObjC -lz`
3. Add the following Cocoa SDK frameworks to your project: `'CFNetwork', 'Security', 'MobileCoreServices', 'SystemConfiguration', 'CoreLocation'`

Build and run your project to verify installation was successful.
For more information, check out the [Atlas](https://github.com/layerhq/Atlas-iOS) on Github.

## Configuring UI Appearance

Atlas takes advantage of Apple's [UIAppearance](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIAppearance_Protocol/) protocol which lets you change UI appearance very easily. Here are just a couple examples of UI customization:

```objc
//To change the font of the message cell to 20pt MarkerFelt-Thin:
[[ATLMessageCollectionViewCell appearance] setMessageTextFont:[UIFont fontWithName:@"MarkerFelt-Thin" size:20.0f]];
```

```objc
//To change the bubble color of the outgoing message cell to orange:
[[ATLOutgoingMessageCollectionViewCell appearance] setMessageTextColor:[UIColor orangeColor]];
```

The follow is a list of all Atlas properties conforming to `UIAppearance`:

### ATLMessageCollectionViewCell
##### (ATLOutgoingMessageCollectionViewCell and ATLIncomingMessageCollectionViewCell extend this class)
```objc
@property (nonatomic) UIFont *messageTextFont
@property (nonatomic) UIColor *messageTextColor
@property (nonatomic) UIColor *messageLinkTextColor
@property (nonatomic) UIColor *bubbleViewColor
@property (nonatomic) CGFloat bubbleViewCornerRadius
```

### ATLAddressBarTextView
```objc
@property (nonatomic) UIFont *addressBarFont
@property (nonatomic) UIColor *addressBarTextColor
@property (nonatomic) UIColor *addressBarHighlightColor
```

### ATLAvatarImageView
```objc
@property (nonatomic) CGFloat avatarImageViewDiameter
@property (nonatomic) UIFont *initialsFont
@property (nonatomic) UIColor *initialsColor
@property (nonatomic) UIColor *imageViewBackgroundColor
```

### ATLConversationCollectionViewHeader
```objc
@property (nonatomic) UIFont *participantLabelFont
@property (nonatomic) UIColor *participantLabelTextColor
```

### ATLConversationTableViewCell
```objc
@property (nonatomic) UIFont *conversationTitleLabelFont
@property (nonatomic) UIColor *conversationTitleLabelColor
@property (nonatomic) UIFont *lastMessageLabelFont
@property (nonatomic) UIColor *lastMessageLabelColor
@property (nonatomic) UIFont *dateLabelFont
@property (nonatomic) UIColor *dateLabelColor
@property (nonatomic) UIColor *unreadMessageIndicatorBackgroundColor
@property (nonatomic) UIColor *cellBackgroundColor
```

### ATLParticipantSectionHeaderView
```objc
@property (nonatomic) UIFont *sectionHeaderFont
@property (nonatomic) UIColor *sectionHeaderTextColor
@property (nonatomic) UIColor *sectionHeaderBackgroundColor
```

### ATLParticipantTableViewCell
```objc
@property (nonatomic) UIFont *titleFont
@property (nonatomic) UIFont *boldTitleFont
@property (nonatomic) UIColor *titleColor
```
<a name="parse"></a>
## Integrating Parse with Atlas
[LayerParseSampleApp](https://github.com/layerhq/LayerParseSampleApp) is a sample application highlighting how to integrate Atlas, the iOS UI Kit for the Layer communications platform with a Parse backend. It presents a very simple example of a chat app.

### Setup

This project requires Xcode and the iOS SDK v8.0, and uses [Cocoapods](cocoapods.org).

1. Clone the project from Github: `$ git clone https://github.com/layerhq/LayerParseSampleApp.git`
2. Install the dependencies in the root directory via CocoaPods: `$ pod install`
3. Open `LayerParseSampleApp.xcworkspace` in Xcode.
4. Replace `ATLPLayerAppIDString` , `ParseAppIDString` , and `ParseClientKeyString` in `ATLPAppDelegate.m` with your Layer and Parse credentials.
5. Add the [Layer Parse Module](https://github.com/layerhq/layer-parse-module) to your Parse Cloud Code to serve as an authentication manager.
6. (Recommended) If you want test users, import the User.json file found under Supporting Files from the XCode project into your User class on Parse.
7. Build and run the application on your Simulator to create a new user and begin messaging!

### Sign Up and Authentication

#### ParseUI and SignUp

The `ATLPViewController` controls the ParseUI and Layer+Atlas instantiation.  If there is no localized Parse user then we present a `PFLogInViewController` that includes an instance of `PFSignUpViewController`.  

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
- (void)logInViewController:(PFLogInViewController *)logInController didLogInUser:(PFUser *)user {
    [self dismissViewControllerAnimated:YES completion:nil];
    [self loginLayer];
}

// Sent to the delegate when a PFUser is signed up.
- (void)signUpViewController:(PFSignUpViewController *)signUpController didSignUpUser:(PFUser *)user {
    [self dismissViewControllerAnimated:YES completion:nil];
    [self loginLayer];
}
```

#### Layer Authentication

Layer authentication gets the property `objectId` of the `[PFUser currentUser]` and uses that as the `userID`.  The Layer authentication step uses the Parse Cloud Code function you set up in step 5 to create an `identityToken` from your specific application ensuring the highest level of security. Upon a successful authentication, an `ATLConversationListController` instance is created and presented on the screen.

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
### Users

#### Sample Users and Testing

To let you test the features without needing a device, we've created test Parse Users that can be used as participants in a sample conversation.  Find the `Users.json` file under Supporting Files in your XCode project, go to your Parse User table, select import, and drag the file to complete.  The `ATLPUserDataSource` handles all querying and caching of `PFUser`s for the application, and Users `Bob Test` and `Jane Test` will be available.

#### PFUser + ATLParticipant

Atlas requires that User objects adhere to the `ATLParticipant` protocol to fully leverage all of its features.  We've created a category on the `PFUser` class that will satisfy this requirement.  Feel free to customize the implementation to return the values you desire from your `PFUser`'s custom properties.

