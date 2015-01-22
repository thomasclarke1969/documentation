#Display Messages
The following demonstrates the logic needed to display messages from the last conversation between 2 participants inside a tableview in a View Controller.  The following code heavily relies on the [LYRQueryController](http://developer.layer.com/docs/integration/ios#LYRQueryController).  For a working example, check out the [Quick Start iOS XCode project](https://github.com/layerhq/quick-start-ios).

Initial setup for your View Controller:
```objectivec
//Import the LayerKit headers into your ViewController.h
#import <LayerKit/LayerKit.h>

//The ViewController needs to implements LYRQueryControllerDelegate
@interface ViewController () <UITextViewDelegate, UITableViewDelegate, UITableViewDataSource,LYRQueryControllerDelegate>

//These properties are used within the example.
@property (weak, nonatomic) IBOutlet UITableView *tableView;
@property (nonatomic) LYRClient *layerClient;
@property (nonatomic) LYRConversation *conversation;
@property (nonatomic, retain) LYRQueryController *queryController;

@end

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Fetches all conversations between the authenticated user and the supplied participant    
    [self fetchLayerConversation];
}
```
The following methods fetch the last conversation, and populate the query controller with all the messages from that conversations.
```objectivec
- (void)fetchLayerConversation
{    
    LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
    query.predicate = [LYRPredicate predicateWithProperty:@"participants" operator:LYRPredicateOperatorIsEqualTo value:@[ @"Device", @"Simulator", @"Dashboard" ]];

    query.sortDescriptors = @[ [NSSortDescriptor sortDescriptorWithKey:@"createdAt" ascending:NO] ];
    
    NSError *error;
    NSOrderedSet *conversations = [self.layerClient executeQuery:query error:&error];
    if (!error) {
        NSLog(@"%tu conversations with participants %@", conversations.count, @[ @"<PARTICIPANT>" ]);
    } else {
        NSLog(@"Query failed with error %@", error);
    }
    
    // Retrieve the last conversation
    if (conversations.count) {
        self.conversation = [conversations lastObject];
        NSLog(@"Get last conversation object: %@",self.conversation.identifier);
        // setup query controller with messages from last conversation
        [self setupQueryController];
    }
}

-(void)setupQueryController
{    
    // Query for all the messages in conversation sorted by index
    LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
    query.predicate = [LYRPredicate predicateWithProperty:@"conversation" operator:LYRPredicateOperatorIsEqualTo value:self.conversation];
    query.sortDescriptors = @[ [NSSortDescriptor sortDescriptorWithKey:@"index" ascending:NO]];
    
    // Set up query controller
    self.queryController = [self.layerClient queryControllerWithQuery:query];
    self.queryController.delegate = self;
    
    NSError *error;
    BOOL success = [self.queryController execute:&error];
    if (success) {
        NSLog(@"Query fetched %tu message objects", [self.queryController numberOfObjectsInSection:0]);
    } else {
        NSLog(@"Query failed with error: %@", error);
    }
}
```
The following methods are Query Controller Delegate Methods.  These methods handle all the interaction between Layer and the tableView including automatically adding new messages as they appear.
```objectivec

- (void)queryControllerWillChangeContent:(LYRQueryController *)queryController
{
    [self.tableView beginUpdates];
}

- (void)queryController:(LYRQueryController *)controller
        didChangeObject:(id)object
            atIndexPath:(NSIndexPath *)indexPath
          forChangeType:(LYRQueryControllerChangeType)type
           newIndexPath:(NSIndexPath *)newIndexPath
{
    // Automatically update tableview when there are change events
    switch (type) {
        case LYRQueryControllerChangeTypeInsert:
            [self.tableView insertRowsAtIndexPaths:@[newIndexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            break;
        case LYRQueryControllerChangeTypeUpdate:
            [self.tableView reloadRowsAtIndexPaths:@[indexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            break;
        case LYRQueryControllerChangeTypeMove:
            [self.tableView deleteRowsAtIndexPaths:@[indexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            [self.tableView insertRowsAtIndexPaths:@[newIndexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            break;
        case LYRQueryControllerChangeTypeDelete:
            [self.tableView deleteRowsAtIndexPaths:@[indexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            break;
        default:
            break;
    }
}

- (void)queryControllerDidChangeContent:(LYRQueryController *)queryController
{
    [self.tableView endUpdates];
}

```
The following methods are the Table View Data Source Methods.  These methods handle showing the message content in the table cell.
```objectivec
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    // Return number of objects in queryController
    return [self.queryController numberOfObjectsInSection:section];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *simpleTableIdentifier = @"SimpleTableCell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:simpleTableIdentifier];
    
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:simpleTableIdentifier];
    }
    
    return cell;
}

- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Get Message Object from queryController
    LYRMessage *message = [self.queryController objectAtIndexPath:indexPath];
    
    // Set cell text to "<Sender>: <Message Contents>"
    LYRMessagePart *messagePart = message.parts[0];
    cell.textLabel.text = [NSString stringWithFormat:@"%@:%@",[message sentByUserID], [[NSString alloc] initWithData:messagePart.data encoding:NSUTF8StringEncoding]];
 }
```