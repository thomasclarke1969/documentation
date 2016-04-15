# Core Components
## Controllers
To implement Atlas fully, you must at least subclass these view controllers:
1. [Conversation List View Controller](#clvc) - List of Conversations
2. [Conversation View Controller](#cvc) - List of Messages and Input

We recommend that you subclass the Atlas classes that you intend to use. In the examples below, `SampleConversationListViewController` is a subclass of `ATLConversationListViewController`, and so on. This gives you the flexibilty to design classes for your use cases, and interface with Atlas via inherited methods and implementing a few data source and delegate methods.

## <a name="clvc"></a> Conversation List View Controller (ATLConversationListViewController)
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
When the user selects a conversation, the `ATLConversationListViewController` notifies the `ATLConversationListViewControllerDelegate` delegate of the action. This is a great time to initiate `ATLConversationViewController`.

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

## <a name="cvc"></a> Conversation View Controller (ATLConversationViewController)
The Conversation View Controller is a `UICollectionViewController` that contains all the messages in the conversation. The area at the top where the participants are listed is called the Address Bar. The area at the bottom of the screen where the user can input text, select an image, or send a location is called the Message Input Toolbar.

### Initializing
The following code shows how to initialize the `ATLConversationViewController` when someone taps on a conversation in a  `ATLConversationListViewController`.

```objective-c
    SampleConversationViewController *controller = [SampleConversationViewController conversationViewControllerWithLayerClient:self.layerClient];
    controller.conversation = conversation;
    controller.displaysAddressBar = YES;
    [self.navigationController pushViewController:controller animated:YES];
```

Currently `ATLConversationViewController` is designed to work as part of the `UINavigationController` navigation stack, and in tandem with Conversation List. If you want to show the Conversation View without a Conversation List you can wrap the `ATLConversationViewController` into a `UINavigationController` as the `rootViewController` as a workaround.
```objective-c
    ATLSampleConversationViewController *controller = [ATLSampleConversationViewController conversationViewControllerWithLayerClient:self.layerClient];
    controller.conversation = conversation;
    controller.displaysAddressBar = YES;
    UINavigationController *conversationViewNavController = [[UINavigationController alloc] initWithRootViewController:controller];
```

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
        if ([participant isEqualToString:self.layerClient.authenticatedUser.userID]) {
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

### Notification when link or phone number is tapped
Atlas will automatically highlight links and phone numbers. You can control what happens when a phone number link is pressed by listening to the `ATLUserDidTapLinkNotification` and `ATLUserDidTapPhoneNumberNotification` notifications.
```objective-c
- (void)viewDidLoad {
...
   [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(userDidTapLink:) name:ATLUserDidTapLinkNotification object:nil];

   [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(userDidTapPhoneNumber:) name:ATLUserDidTapPhoneNumberNotification object:nil];
...
}

- (void)userDidTapLink:(NSNotification *)notification {
   [[UIApplication sharedApplication] openURL:notification.object];
}

- (void)userDidTapPhoneNumber:(NSNotification *)notification {
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"telprompt://%@", notification.object]]];
}
```

#### Other Optional Delegate methods
```objective-c
- (void)conversationViewController:(ATLConversationViewController *)viewController didFailSendingMessage:(LYRMessage *)message error:(NSError *)error;
- (void)conversationViewController:(ATLConversationViewController *)viewController didSelectMessage:(LYRMessage *)message;
- (CGFloat)conversationViewController:(ATLConversationViewController *)viewController heightForMessage:(LYRMessage *)message withCellWidth:(CGFloat)cellWidth;
- (NSOrderedSet *)conversationViewController:(ATLConversationViewController *)viewController messagesForMediaAttachments:(NSArray *)mediaAttachments;
```
