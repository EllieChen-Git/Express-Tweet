# [Challenge] 1209 Express MVC & MongoDB
---
### Morning Challenge: https://coderacademy.instructure.com/courses/239/pages/express-mvc-and-mongodb?module_item_id=9456

##### Core:
* ##### Create an Express web server that is able to handle a full CRUD (create, read, update, delete) resource named Tweet
* ##### Do not add any html, this will be an API that only responds back in JSON

##### Advanced:
* ##### Track this resource inside of a MongoDB database
---
### Core - Initial Setting

__1. Create a directory for this project (can be named anything)__
```
$ mkdir express-server-CRUD
```

- Use 'npm init' to create package.json file. 
- Use '-y' at the end of 'npm init' to save time from pressing enter.

```
$ npm init -y
```

__2. Install dependencies (production and development)__
- __Express__ - Node web server framework to make routing easier and adds a bunch more functionality.
- __Body-parser__ - Middleware used to change the data on the request from a steam into usable data available at response.body
- [Optional - not required for this challenge] __Express-handlebar__ - JavaScript templating engine for serving up our html web pages

```
$ npm install --save express body-parser express-handlebars
```
- You can install several dependencies at the same time.
- (After npm 5, you can skip '--save') Refer here for more details about the npm install commands: https://stackoverflow.com/questions/19578796/what-is-the-save-option-for-npm-install

__3. Install development dependencies__
- __Nodemon__ - Watches for changes in our JS file and auto restarts our server when it detects them. (Saves us from manually stopping and starting the server).
- __Forever__ - Makes sure that if the server crashes it will automatically restart.

```
$ npm install --save-dev nodemon forever
```

__4. [Important] Create a .gitignore file in root directory__
```
$ touch .gitignore
```
- Write 'node_modules' inside .gitignore, as we don't wanna push our node modules to GitHub 
```
node_modules
```

__5. Set up package.json__
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

### Core - Basic CURD (Read all tweets & Create new Tweets)

__1. Create basic commands and routes in 'app.js'__
__2. [Optional] Complete Views (layouts/tweets) with handlebars__
__3. Separate routes into 'routes.js'__
__4. Create Controller & move our business logic from routes.js to controllers\tweet_controller.js__

controllers\tweet_controller.js
```javascript
const tweets = []; 

function index(req, res){
    res.render("tweets/index", { tweets }); //{ tweets }: shorthand when an object's key is same as value
}

function create(req, res) {
    const { username, post } = req.body;
    const newTweet = { username, post };

    tweets.push(tweet);
    res.redirect("/tweets"); 
}

function newResource(req, res){
    res.render("tweets/form");
}

module.exports = {
    index,
    create,
    newResource
}
```
---
### Advanced - Implement MongoDB
- Mongoose: object data modelling tool

__1. Install Mongoose to connect our app to MongoDB__
```
npm install mongoose --save
```

__2. Add the following code into 'app.js'__
```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/tweet_app", { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection.on("error", (error)=> {console.log(error)});
```

__3. Start MongoDB__
- Stop your express server
- Run 'mongod' in a terminal window
- Restart your express server ('npm run dev') in another terminal window

__4. Create Database & Schema__
- Create a folder called 'database'
- Inside 'database', create a folder called 'schemas'
- Inside 'schemas', create a file called 'tweet_schema.js'

database\schemas\tweet_schema.js
```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema; //'Schema' is capitalised here as it returns a 'class'

const TweetSchema = new Schema({
    //username: String    shorthand: but we don't use it as we prob need more properties 
    username: {           //longhand
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    }
});

module.exports = TweetSchema; //schema is not a model: we turn some schemas into models
```

