# node-brs

*Wanna write Brickadia save files but the thought of learning Rust makes your joints crumble?*
**Thats ok!** I suffered for you and you can now use this implementation to write Brickadia save files using node.js.

The original implementation is avaliable under [brickadia/brs](https://github.com/brickadia/brs).

## Usage

Firstly, install:
```
npm install --save cheezbarger/node-brs
```

```js
    const brs = require('node-brs');
    // Thats it!
```

All functions and classes come exposed in the default module, classes have predefined default values which are formatted appropriately, change what you need.

The library comes with a prebuilt WebAssembly module so you dont have to build it yourself. Should you want to, run the build command:
```
npm run build
```

### Reading

Reading files is super simple

```js
    const brs = require('./../node-brs');
    const data = brs.readSave('myBuild.brs');
```

### Writing

Writing save files is super easy, first off you need to familiarize yourself with the save format which you can get using ```brs.readSave```, then you can just edit the returned JSON and write your new save.

```js
    const {readSave, writeSave} = require('node-brs');

    const ex = readSave('myBuild.brs');
    ex.description = 'WD40';

    writeSave('myBuild.brs', ex);
```

Want to start from scratch?

```js
    const {writeSave, WriteData} = require('node-brs');

    const save = new WriteData();
    save.description = 'Rust free!';

    writeSave('myBuild.brs', save);
```
