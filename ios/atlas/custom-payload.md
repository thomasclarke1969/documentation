# Sending Custom Payloads
The following tutorial shows you how to:
1. Override the location button in Atlas with your own button and functionality
2. Send a message containing a custom mimetype
3. Display a custom cell when rendering a message with that custom mimetype

The end result of this tutorials looks like:
![Image](customexample.jpg)

## Create custom UICollectionViewCell class
The custom cell in this tutorial will be named `StarCollectionViewCell` and will show a simple hard coded text string in the center of the cell and a Info button.

1. Your new custom class must implementation `ATLMessagePresenting`

    ```objective-c
    @interface StarCollectionViewCell : UICollectionViewCell <ATLMessagePresenting>
    ```

2. Override initWithFrame and perform your initial setup

    ```objective-c
    @interface StarCollectionViewCell ()
    @property (strong,nonatomic) UILabel *title;
    @property (strong,nonatomic) UIButton *button;
    @property (strong,nonatomic) LYRMessage *message;
    @end

    @implementation StarCollectionViewCell

    -(instancetype)initWithFrame:(CGRect)frame {
        self = [super initWithFrame:frame];
        if(self)
        {
            // Configure Label
            _title = [[UILabel alloc] init];
            _title.translatesAutoresizingMaskIntoConstraints = NO;
            [self addSubview:_title];
            [self configureConstraints];
            self.backgroundColor = [UIColor grayColor];

            // Configure Button
            _button = [UIButton buttonWithType:UIButtonTypeInfoDark];
            [_button addTarget:self
                       action:@selector(buttonTapped:)
             forControlEvents:UIControlEventTouchUpInside];
            _button.translatesAutoresizingMaskIntoConstraints = NO;
            [self addSubview:_button];
            }
        return self;
    }

    - (void)buttonTapped:(id)sender {
        // Show message identifer in Alert Dialog
        NSString *alertText = self.message.identifier.description;
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Hello!" message:alertText delegate:self cancelButtonTitle:nil otherButtonTitles:nil];
        [alert addButtonWithTitle:@"Ok"];
        [alert show];
    }
    - (void)configureConstraints {
        [self addConstraint:[NSLayoutConstraint constraintWithItem:self.title attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeWidth multiplier:0.5f constant:0]];
        [self addConstraint:[NSLayoutConstraint constraintWithItem:self.title attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeHeight multiplier:0.5f constant:0]];
        [self addConstraint:[NSLayoutConstraint constraintWithItem:self.title attribute:NSLayoutAttributeCenterY relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeBottom multiplier:0.5f constant:0]];
        [self addConstraint:[NSLayoutConstraint constraintWithItem:self.title attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeRight multiplier:0.5f constant:0]];
    }
    ```

3. Implement `ATLMessagePresenting` methods. `updateWithSender` and `shouldDisplayAvatarItem` are not used in this example so have them return immediately.
    ```objective-c
    - (void)updateWithSender:(id<ATLParticipant>)sender{return;}
    - (void)shouldDisplayAvatarItem:(BOOL)shouldDisplayAvatarItem{return;}
    ```

    `presentMessage` contains the message object associated with the cell.  Retrieve the data from message parts and update the cell.

    ```objective-c
    - (void)presentMessage:(LYRMessage *)message {
        self.message = message;
        LYRMessagePart *part = message.parts[0];

        // if message contains custom mime type then get the text from the MessagePart JSON
        if([part.MIMEType isEqual: ATLMimeTypeCustomObject])
        {
            NSData *data = part.data;
            NSError* error;
            NSDictionary* json = [NSJSONSerialization JSONObjectWithData:data
                                                                 options:kNilOptions
                                                                   error:&error];
            self.title.text = [json objectForKey:@"title"];
        }
    }
    ```
`ATLMimeTypeCustomObject` is defined in the next step.

## Configure ConversationViewController

1. Define the custom cell and mimetype constants

    ```objective-c
    static NSString *const ATLMIMETypeCustomObjectReuseIdentifier = @"ATLMIMETypeCustomObjectReuseIdentifier";
    NSString *const ATLMimeTypeCustomObject = @"application/json+starobject";
    NSString *const ATLMimeTypeCustomCellInfo = @"application/json+starcellinfo";
    ```

2. In `viewDidLoad`, use a custom image for the right accessory button
    ```objective-c
        // Change right accessory button to a star
        self.messageInputToolbar.rightAccessoryImage = [UIImage imageNamed:@"star.png"];
    ```

3. In `viewDidLoad`, register a custom cell class. This tells the view controller that there's a custom cell that could be used.
    ```objective-c
        // Register custom cell class for star cell
        [self registerClass:[StarCollectionViewCell class] forMessageCellWithReuseIdentifier:ATLMIMETypeCustomObjectReuseIdentifier];
    ```

4. Implement the `messagesForMediaAttachments` datasource method. `messagesForMediaAttachments` is the method that gets called when you press the right accessory button before it sends the message.  This is where you can configure the `LYRMessages` that get sent. In this example, we will create a message with 2 message parts with JSON blocks containing information to be displayed in the cell and information about the cell itself.

    ```objective-c
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

5. Implement the `reuseIdentifierForMessage` datasource method. This is where we tell Atlas to use the custom cell when the message contains the custom mimetype.

    ```objective-c
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

6. Implement the `heightForMessage` datasource method. The custom cell has a custom height that's store in the MessagePart of the Message.

    ```objective-c
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

Implement the `lastMessageTextForConversation` datasource method. This will the configure the message inside `conversationListViewController` to show some custom text if the last message contained the custom mimetype:
```objective-c
- (NSString *)conversationListViewController:(ATLConversationListViewController *)conversationListViewController lastMessageTextForConversation:(LYRConversation *)conversation {
    LYRMessagePart *part = conversation.lastMessage.parts[0];

    if([part.MIMEType  isEqual: ATLMimeTypeCustomObject])
    {
        return @"Custom Star Message";
    }
    return nil;
}
```