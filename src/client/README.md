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

## Other stuff

It useful to test out POST requests to the server using curl before implementing the code in the frontend.

Here is an example curl command which takes in a JSON file:

```
curl -vX POST http://127.0.0.1:5000/submit -d @temp.json \
--header "Content-Type: application/json"
```

Where temp.json in this case is a file formatted like so:

```
{
  "caption_format": "CEA_608",
  "scenes_list": [
    {
      "scene_id": 1,
      "start_time": 123,
      "background_color": "blue",
      "position": "blah",
      "opacity": "sure",
      "caption_list": [
        {
          "caption_id": 1337,
          "string_list": ["hello", "world"],
          "color": "magenta",
          "text_alignment": "right",
          "underline": "nope",
          "italics": "sure"
        }
      ]
    }
  ]
}
```

Just change `temp.json` to whatever file you want to point it to.
