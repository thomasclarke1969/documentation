#Add Your Users to Atlas
Layer recognizes that you might already have a User Model in your app.  Atlas can work with any User Model as long as it conforms to the `ATLParticipant` protocol.

##<a name="atlp"></a> ATLParticipant Protocol

```objective-c
// The first name of the participant as it should be presented in the user interface.
@property (nonatomic, readonly) NSString *firstName;
// The last name of the participant as it should be presented in the user interface.
@property (nonatomic, readonly) NSString *lastName;
// The full name of the participant as it should be presented in the user interface.
@property (nonatomic, readonly) NSString *fullName;
// The unique identifier of the participant as it should be used for Layer addressing. This identifier is issued by the Layer identity provider backend.
@property (nonatomic, readonly) NSString *participantIdentifier;
```

### Optional ATLProtocol Methods
With Atlas, you can have Avatar Bubbles appear alongside Conversation and Messages. These optional properties of `ATLParticipant` represent the Avatar. If the property returns `nil` then it will be ignored.
```objective-c
@property (nonatomic, readonly) NSURL *avatarImageURL;
@property (nonatomic, readonly) UIImage *avatarImage;
@property (nonatomic, readonly) NSString *avatarInitials;
```

## Controllers
When creating a conversation, there are 2 different view controllers that need to pull from you list of users:
1. [Address Bar View Controller](#abvc) - List of Users in Conversation
2. [Participant Table View Controller](#ptvc) - List of total Users 
Both View Controllers assume the list of participants

##<a name="abvc"></a> Address Bar View Controller (ATLAddressBarViewController)
The Address Bar View Controller appears at the top of the ATLConversationViewController. When creating a new conversation you can add the participants in the view, or initiate the the Participant Table View Controller. If the conversation exists then the address will contain a read-only list of participants.

### Initialization
The ConversationViewController includes an instance of the by default. You will need to implement the AddressBarViewController delegate methods. 
```objective-c
- (void)viewDidLoad {
    [super viewDidLoad];
...    
    self.addressBarController.delegate = self;
...
}
```

### Configuring Add Contacts Button
When the user taps the + in the Address Bar, the `ATLAddressBarViewController` notifies the `ATLAddressBarViewControllerDelegate` delegate of the action. This is a great time to initiate `ATLParticipantTableViewController`. 
```objective-c
- (void)addressBarViewController:(ATLAddressBarViewController *)addressBarViewController didTapAddContactsButton:(UIButton *)addContactsButton
{
    // On initialization, pass in a NSSet of Objects that adhere to the ATLParticipant Protocol    
    SampleParticipantTableViewController *controller = [SampleParticipantTableViewController 
    participantTableViewControllerWithParticipants:[NSSet setWithArray:users] sortType:ATLParticipantPickerSortTypeFirstName];
    controller.delegate = self;
    
    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:controller];
    [self.navigationController presentViewController:navigationController animated:YES completion:nil];
}
```

### Configuring Address Bar Search
When the user types in the Address Bar, the `ATLAddressBarViewController` notifies the `ATLAddressBarViewControllerDelegate` delegate of the action. 
```objective-c
-(void)addressBarViewController:(ATLAddressBarViewController *)addressBarViewController searchForParticipantsMatchingText:(NSString *)searchText completion:(void (^)(NSArray *))completion {
    // Search your users here (Pseudocode)
    [[UserManager sharedManager] queryForUserWithName:searchText completion:^(NSArray *participants, NSError *error) {
        if (!error) {
            if (completion) completion(participants);
        } else {
            NSLog(@"Error search for participants: %@", error);
        }
    }];
}
```

### Optional Delegate methods
```objective-c
- (void)addressBarViewControllerDidBeginSearching:(ATLAddressBarViewController *)addressBarViewController;
- (void)addressBarViewController:(ATLAddressBarViewController *)addressBarViewController didSelectParticipant:(id<ATLParticipant>)participant;
- (void)addressBarViewController:(ATLAddressBarViewController *)addressBarViewController didRemoveParticipant:(id<ATLParticipant>)participant;
- (void)addressBarViewControllerDidEndSearching:(ATLAddressBarViewController *)addressBarViewController;
- (void)addressBarViewControllerDidSelectWhileDisabled:(ATLAddressBarViewController *)addressBarViewController;
```

##<a name="ptvc"></a> Participant Table View Controller  (ATLParticipantTableViewController)
The Participant Table View Controller is a `UITableViewController` that contains all the participants the authenticated user can message.

###  Notification when Participant is selected
When the user selects a participant, the `ATLParticipantTableViewController` notifies the `ATLParticipantTableViewControllerDelegate`  delegate of the action. This is a great time to update the address bar.
```objective-c
- (void)participantTableViewController:(ATLParticipantTableViewController *)participantTableViewController didSelectParticipant:(id<ATLParticipant>)participant {
    [self.addressBarController selectParticipant:participant];
    [self.navigationController dismissViewControllerAnimated:YES completion:nil];
}
```

###  Notification when User searches
When the user selects a participant, the `ATLParticipantTableViewController` notifies the `ATLParticipantTableViewControllerDelegate` delegate of the action.
```objective-c
- (void)participantTableViewController:(ATLParticipantTableViewController *)participantTableViewController didSearchWithString:(NSString *)searchText completion:(void (^)(NSSet *))completion {
    NSLog(@"Search Text: %@",searchText);
    // Search your users here (Pseudocode)
    [[UserManager sharedManager] queryForUserWithName:searchText completion:^(NSArray *participants, NSError *error) {
        if (!error) {
            if (completion) completion([NSSet setWithArray:participants]);
        } else {
            NSLog(@"Error search for participants: %@", error);
        }
    }];    
}
```

#### Other Optional Delegate methods
```objective-c
- (void)participantTableViewController:(ATLParticipantTableViewController *)participantTableViewController didDeselectParticipant:(id<ATLParticipant>)participant;
```