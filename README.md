# Express Tweets

- Full CRUD resources (create, read, update and delete tweets).
- [Optional] HTML pages with express-handlebars.
- MongoDB database implemented.
- Document database normalising and denormalising (work in progress).
- Jest unit testing.
- Jest integration testing (work in progress).

---

### 1209 Express MVC & MongoDB Morning Challenge: https://coderacademy.instructure.com/courses/239/pages/express-mvc-and-mongodb?module_item_id=9456

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
    "server": "forever -c \"nodemon --exitcrash -L\" app.js"
  },
```

- After that, we can run our npm script with the following command
```
npm run server
```
---

### Core - Basic CRUD (Create new Tweets & Read all tweets)

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
- Create a directory called 'database'
- Inside 'database', create a directory called 'schemas'
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

__5. [G's convention] Create Model in a separate directory__
- Inside 'database', create a directory called 'models'
- Inside 'models', create a file called 'tweet_model.js'

database\models\tweet_model.js
```javascript
const mongoose = require("mongoose");
const TweetSchema = require("./../schemas/tweet_schema");

const TweetModel = mongoose.model("tweet", TweetSchema);
//1st arg: tweet collection, 2nd arg: schema where we wanna create model from

module.exports = TweetModel;
```

__6. Modify controller & update functions to async-await__
- Remember to modify the path to require model in controller
- (Later) Remember to use 'try-catch' to handle errors

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

### Core - Basic CURD (Show, Update & Delete a tweet)

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

__3. Complete the rest of the view__
- Update 'views\tweets\index.handlebars'
- Create 'views\tweets\show.handlebars'
- Create 'views\tweets\edit.handlebars'

---
### Optional - Normalising and Denormalising
https://coderacademyedu.github.io/resources/unit_mongoose_relationships.html



__1. Create a 'routes' directory, move 'routes.js' inside, and rename it to 'index.js'__

routes\index.js
```javascript
const TweetController = require("./../controllers/tweet_controller");
// remember to change the require path here so our app still works
```

__2. Inside a 'routes' directory, create a 'tweet_routes.js' file to separate our routes__

__3. Create a second model to practice normalising and normalising__
```
to do
```

---

### Optional - Jest Testing 

---
### 1213 Jest & BDD - Afternoon Challenge: https://coderacademy.instructure.com/courses/239/pages/jest-and-bdd?module_item_id=9459

##### Core:
##### 1. Write an API (no rendered html only JSON data returned) that creates a full CRUD resource for Pokemon (Note: Decided to continue with my Express-Tweet project instead).
##### 2. Write your integration tests before writing any logic in your controller or routes. 
##### 3. Before moving on to the next endpoint make sure you have a minimum of 70% code coverage.

##### Advanced:
##### Write unit tests for your controllers as well.

##### Expert:
##### Add validation to your endpoints and write passing tests for invalid data.

---

__1. Install Jest__
- Jest: Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

```
npm install jest --save-dev
```
__2. Use Jest as our test runner__
package.json
```
  "scripts": {
        "test": "jest --coverage",
    }
```
__3. Make sure Jest run correctly in Node environment__
- Add a configuration file 'jest.config.js' to the root.
- Write code below in 'jest.config.js'
```
module.exports = {
    testEnvironment: "node",
    verbose: true //Display individual test results with the test suite hierarchy.
};
```
- Make sure you have 'mongod' running before you run the server
```
$ npm run server
```
__4. Unit testing (Jest)__
__4.1 Setting up file structure__
- Create 'tests' directory at root
- Inside 'tests' directory, create a 'unit' directory (to store all of our unit tests).
- Inside 'unit' directory, create a 'controllers' directory (to store all of our unit tests for our controllers).
- Inside 'controllers' directory, create a 'tweet_controller.test.js' file (to store all of our tests for the TweetController)

__4.2 Unit testing - TweetController.index() method__
tweet_controller.test.js
```javascript
    const TweetController = require("./../../../controllers/tweet_controller");
    const TweetModel = require("./../../../database/models/tweet_model");

    describe("TweetController", ()=>{
        describe("index()", ()=>{
            test("calls res.render()", async()=>{
                const res = {
                    render: jest.fn()
                };

                const tweets = [];
                TweetModel.find = jest.fn().mockResolvedValue(tweets);

                await TweetController.index(null, res);
                expect(TweetModel.find).toBeCalledTimes(1);
                expect(res.render).toHaveBeenLastCalledWith("tweets/index", { tweets }); //make sure args were passed to the function.
            })

        });
    });