__5. [G's convention] Create Model in a separate folder__
- Inside 'database', create a folder called 'models'
- Inside 'models', create a file called 'tweet_model.js'

database\models\tweet_model.js
```javascript
const mongoose = require("mongoose");
const TweetSchema = require("./../schemas/tweet_schema");

const TweetModel = mongoose.model("tweet", TweetSchema);
//1st arg: tweet collection, 2nd arg: schema where we wanna create model from

module.exports = TweetModel;
```

__6. Modify controller__

- controllers\tweet_controller.js [in progress]
```javascript
// const tweets = []; //Replace array with the line below
const TweetModel = require("./../database/models/tweet_model")


// tweets.push(tweet);
// res.redirect("/tweets");   //also replace these two lines with the promise below
TweetModel.create(tweet) //it creates a promise
    .then(()=> res.redirect("/tweets"))
    .catch((err)=> res.status(500).send(`Error: ${err}`));   


//Lastly, we turn the promise above into 'async-await'
async function create(req, res) {
    const { username, post } = req.body;
    const newTweet = { username, post };

    try {
        const tweet = await TweetModel.create(newTweet);
        res.redirect("/tweets")
    } catch(err) {
        res.status(500).send(`Error: ${err}`)
    }
}
```

- controllers\tweet_controller.js [completed]
```javascript
const TweetModel = require("./../database/models/tweet_model")

async function index(req, res){
    const tweets = await TweetModel.find();
    res.render("tweets/index", { tweets }); //{ tweets }: shorthand when an object's key is same as value
}

async function create(req, res) {
    const { username, post } = req.body;
    const newTweet = { username, post };

    try {
        const tweet = await TweetModel.create(newTweet);
        res.redirect("/tweets")
    } catch(err) {
        res.status(500).send(`Error: ${err}`)
    }
}

function newResource(req, res){
    res.render("tweets/form");
}

module.exports = {
    index,
    create,
    newResource
}
```

---

### Core - Basic CURD (Show a tweet, Update a tweet & Delete tweets)

__0. Install method-override__
```
npm i method-override
```

- Add the code below to app.js
```javascript
const methodOverride = require("method-override")

app.use(methodOverride('_method', { methods: ['POST', 'GET']}));
```

__1. Add the rest CURD routes in 'routes.js'__
```javascript

//Get route to show a tweet
router.get("/tweets/:id", TweetController.show)

//Delete route to delete a tweet
router.delete("/tweets/:id", TweetController.destroy)

//Get route for 'edit form'
router.get("/tweets/:id/edit", TweetController.edit)

//PATCH route to update a tweet
router.patch("/tweets/:id", TweetController.update)

//PUT route to update a tweet
router.put("/tweets/:id", TweetController.update)
```

__2. Add async functions in 'tweet_controller.js' & remember to export them__
```javascript
const TweetModel = require("./../database/models/tweet_model")

async function index(req, res) {
    const tweets = await TweetModel.find();
    res.render("tweets/index", { tweets }); //{ tweets }: shorthand when an object's key is same as value
}

async function create(req, res) {
    const { username, post } = req.body;
    const newTweet = await TweetModel.create({ username, post })
        .catch(err => res.status(500).send(err));

    res.redirect("/tweets");
}

function newResource(req, res){
    res.render("tweets/new");
}

async function show(req, res){
    let { id } = req.params;
    let tweet = await TweetModel.findById(id);
    res.render("tweets/show", { tweet })

}

async function destroy(req, res){
    let { id } = req.body;
    await TweetModel.findByIdAndRemove(id);

    redirect("/tweets")
}

async function edit(req, res){
    let { id } = req.body;
    let tweet = TweetModel.findById(id);

    res.render("/tweets/edit", { tweet })
}

async function update(req, res){
    let { username, post } = req.body;
    let { id } = req.params;
    await TweetModel.findByIdAndUpdate(id, { username, post });

    res.redirect(`/tweets/${id}`);
}

module.exports = {
    index,
    create,
    newResource,
    show,
    destroy,
    edit,
    update
}
```

__3. create the view__
- Update views\tweets\index.handlebars
- Create views\tweets\show.handlebars
- Create views\tweets\edit.handlebars

---
### Optional - Normalising and Denormalisting

__1. Create a 'routes' folder, move 'routes.js' inside, and rename it to 'index.js'__

routes\index.js
```javascript
const TweetController = require("./../controllers/tweet_controller");
// remember to change the require path here so our app still works
```

__2. Inside a 'routes' folder, create a 'tweet_routes.js' file to separate our routes__

__3. Create a second model to practice normalising and normalising__
```
to do
```
