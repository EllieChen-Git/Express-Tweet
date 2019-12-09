# [Challenge] 1209 Express MVC & MongoDB
---
### Morning Challenge: https://coderacademy.instructure.com/courses/239/pages/express-mvc-and-mongodb?module_item_id=9456

##### Core:
* ##### Create an Express web server that is able to handle a full CRUD (create, read, update, delete) resource named Tweet
* ##### Do not add any html, this will be an API that only responds back in JSON

##### Advanced:
* ##### Track this resource inside of a MongoDB database
---
### Initial Setting

- Create a directory for this project (can be named anything)
```
$ mkdir express-server-CRUD
```

- Use 'npm init' to create package.json file. 
- Use '-y' at the end to save time on pressing enter.

```
$ npm init -y
```

- Create a .gitignore file in root directory
```
$ touch .gitignore
```
- Write node_modules inside the file as we don't wanna push our node modules to GitHub 
```
node_modules
```

- Install dependency (production and development)
1. Express - Node web server framework to make routing easier and adds a bunch more functionality.
2. Body-parser - Middleware used to change the data on the request from a steam into usable data available at response.body
3. [Optional] Express-handlebar - JavaScript templating engine for serving up our html web pages

```
$ npm install --save express body-parser express-handlebars
```
- You can install several dependencies at the same time
- (After npm 5, you can skip '--save') Refer here for more details about the npm install command: https://stackoverflow.com/questions/19578796/what-is-the-save-option-for-npm-install

- Install development dependency
1. Nodemon - Watches for changes in our JS file and auto restarts our server when it detects them. (Saves us from manually stopping and starting the server).
2. Forever - Makes sure that if the server crashes it will automatically restart

```
$ npm install --save-dev nodemon forever
```

- Create our own npm run script in package.json
- [Optional] Also remember to change your app entry point to 'app.js', as we are creating an 'app.js' file here. By default, the entry point is 'index.js'. You can keep the default name, but remember to name your file as 'index.js'.

```
touch app.js
```

```javascript

"main": "app.js",

 "scripts": {
    "dev": "forever -c \"nodemon --exitcrash -L\" app.js"
  },
```

- After that, we can run our npm script with the following command
```
npm run dev
```
---

### Create Express Server

1. Create basics commands and routes in 'app.js'
2. [Optional] Work on 'views' - 'layouts'/'tweets' (handlebars)
<!-- 3. Separate routes into 'routes.js' -->
