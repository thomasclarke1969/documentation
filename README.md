# Layer SDK Documentation

This project is a collection of Markdown files which get rendered to HTML and are displayed in the Layer developer portal, documentation section. It follows simple rules of navigation definition, folder and file naming structure.

## Navigation

File `navigation.yaml` contains the definition of the documentation navigation. Make sure you edit this file when removing or adding new content.

> For more information look at the contents of the navigation file.

### Structure

Each folder here represents a `page`. Each folder contains Markdown files, one markdown file represent a `section` in the page navigation.

If page is defined by `platforms: true` inside the navigation file it must contains platform sub-folders, which then contain Markdown files i.e. `sections`.

## API Reference

Page `api` is treated differently than the rest of the pages. It contains `data.json` file which is a rew JSON data used to generate API Reference page. The data is generated separately by a platform dependend JSON generator. It also contains an `intro.md` which contains an introduction content of the API Reference page.

> You should never need to edit the data.json files manually.

## Markdown

We are using [marked](https://github.com/chjj/marked) parser which supports [basic Markdown syntax](https://help.github.com/articles/markdown-basics) as well as [gfm](https://help.github.com/articles/github-flavored-markdown) syntax.

### Code snippets

1. You define code start section with standard markdown code definition ```
2. Right after ``` you put the code syntax type
3. Put the source code after that and end it with ```

iOS code snippet example:

    ```objectivec
    // Initializes a LYRClient object
    NSUUID *appID = [[NSUUID alloc] initWithUUIDString:@"APP ID"];
    LYRClient *layerClient = [LYRClient clientWithAppID:appID];

    // Tells LYRClient to establish a connection with the Layer service
    [layerClient connectWithCompletion:^(BOOL success, NSError *error) {
        if (success) {
            NSLog(@"Client is Connected!");
        }
    }];
    ```

Android example:

    ```java
     @Override
     // Called when the LayerClient establishes a network connection
     public void onConnectionConnected(LayerClient client) {
         // Ask the LayerClient to authenticate. If no auth credentials are present, 
         // an authentication challenge is issued
         client.authenticate();
     }
    ```
#### Supported syntax types

If you want your code snippet to be syntax highlighted you need to use one of the following types:

* `java` Java
* `objectivec` ObjectiveC
* `json` JSON
* `xml` XML
* `console` Console output or script
* `groovy` Groovy

### Web Components

On top of the "standard" Markdown we are doing some custom parsing which is described below. We have a set of predefined tags that you can use inside markdown file which will render into a certain HTML component. This is a stanalone component that usually takes up the whole page width.

#### Collapsable content

To show a content that is less relevant we can hide it inside a collapsable component which can be expanded by clicking an action at the bottom.

    ```collapse
    This content is going to be hidden...
    ```

#### Emphasis component

To emphasise a paragraph you can use the following syntax.

    ```emphasis
    This is a very important message.
    ```
