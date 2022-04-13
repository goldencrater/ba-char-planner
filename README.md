# Blue Archive Character Planner

A Character Planner for Blue Archive.

## Project Setup

```sh
npm install
```

### Build Character Data and assets from Original files

The data and asset files for this project aren't included in the source. You'll need to add them to the `orig` directory.

 * The JSON files need to go under `orig/data` eg. `orig/data/Excel`
 * The asset files need to go under `orig/UIs` eg. `orig/UIs/01_Common`

Once the files are in place, build the data files as follows:

```sh
cd bin
node buildCharData.js
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
