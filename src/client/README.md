# Closed Caption Editor

TODO: add project description

## Build Steps

First run `npm i` to install project dependencies.

For development, run `npm start` to start webpack in watch mode.

For production, run `npm run build` to create the bundle.

load index.html into your browser to see the site.

## Testing

Run `npm test` to run the tests.

This will automatically run any tests defined in any .js file within the `src/tests` directory.

The convention will be to name each test file with the same name as the file it is testing.

## Structure

The `src` directory contains the application code.

The `bin` direcetory contains the compiled "bundle" file.

`src/index.js` is the application's root file. This is where routes are defined and views are mounted.

`src/models` contains the data model objects.

`src/views` contains the various views/screens.

`src/tests` contains the test files.
