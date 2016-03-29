# Installation

The Layer Web SDK is built as a UMD module that can be loaded via NPM, CDN or directly from github.

#### CDN

Simplest approach to install the Web SDK is to add the following script tag:

```html
<script src='//cdn.layer.com/sdk/1.0/layer-websdk.min.js'></script>
```

* For stricter code control, use `//cdn.layer.com/sdk/1.0.0/layer-websdk.min.js` instead.

All classes can then be accessed via the `layer` namespace:

```javascript
var client = new layer.Client({
    appId: "%%C-INLINE-APPID%%"
});
```

#### NPM

```console
npm install layer-websdk --save
```

All classes can then be accessed via the `layer` module:

```javascript
var layer = require('layer-websdk');

var client = new layer.Client({
    appId: "%%C-INLINE-APPID%%"
});
```

#### From source

Download the latest SDK release [Source code](https://github.com/layerhq/layer-websdk/releases/latest) archive, extract the files and run the following commands from the extracted project folder:

```console
npm install
grunt build
```

The build command will generate a `build` folder that contains `client.min.js`.

Other grunt commands:

* `grunt debug`: Generates `build/client.debug.js` which provides source-mapped files if you need to step through the Web SDK.
* `grunt docs`: Generates the `docs` folder with the API documentation.
* `grunt test`: Run the unit tests
