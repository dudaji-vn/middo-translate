# 🗄️ Project Structure

Most of the code lives in the `src` folder and looks like this:

```sh
src
|
+-- app               #  Contains all the routes, api, global styles, ect.
|
+-- components        # shared components used across the entire application
|
+-- configs           # all the global configuration, env variables etc. get exported from here and used in the app
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # re-exporting different libraries pre configured for the application
|
+-- providers         # all of the application providers
|
+-- services          # all of the application services like api, analytics, ect.
|
+-- stores            # global state stores
|
+-- types             # base types used across the application
|
+-- utils             # shared utility functions
```
