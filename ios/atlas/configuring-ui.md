# Configuring UI
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