```
- Passed the TweetController.index() method unit test 
![UnitTesting](./docs/unit-testing.JPG)

__5. Integration Testing (Jest & Supertest)__

__5.1 Setting up file structure__
- Inside 'tests' directory, create a 'integration' directory (to store all of our integration tests).
- Inside 'integration' directory, create a 'tweets' directory (to store all of our integration tests for our tweets).
- Inside 'tweets' directory, create a 'create.test.js' file (to test our route that creates tweets.)

__5.2 Install Supertest__
- Supertest: HTTP assertions made easy via superagent (provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent).
```
npm install supertest --save-dev
```
__5.3 Separate our Express App and Server__
- Create a 'index.js' at root to run our express app and have our 'app.js' to set up our Express app.

index.js
```javascript
//This is now our server


const mongoose = require("mongoose");
const port = 3000;

//Database
mongoose.connect("mongodb://localhost/tweet_app", { 
    useNewUrlParser: true,
    useUnifiedTopology: true //use new Server Discover and Monitoring engine
});
mongoose.Promise = global.Promise;
mongoose.connection.on("error", (error)=> {console.log(error)});


//App.js
const app = require("./app"); //Require our app.js file here

//Port
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
}); 
```

app.js
```javascript
//This is now our Express App

const express = require("express");
const exphbs = require("express-handlebars"); // [handlebars - optional]
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();


// [handlebars - optional]
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Method Override
app.use(methodOverride("_method", { methods: ["POST", "GET"]}));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Routes
app.use(require("./routes"));

//Remember to export app
module.exports = app;
```

- Remember to change your server script (from 'app.js' to 'index.js') in 'package.json'

```javascript
  "scripts": {
    "server": "forever -c \"nodemon --exitcrash -L\" index.js"
  },
```

__5.3 Write our integration test for create a new tweet__

tests\integration\tweets\create.test.js
```javascript
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("./../../../app");  //Require our Express App

//Jest: set up DB connection before the test
beforeAll(()=>{ 
    mongoose.connect("mongodb://localhost/tweet_app", { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    mongoose.Promise = global.Promise;
    mongoose.connection.on("error", (err)=> {console.log(err)});
})

//Jest: close DB connection after the test
afterAll(()=> { 
    mongoose.connection.close();
})

//Our actual test here
describe("User creates a new tweet", ()=>{
    test("POST /tweets with a valid req bodoy", async()=>{
        const response = await supertest(app) //Using supertest to run our app
        .post("/tweets")          //creating post request
        .send({
            username: "testingEllie",
            post: "integration testing"
        })
        .expect(302); //Expect: supertest assertion to check res status code. 

        expect(response.body).toEqual({});
        //Once req is finished, we assert that the res body was empty 
        expect(response.headers.location).toMatch(/^\/tweets\/.*$/);
        //the headers location value was “/tweets/:id” because this route redirects to a single tweet once it has been created.(depends on create func on controller)
    });
});
```

- Passed Integration Test - Create 
![integration-testing](./docs/integration-testing.JPG)

__5.4 (Best Practice) Crate a 'connection.js' file inside 'database' diretory__

database\connection.js
```javascript
const mongoose = require("mongoose");

//Database
async function connect(dbName){
    await mongoose.connect(`mongodb://localhost/${dbName}`, { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    });
    mongoose.Promise = global.Promise;
    mongoose.connection.on("error", (error)=> {console.log(error)});
    return mongoose;
}

module.exports = connect;
```

index.js
```javascript
const dbConnect = require("./database/connection")
dbConnect("tweet_app")

//App.js
const app = require("./app"); //Require our app.js file here

//Port
const port = 3000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
}); 
```

- Still passed both tests
__.__
__.__
__.__

__.__
__.__
__.__
__.__

