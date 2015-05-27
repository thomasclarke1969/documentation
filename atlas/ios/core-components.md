#Core Components
## Controller
To implement Atlas fully, you must at least subclass these three view contollers:
1. [Conversation List View Controller](#clvc) - List of Conversations
2. [Conversation View Controller](#cvc) - List of Messages and Input
3. [Address Bar View Controller](#abvc) - List of Users in Conversation
4. [Participant Table View Controller](#ptvc) - List of total Users 

##<a name="clvc"></a> Conversation List View Controller (ATLConversationListViewController)
The Conversation List View Controller is a `UITableViewController` that contains a list of all the conversations that the authenticated user ID belongs to. By default, the cell will contain a title and will show the last message text in conversation.

### Initializing
Once you have connected to Layer and authenticated the user, you can launch the Conversation List View by calling `conversationListViewControllerWithLayerClient`.

```objective-c
    SampleConversationListViewController *controller = [SampleConversationListViewController  conversationListViewControllerWithLayerClient:self.layerClient];
    [self.rootViewController pushViewController:controller animated:YES];
```

###  Configuring Conversation Title
You can configure the conversation title by implementing the `ATLConversationListViewControllerDataSource` protocol.
```objective-c
- (NSString *)conversationListViewController:(ATLConversationListViewController *)conversationListViewController titleForConversation:(LYRConversation *)conversation {
    return @"This is my conversation title";
}
```

#### Other Optional DataSource methods:
```objective-c
- (id<ATLAvatarItem>)conversationListViewController:(ATLConversationListViewController *)conversationListViewController avatarItemForConversation:(LYRConversation *)conversation;
- (NSString *)reuseIdentifierForConversationListViewController:(ATLConversationListViewController *)conversationListViewController;
- (NSString *)conversationListViewController:(ATLConversationListViewController *)conversationListViewController textForButtonWithDeletionMode:(LYRDeletionMode)deletionMode;
- (UIColor *)conversationListViewController:(ATLConversationListViewController *)conversationListViewController colorForButtonWithDeletionMode:(LYRDeletionMode)deletionMode;
- (NSString *)conversationListViewController:(ATLConversationListViewController *)conversationListViewController lastMessageTextForConversation:(LYRConversation *)conversation;
```

###  Notification when Conversation is selected
When the user selects a conversation, the `ATLConversationListViewController` notifies the `ATLConversationListViewControllerDelegate` delegate of the action. This is a great time to initiate `ATLConversationListViewController`. 

```objective-c
- (void)conversationListViewController:(ATLConversationListViewController *)conversationListViewController didSelectConversation:(LYRConversation *)conversation {
    SampleConversationViewController *controller = [SampleConversationViewController conversationViewControllerWithLayerClient:self.layerClient];
    controller.conversation = conversation;
    controller.displaysAddressBar = YES;
    [self.navigationController pushViewController:controller animated:YES];
}
```

#### Other Optional Delegate methods
```objective-c
- (void)conversationListViewController:(ATLConversationListViewController *)conversationListViewController didDeleteConversation:(LYRConversation *)conversation deletionMode:(LYRDeletionMode)deletionMode;
- (void)conversationListViewController:(ATLConversationListViewController *)conversationListViewController didFailDeletingConversation:(LYRConversation *)conversation deletionMode:(LYRDeletionMode)deletionMode error:(NSError *)error;
- (void)conversationListViewController:(ATLConversationListViewController *)conversationListViewController didSearchForText:(NSString *)searchText completion:(void (^)(NSSet *filteredParticipants))completion;
```

##<a name="cvc"></a> Conversation View Controller (ATLConversationViewController)
The Conversation View Controller is a `UICollectionViewController` that contains all the messages in the conversation. The area at the top where the participants are listed is called the Address Bar. The area at the bottom of the screen where the user can input text, select an image, or send a location is called the Message Input Toolbar.

###  Configuring Date String
You can configure the date shown by implementing the  `ATLConversationViewControllerDataSource ` protocol.
```objective-c
- (NSAttributedString *)conversationViewController:(ATLConversationViewController *)conversationViewController attributedStringForDisplayOfDate:(NSDate *)date {
    NSDictionary *attributes = @{NSFontAttributeName : [UIFont systemFontOfSize:14],
                                 NSForegroundColorAttributeName : [UIColor grayColor] };
    return [[NSAttributedString alloc] initWithString:[self.dateFormatter stringFromDate:date] attributes:attributes];
}
```

###  Configuring Recipient Status String
You can configure the recipient status under the message by implementing the `ATLConversationViewControllerDataSource` protocol.
```objective-c
- (NSAttributedString *)conversationViewController:(ATLConversationViewController *)conversationViewController attributedStringForDisplayOfRecipientStatus:(NSDictionary *)recipientStatus {
    if (recipientStatus.count == 0) return nil;
    NSMutableAttributedString *mergedStatuses = [[NSMutableAttributedString alloc] init];

    [[recipientStatus allKeys] enumerateObjectsUsingBlock:^(NSString *participant, NSUInteger idx, BOOL *stop) {
        LYRRecipientStatus status = [recipientStatus[participant] unsignedIntegerValue];
        if ([participant isEqualToString:self.layerClient.authenticatedUserID]) {
            return;
        }

        NSString *checkmark = @"✔︎";
        UIColor *textColor = [UIColor lightGrayColor];
        if (status == LYRRecipientStatusSent) {
            textColor = [UIColor lightGrayColor];
        } else if (status == LYRRecipientStatusDelivered) {
            textColor = [UIColor orangeColor];
        } else if (status == LYRRecipientStatusRead) {
            textColor = [UIColor greenColor];
        }
        NSAttributedString *statusString = [[NSAttributedString alloc] initWithString:checkmark attributes:@{NSForegroundColorAttributeName: textColor}];
        [mergedStatuses appendAttributedString:statusString];
    }];
    return mergedStatuses;
}
```

#### Other Optional DataSource methods:
```objective-c
- (NSString *)conversationViewController:(ATLConversationViewController *)viewController reuseIdentifierForMessage:(LYRMessage *)message;
- (LYRConversation *)conversationViewController:(ATLConversationViewController *)viewController conversationWithParticipants:(NSSet *)participants;
```

###  Notification when Message is sent
When the user sends a message, the `ATLConversationViewController` notifies the `ATLConversationViewControllerDelegate` delegate of the action.
```objective-c
- (void)conversationViewController:(ATLConversationViewController *)viewController didSendMessage:(LYRMessage *)message {
    NSLog(@"Message Was Sent!");
}
```

#### Other Optional Delegate methods
```objective-c
- (void)conversationViewController:(ATLConversationViewController *)viewController didFailSendingMessage:(LYRMessage *)message error:(NSError *)error;
- (void)conversationViewController:(ATLConversationViewController *)viewController didSelectMessage:(LYRMessage *)message;
- (CGFloat)conversationViewController:(ATLConversationViewController *)viewController heightForMessage:(LYRMessage *)message withCellWidth:(CGFloat)cellWidth;
- (NSOrderedSet *)conversationViewController:(ATLConversationViewController *)viewController messagesForMediaAttachments:(NSArray *)mediaAttachments;
```

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
    NSLog(@"Search Text: %@",searchText);
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
}
```

#### Other Optional Delegate methods
```objective-c
- (void)participantTableViewController:(ATLParticipantTableViewController *)participantTableViewController didDeselectParticipant:(id<ATLParticipant>)participant;
```