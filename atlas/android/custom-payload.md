# Sending a Custom Payload

The following "howto" guide shows you how to:

1. Override the location button in Atlas with your own button and functionality
2. Send a message containing a custom mimetype
3. Display a custom cell when rendering a message with that custom mimetype

You can find sample code here:
[https://github.com/maju6406/Layer-Parse-iOS-Example-Custom/tree/custompayload](https://github.com/maju6406/Layer-Parse-iOS-Example-Custom/tree/custompayload)
(Check the "custompayload" branch)

![Image](https://raw.githubusercontent.com/maju6406/Layer-Parse-iOS-Example-Custom/custompayload/customexample.png)

## Create custom UICollectionViewCell class
The custom cell in this example will show a simple hard coded text string in the center of the cell.

1 Your new custom class must subclass ATLMessagePresenting

```objc
@interface StarCollectionViewCell : UICollectionViewCell <ATLMessagePresenting>
```

2 Override initWithFrame and perform your initial setup

```objc
@interface StarCollectionViewCell ()
@property (strong,nonatomic) UILabel *title;
@end

@implementation StarCollectionViewCell

-(instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if(self)
    {
        _title = [[UILabel alloc] init];
        _title.translatesAutoresizingMaskIntoConstraints = NO;
        [self addSubview:_title];
        [self configureConstraints];
        self.backgroundColor = [UIColor grayColor];
        

    }
    return self;
}

- (void)configureConstraints
{
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.title attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeWidth multiplier:0.5f constant:0]];
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.title attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeHeight multiplier:0.5f constant:0]];
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.title attribute:NSLayoutAttributeCenterY relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeBottom multiplier:0.5f constant:0]];
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.title attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeRight multiplier:0.5f constant:0]];

}
```

3 Implement ATLMessagePresenting methods
updateWithSender and shouldDisplayAvatarItem are not used in this example so have them return

```objc
- (void)updateWithSender:(id<ATLParticipant>)sender
{
    return; 
}
- (void)shouldDisplayAvatarItem:(BOOL)shouldDisplayAvatarItem
{
    return;
}
```

presentMessage contains the message object associated with the cell.  Retrieve the data from message parts and update cell

```objc
- (void)presentMessage:(LYRMessage *)message
{
    LYRMessagePart *part = message.parts[0];

    // if message contains custom mime type then get the text from the MessagePart JSON
    if([part.MIMEType isEqual: ATLMimeTypeCustomObject])
    {
        NSData *data = part.data;
        NSError* error;
        NSDictionary* json = [NSJSONSerialization JSONObjectWithData:data
                                                             options:kNilOptions
                                                               error:&error];
        self.title.text = [json objectForKey:@"name"];
    }
}
```

** ATLMimeTypeCustomObject is defined in the next step

## Configure ConversationViewController

1 Define the custom cell and mimetype constants

```objc
static NSString *const ATLMIMETypeCustomObjectReuseIdentifier = @"ATLMIMETypeCustomObjectReuseIdentifier";
NSString *const ATLMimeTypeCustomObject = @"application/json+starobject";
NSString *const ATLMimeTypeCustomCellInfo = @"application/json+starcellinfo";
```

2 In viewDidLoad,configure right accessory button to a custom image 
```objc
    // Change right accessory button to a star
    self.messageInputToolbar.rightAccessoryImage = [UIImage imageNamed:@"star.png"];
```

3 In viewDidLoad, Register Custom Cell Class
This tells the view controller that there's a custom cell that could be used

```objc
    // Register custom cell class for star cell
    [self registerClass:[StarCollectionViewCell class] forMessageCellWithReuseIdentifier:ATLMIMETypeCustomObjectReuseIdentifier];
```

4 Implement messagesForMediaAttachments ATLConversationViewControllerDataSource method         

This is the method that gets called when you press the right accessory button  before it sends the message.  This is where you can configure the LYRMessages that get sent.

For the purposed of this example, we will create a message with 2 messagepart containing JSON data:

1. Information to be displayed in the cell
2. Information about the cell itself

```objc
- (NSOrderedSet *)conversationViewController:(ATLConversationViewController *)viewController messagesForMediaAttachments:(NSArray *)mediaAttachments
{
    // If there are no mediaAttachments then we know that the Star button was pressed
    if (mediaAttachments.count == 0)
    {
        // Create messagepart with cell title
        NSDictionary *dataDictionary = @{@"title":@"You are a star!"};
        NSError *JSONSerializerError;
        NSData *dataDictionaryJSON = [NSJSONSerialization dataWithJSONObject:dataDictionary options:NSJSONWritingPrettyPrinted error:&JSONSerializerError];
        LYRMessagePart *dataMessagePart = [LYRMessagePart messagePartWithMIMEType:ATLMimeTypeCustomObject data:dataDictionaryJSON];
        
        
        // Create messagepart with info about cell        
        NSDictionary *cellInfoDictionary = @{@"height":@"100"};
        NSData *cellInfoDictionaryJSON = [NSJSONSerialization dataWithJSONObject:cellInfoDictionary options:NSJSONWritingPrettyPrinted error:&JSONSerializerError];
        LYRMessagePart *cellInfoMessagePart = [LYRMessagePart messagePartWithMIMEType:ATLMimeTypeCustomCellInfo data:cellInfoDictionaryJSON];

        // Add message to ordered set.  This ordered set messages will get sent to the participants
        NSError *error;
        LYRMessage *message = [self.layerClient newMessageWithParts:@[dataMessagePart,cellInfoMessagePart] options:nil error:&error];
        NSOrderedSet *messageSet = [[NSOrderedSet alloc] initWithObject:message];
        return messageSet;
    }
    return nil;
}
``` 
    
5 Implement reuseIdentifierForMessage ATLConversationViewControllerDataSource method     
This is where we tell Atlas to use the custom cell when the message contains the custom mimetype.

```objc
- (NSString *)conversationViewController:(ATLConversationViewController *)viewController reuseIdentifierForMessage:(LYRMessage *)message
{
    LYRMessagePart *part = message.parts[0];
    
    // if message contains the custom mimetype, then return the custom cell reuse identifier
    if([part.MIMEType  isEqual: ATLMimeTypeCustomObject])
    {
        return ATLMIMETypeCustomObjectReuseIdentifier;
    }
    return nil;
}
``` 

6 Implement heightForMessage ATLConversationViewControllerDataSource method     
The custom cell has a custom height that's store in the MessagePart of th Message

```objc 
- (CGFloat)conversationViewController:(ATLConversationViewController *)viewController heightForMessage:(LYRMessage *)message withCellWidth:(CGFloat)cellWidth
{
    
    LYRMessagePart *part = message.parts[0];
    
    // if message contains the custom mimetype, then grab the cell info from the other message part    
    if([part.MIMEType isEqual: ATLMimeTypeCustomObject])
    {
        LYRMessagePart *cellMessagePart = message.parts[1];
        NSData *data = cellMessagePart.data;
        NSError* error;
        NSDictionary* json = [NSJSONSerialization JSONObjectWithData:data
                                                             options:kNilOptions
                                                               error:&error];
        
        // Grab the height value from the JSON
        NSString *height = [json objectForKey:@"height"];
        NSInteger heightInt = [height integerValue];
        return heightInt;
    }
    return 0;
}
``` 

## Configure ConversationListViewController

1 Implement lastMessageTextForConversation" ATLConversationListViewControllerDataSource method 

This will the configure Last Message inside conversationListViewController to show something if the last message contained the custom mimetype
```objc
- (NSString *)conversationListViewController:(ATLConversationListViewController *)conversationListViewController lastMessageTextForConversation:(LYRConversation *)conversation
{
    LYRMessagePart *part = conversation.lastMessage.parts[0];
    
    if([part.MIMEType  isEqual: ATLMimeTypeCustomObject])
    {
        return @"Custom Star Message";
    }
    return nil;
}
```