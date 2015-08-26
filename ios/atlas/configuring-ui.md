# Customization

## Configuring Avatars

By default, Atlas behaves like iMessage when showing Avatars.
* Avatars don't appear in 1:1 conversations. Avatars will appear on group conversations. 
To show Avatars in 1:1 conversations, you must set the `shouldDisplayAvatarItemForOneOtherParticipant` property to `YES`. 
```objc
conversationViewController.shouldDisplayAvatarItemForOneOtherParticipant = YES;
```    
* The authenticated user's avatar will not be shown on the right side of the conversation.
To show the current user's avatar, you must set the `shouldDisplayAvatarItemForAuthenticatedUser` property to `YES`. 
```objc
conversationViewController.shouldDisplayAvatarItemForAuthenticatedUser = YES;
```    

You can also show avatar images in the Conversation List. First, you must set the `displaysAvatarItem` property to `YES`.
```objc
self.conversationListViewController.displaysAvatarItem = YES;
```    
Next, you must implement `avatarItemForConversation` method of `ATLConversationListViewController`. The following example will return the avatar of the user of the last message:
```objc
- (id<ATLAvatarItem>)conversationListViewController:(ATLConversationListViewController *)conversationListViewController avatarItemForConversation:(LYRConversation *)conversation
{
    NSString *userID = conversation.lastMessage.sender.userID;
    // Get ATLParticipant for that userID 
    // [YourCode getATLParticipant] is pseudocode 
    ATLParticipant *lastUser = [YourCode getATLParticipant:userID];
    return user;
}
```

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

