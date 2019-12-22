# Express Tweets

---

### Features

- Full CRUD resources (create, read, update and delete tweets and users).
- [Optional] HTML pages with express-handlebars.
- MongoDB database implementation.
- Dynamic Routing.
- Document database normalising (referencing)
- Document database denormalising (embedding).
- Jest unit testing.
- Jest/Supertest integration testing.
- Express session:
  1. Set up Express session and env variables.
  2. Track view counts
  3. User registration validation (with Celebrate).
  4. Store user credentail (with password encryption).
- Authorisation (through customised middleware):
  1. User registration
  2. Logout
  3. Dashboard authorisation)
- Authentication (hardcoding)
  1. Login
  2. Error handler middleware
- Store Express Session data in MongoDB (through 'connect-mongo.')
- Authentication through Middleware (Passport - Local Strategy & JWT Strategy)

---

### 1209 Express MVC & MongoDB Morning Challenge: https://coderacademy.instructure.com/courses/239/pages/express-mvc-and-mongodb?module_item_id=9456

##### Core:

- ##### Create an Express web server that is able to handle a full CRUD (create, read, update, delete) resource named Tweet
- ##### Do not add any html, this will be an API that only responds back in JSON

##### Advanced:

- ##### Track this resource inside of a MongoDB database

---

### Core - Initial Setting

**1. Create a directory for this project (can be named anything)**

```
$ mkdir express-server-CRUD
```

- Use 'npm init' to create package.json file.
- Use '-y' at the end of 'npm init' to save time from pressing enter.

```
$ npm init -y
```

**2. Install dependencies (production and development)**

- **Express** - Node web server framework to make routing easier and adds a bunch more functionality.
- **Body-parser** - Middleware used to change the data on the request from a steam into usable data available at response.body
- [Optional - not required for this challenge] **Express-handlebar** - JavaScript templating engine for serving up our html web pages

```
$ npm install --save express body-parser express-handlebars
```

- You can install several dependencies at the same time.
- (After npm 5, you can skip '--save') Refer here for more details about the npm install commands: https://stackoverflow.com/questions/19578796/what-is-the-save-option-for-npm-install

**3. Install development dependencies**

- **Nodemon** - Watches for changes in our JS file and auto restarts our server when it detects them. (Saves us from manually stopping and starting the server).
- **Forever** - Makes sure that if the server crashes it will automatically restart.

```
$ npm install --save-dev nodemon forever
```

**4. [Important] Create a .gitignore file in root directory**

```
$ touch .gitignore
```

- Write 'node_modules' inside .gitignore, as we don't wanna push our node modules to GitHub

```
node_modules
```

**5. Set up package.json**

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

### Core - Basic CRUD I (Create new Tweets & Read all tweets)

**1. Create basic commands and routes in 'app.js'**
**2. [Optional] Complete Views (layouts/tweets) with handlebars**
**3. Separate routes into 'routes.js'**
**4. Create Controller & move our business logic from routes.js to controllers\tweet_controller.js**

controllers\tweet_controller.js

```javascript
const tweets = [];

function index(req, res) {
  res.render("tweets/index", { tweets }); //{ tweets }: shorthand when an object's key is same as value
}

function create(req, res) {
  const { username, post } = req.body;
  const newTweet = { username, post };

  tweets.push(tweet);
  res.redirect("/tweets");
}

function newResource(req, res) {
  res.render("tweets/form");
}

module.exports = {
  index,
  create,
  newResource
};
```

---

### Advanced - Implement MongoDB

- Mongoose: object data modelling tool

**1. Install Mongoose to connect our app to MongoDB**

```
npm install mongoose --save
```

**2. Add the following code into 'app.js'**

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/tweet_app", { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection.on("error", error => {
  console.log(error);
});
```

**3. Start MongoDB**

- Stop your express server
- Run 'mongod' in a terminal window
- Restart your express server ('npm run dev') in another terminal window

**4. Create Database & Schema**

- Create a directory called 'database'
- Inside 'database', create a directory called 'schemas'
- Inside 'schemas', create a file called 'tweet_schema.js'

database\schemas\tweet_schema.js

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema; //'Schema' is capitalised here as it returns a 'class'

const TweetSchema = new Schema({
  //username: String    shorthand: but we don't use it as we prob need more properties
  username: {
    //longhand
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

**5. [G's convention] Create Model in a separate directory**

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

**6. Modify controller & update functions to async-await**

- Remember to modify the path to require model in controller
- (Later) Remember to use 'try-catch' to handle errors

- controllers\tweet_controller.js [in progress]

```javascript
// const tweets = []; //Replace array with the line below
const TweetModel = require("./../database/models/tweet_model");

// tweets.push(tweet);
// res.redirect("/tweets");   //also replace these two lines with the promise below
TweetModel.create(tweet) //it creates a promise
  .then(() => res.redirect("/tweets"))
  .catch(err => res.status(500).send(`Error: ${err}`));

//Lastly, we turn the promise above into 'async-await'
async function create(req, res) {
  const { username, post } = req.body;
  const newTweet = { username, post };

  try {
    const tweet = await TweetModel.create(newTweet);
    res.redirect("/tweets");
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
}
```

- controllers\tweet_controller.js [completed]

```javascript
const TweetModel = require("./../database/models/tweet_model");

async function index(req, res) {
  const tweets = await TweetModel.find();
  res.render("tweets/index", { tweets }); //{ tweets }: shorthand when an object's key is same as value
}

async function create(req, res) {
  const { username, post } = req.body;
  const newTweet = { username, post };

  try {
    const tweet = await TweetModel.create(newTweet);
    res.redirect("/tweets");
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
}

function newResource(req, res) {
  res.render("tweets/form");
}

module.exports = {
  index,
  create,
  newResource
};
```

---

### Core - Basic CRUD II (Show, Update & Delete a tweet)

**0. Install method-override**

```
npm i method-override
```

- Add the code below to app.js

```javascript
const methodOverride = require("method-override");

app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
```

**1. Add the rest CRUD routes in 'routes.js'**

```javascript
//Get route to show a tweet
router.get("/tweets/:id", TweetController.show);

//Delete route to delete a tweet
router.delete("/tweets/:id", TweetController.destroy);

//Get route for 'edit form'
router.get("/tweets/:id/edit", TweetController.edit);

//PATCH route to update a tweet
router.patch("/tweets/:id", TweetController.update);

//PUT route to update a tweet
router.put("/tweets/:id", TweetController.update);
```

**2. Add async functions in 'tweet_controller.js' & remember to export them**

```javascript
const TweetModel = require("./../database/models/tweet_model");

async function index(req, res) {
  const tweets = await TweetModel.find();
  res.render("tweets/index", { tweets }); //{ tweets }: shorthand when an object's key is same as value
}

async function create(req, res) {
  const { username, post } = req.body;
  const newTweet = await TweetModel.create({ username, post }).catch(err =>
    res.status(500).send(err)
  );

  res.redirect("/tweets");
}

function newResource(req, res) {
  res.render("tweets/new");
}

async function show(req, res) {
  let { id } = req.params;
  let tweet = await TweetModel.findById(id);
  res.render("tweets/show", { tweet });
}

async function destroy(req, res) {
  let { id } = req.body;
  await TweetModel.findByIdAndRemove(id);

  redirect("/tweets");
}

async function edit(req, res) {
  let { id } = req.body;
  let tweet = TweetModel.findById(id);

  res.render("/tweets/edit", { tweet });
}

async function update(req, res) {
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
};
```

**3. Complete the rest of the view**

- Update 'views\tweets\index.handlebars'
- Create 'views\tweets\show.handlebars'
- Create 'views\tweets\edit.handlebars'

---

### Optional - Dynamic Routing

**1. Create a 'routes' directory, move 'routes.js' inside, and rename it to 'index.js'**

routes\index.js

```javascript
const TweetController = require("./../controllers/tweet_controller");
// remember to change the require path here so our app still works
```

**2. Inside a 'routes' directory, create a 'tweet_routes.js' file to separate our routes**

```javascript
const express = require("express");
const router = express.Router();
const TweetController = require("./../controllers/tweet_controller");

//Get route to show all tweets
router.get("/", TweetController.index);

//Post route to create new tweets
router.post("/", TweetController.create);

//Get route for 'create form'
router.get("/new", TweetController.newResource);

//Get route to show a tweet
router.get("/:id", TweetController.show);

//Delete route to delete a tweet
router.delete("/:id", TweetController.destroy);

//Get route for 'edit form'
router.get("/:id/edit", TweetController.edit);

//PATCH route to update a tweet
router.patch("/:id", TweetController.update);

//PUT route to update a tweet
router.put("/:id", TweetController.update);

module.exports = router;
```

---

### Optional - Jest Testing

---

### 1213 Jest & BDD - Afternoon Challenge: https://coderacademy.instructure.com/courses/239/pages/jest-and-bdd?module_item_id=9459

##### Core:

##### 1. Write an API (no rendered html only JSON data returned) that creates a full CRUD resource for Pokemon

(Note: Decided to continue with my Express-Tweet project instead).

##### 2. Write your integration tests before writing any logic in your controller or routes.

##### 3. Before moving on to the next endpoint make sure you have a minimum of 70% code coverage.

##### Advanced:

##### Write unit tests for your controllers as well.

##### Expert:

##### Add validation to your endpoints and write passing tests for invalid data.

---

-Note: Before running any test, make sure your have your ‘mongod’running.

**1. Install Jest**

- Jest: Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

```
npm install jest --save-dev
```

**2. Use Jest as our test runner**
package.json

```
  "scripts": {
        "test": "jest --coverage",
    }
```

**3. Make sure Jest run correctly in Node environment**

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

---

**4. Unit testing (Jest)**
**4.1 Setting up file structure**

- Create 'tests' directory at root
- Inside 'tests' directory, create a 'unit' directory (to store all of our unit tests).
- Inside 'unit' directory, create a 'controllers' directory (to store all of our unit tests for our controllers).
- Inside 'controllers' directory, create a 'tweet_controller.test.js' file (to store all of our tests for the TweetController)

**4.2 Unit testing - TweetController.index() method**
tweet_controller.test.js

```javascript
const TweetController = require("./../../../controllers/tweet_controller");
const TweetModel = require("./../../../database/models/tweet_model");

describe("TweetController", () => {
  describe("index()", () => {
    test("calls res.render()", async () => {
      const res = {
        render: jest.fn()
      };

      const tweets = [];
      TweetModel.find = jest.fn().mockResolvedValue(tweets);

      await TweetController.index(null, res);
      expect(TweetModel.find).toBeCalledTimes(1);
      expect(res.render).toHaveBeenLastCalledWith("tweets/index", { tweets }); //make sure args were passed to the function.
    });
  });
});
```

- Passed the TweetController.index() method unit test (Test 1)
  ![UnitTesting](./docs/unit-testing.JPG)

---

**5. Integration Testing (Jest & Supertest)**

**5.1 Setting up file structure**

- Inside 'tests' directory, create a 'integration' directory (to store all of our integration tests).
- Inside 'integration' directory, create a 'tweets' directory (to store all of our integration tests for our tweets).
- Inside 'tweets' directory, create a 'create.test.js' file (to test our route that creates tweets.)

**5.2 Install Supertest**

- Supertest: HTTP assertions made easy via superagent (provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent).

```
npm install supertest --save-dev
```

**5.3 Separate our Express App and Server**

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
mongoose.connection.on("error", error => {
  console.log(error);
});

//App.js
const app = require("./app"); //Require our app.js file here

//Port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
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

**5.3 Write an integration test - create a new tweet (create.test.js)**

tests\integration\tweets\create.test.js

```javascript
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("./../../../app"); //Require our Express App

//Jest: set up DB connection before the test
beforeAll(() => {
  mongoose.connect("mongodb://localhost/tweet_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.Promise = global.Promise;
  mongoose.connection.on("error", err => {
    console.log(err);
  });
});

//Jest: close DB connection after the test
afterAll(() => {
  mongoose.connection.close();
});

//Our actual test here
describe("User creates a new tweet", () => {
  test("POST /tweets with a valid req bodoy", async () => {
    const response = await supertest(app) //Using supertest to run our app
      .post("/tweets") //creating post request
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

- Passed Integration Test - Create (Test 2) :)
  ![integration-testing-create](./docs/integration-testing-create.JPG)

**5.4 (Optional - Best Practice) Crate a 'connection.js' file inside 'database' diretory**

database\connection.js

```javascript
const mongoose = require("mongoose");

//Database
async function connect(dbName) {
  await mongoose.connect(`mongodb://localhost/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.Promise = global.Promise;
  mongoose.connection.on("error", error => {
    console.log(error);
  });
  return mongoose;
}

module.exports = connect;
```

index.js

```javascript
const dbConnect = require("./database/connection");
dbConnect("tweet_app");

//App.js
const app = require("./app"); //Require our app.js file here

//Port
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

- Still passed both tests :)

**5.5 (Optional - Best Practice) Crate a 'setup.js' file inside 'tests' diretory**

tests\setup.js

```javascript
const dbConnect = require("./../database/connection");

module.exports = (() => {
  let mongoose;

  //Set up DB connection before the test
  beforeAll(async () => {
    mongoose = await dbConnect("tweet_app_test");
  });

  //Close DB connection after the test
  afterAll(async () => {
    await mongoose.connection.close();
  });
})();
```

- Modify tests\integration\tweets\create.test.js accordingly

```javascript
const request = require("supertest");
const app = require("./../../../app"); //Require our Express App
require("./../../setup");

//Our actual test here
describe("User creates a new tweet", () => {
  test("POST /tweets with a valid req bodoy", async () => {
    const response = await request(app) //Using supertest to run our app
      .post("/tweets") //creating post request
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

**5.6 Write an integration test - index (index.test.js)**

- inside 'tests\integration\tweets' directory, add 'index.test.js' file

index.test.js

```javascript
const request = require("supertest");
const app = require("./../../../app");
require("./../../setup");

describe("Received all tweets", () => {
  test("GET /tweets", async () => {
    const response = await request(app)
      .get("/tweets")
      .expect(200);
  });
});
```

- Passed Integration Test - Index (Test 3) :)

![integration-testing-index](./docs/integration-testing-index.JPG)

---

### Optional - Normalising Data (Referencing Documents): Create User Collection & Modify Tweet Collection

**1. Copy all the code from 'Tweet' to 'User', can replace 'tweet' to 'user' accordingly**

- database\models\user_model.js
- routes\user_routes.js (remember to change 'routes\index.js' as well)
- (Note: The only real difference will be in the schema file, the forms and in the controller when saving and updating the data.)

**2. Schema**

**User Schema**

- Move 'username' from 'tweet_schema.js' to 'user_schema.js' and change it to 'name'.
- Also add 'bio' (with default value) and 'gender' (with enum) in 'user_schema.js'

user_schema.js

```javascript
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    enum: ["male", "female", "non binary"],
    default: "non binary"
  }
});
```

**Tweet Schema**

- Remove 'username'
- Add 'user' reference

tweet_schema.js

```javascript
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  post: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});
```

**3. Controller**

**Tweet Controller**

1. Remember to require 'UserModel' here
2. In 'create' and 'update' functions, remember to update 'username' to 'user'
3. Update 'newResource' function with '.select("\_id name")'
4. Update 'show' function with '.populate("user")'

```javascript
const UserModel = require("./../database/models/user_model");

async function create(req, res) {
  let { user, post } = req.body;
  let tweet = await TweetModel.create({ user, post }).catch(err =>
    res.status(500).send(err)
  );
  res.redirect("/tweets");
}

async function newResource(req, res) {
  let users = await UserModel.find().select("_id name");
  res.render("tweets/new", { users });
}

async function show(req, res) {
  let { id } = req.params;
  let tweet = await TweetModel.findById(id).populate("user");
  res.render("tweets/show", { tweet });
}

async function update(req, res) {
  let { user, post } = req.body;
  let { id } = req.params;
  await TweetModel.findByIdAndUpdate(id, { user, post });
  res.redirect(`/tweets/${id}`);
}
```

**User Controller**

- Remember to change 'create' and 'update' functions accordingly, as we just changed our data names to 'name', 'bio', 'gender'
- Remember to update 'newResource' function, and change it to async-await

**4. View**

- Update all files in views\tweets
- Update all files in views\users

---

### Optional - Denormalising (Embedding Documents): Embedding 'Comments' document to 'Tweets'

**1. Create Comment Schema**
database\schemas\comment_schema.js

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = CommentSchema;
```

**2. Embed CommentSchema into TweetSchema**

database\schemas\tweet_schema.js

```javascript
const CommentSchema = require("./comment_schema");
const TweetSchema = new Schema({
  comments: [CommentSchema]
});
```

**3. Create Comment Controller**
controllers\comment_controller.js

```javascript
const TweetModel = require("./../database/models/tweet_model");

async function create(req, res) {
  let { tweetId } = req.params;
  let { body } = req.body;
  let tweet = await TweetModel.findById(tweetId);
  tweet.comments.push({ body });
  await tweet.save();

  res.redirect(`/tweets/${tweetId}`);
}

module.exports = {
  create
};
```

**4. Remember to create Comment Routes & update Tweet routes**
routes\comment_routes.js

```javascript
const express = require("express");
const router = express.Router();
const CommentController = require("./../controllers/comment_controller");

router.post("/:tweetId", CommentController.create);

module.exports = router;
```

**5. Create Comment form & display comments**

views\tweets\show.handlebars

```handlebars
{{!-- Comment Create Form --}}
        <form method="POST" action="/comments/{{tweet._id}}">
            <div>
                <textarea name="body"></textarea>
            </div>
            <input type="submit" value="Add Comments" />
        </form>

{{!-- Display all comments on a Tweet --}}
        <ul>
            {{#each tweet.comments}}
            <li>{{this.body}} - {{this.createAt}}</li>
            {{/each}}
        </ul>

```

---

### Optional - Set up environment variables

**1. Install Dotenv (npm package)**

- Dotenv: a zero-dependency module that loads environment variables from a .env file into process.env. (https://www.npmjs.com/package/dotenv)

```
npm i dotenv
```

**2. Put .env in .gitignore**

**3. Create a file called '.env' at root**
.env

```javascript
DB_HOST=mongodb://localhost/tweet_app
PORT=3000
```

**4. Update 'connection.js'**
database\connection.js

```javascript
const mongoose = require("mongoose");

//Database
// async function connect(dbName){
//     await mongoose.connect(`mongodb://localhost/${dbName}`, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });
//     mongoose.Promise = global.Promise;
//     mongoose.connection.on("error", (error)=> {console.log(error)});
//     return mongoose;
// }

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on("error", console.log);

// module.exports = connect;
```

**5. Update 'index.js'**

```javascript
require("dotenv").config();
// dbConnect("tweet_app")

global.HTTPError = class HTTPError extends Error {
  constructor(statusCode, message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HTTPError);
    }
    this.name = "HTTPError";
    this.statusCode = statusCode;
  }
};

//Port
// const port = 3000;
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
```

**6. Update package.json**
package.json

```javascript
  "scripts": {
    "dev-server": "nodemon index.js",
    "server": "forever -c \"nodemon --exitcrash -L\" index.js"
  },
```

### Optional - Set up Express Session

**1. Install Express Session (npm package)**

- Express-session: Simple session middleware for Express (allows us to save information on the server, instead of locally in the browser or within the database. )

```
npm i express-session
```

**2. Update app.js**
app.js

```javascript
const expressSession = require("express-session");

// Express Session
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60000
    }
  })
);
```

**3. Create SESSION_SECRET in .env**

.env

```javascript
SESSION_SECRET=(name it anthing you like)
```

**4. Use express session to track page view counts**

- Update routes for Page Controller
  routes\index.js

```javascript
const PageController = require("./../controllers/page_controller");
router.get("/", PageController.index);
```

- Create Page Controller
  controllers\page_controller.js

```javascript
function index(req, res) {
  req.session.views = req.session.views ? req.session.views + 1 : 1;
  res.send(
    `Welcome to Express Tweets! You have viewed this page ${req.session.views} time(s)`
  );
}

module.exports = {
  index
};
```

**5. Store user credentials**

- Update User Schema: destructing Schema and add 'email' & 'password'

```javascript
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const { Schema } = require("mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String
    // required: true   //need to comment out this as we don't need it when registering user
  }
});
```

- Install 'Celebrate' (npm package): A joi validation middleware for Express
  (https://www.npmjs.com/package/celebrate)

```
npm i celebrate
```

- Update routes for Authentication Controller

routes\index.js

```javascript
const AuthenticationController = require("./../controllers/authentication_controller");
const { celebrate, Joi, Segments } = require("celebrate");

// Page Routes
router.get("/dashboard", PageController.dashboard);

// Authentication Routes
router.get("/register", AuthenticationController.registerNew);

router.post(
  "/register",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }),
  AuthenticationController.registerCreate
);
```

- Create Authentication Controller
  controllers\authentication_controller.js

```javascript
const UserModel = require("./../database/models/user_model");

function registerNew(req, res) {
  res.render("authentication/register");
}

async function registerCreate(req, res) {
  const { email, password } = req.body;
  const user = await UserModel.create({ email, password });
  req.session.user = user;
  // res.redirect("/dashboard");
  // res.render("users/edit", { user }) //Can achieve the same result with .render
  res.redirect(`/users/${user._id}/edit`);
}

module.exports = {
  registerNew,
  registerCreate
};
```

- (Check the code in our User Model - nothing changed in this case)

- Inside 'views' directory, create 'authentication' directory
- Inside 'authentication' directory, create 'register.handlebars'
  views\authentication\register.handlebars

```javascript
<h1>Register</h1>

<form method="POST" action="/register">
    <div>
        <label>Email</label>
        <input type="text" name="email">
    </div>
    <div>
        <label>Password</label>
        <input type="password" name="password" />
    </div>
    <div>
        <input type="submit" value="Register" />
    </div>
</form>
```

- Update Page Controller
  controllers\page_controller.js

```javascript
function dashboard(req, res) {
  res.send("Welcome to Your Dashboard!");
}
```

**6. Encrypt User Password**

- Mongoose Bycrpt: Mongoose plugin encrypting field(s) with bcrypt and providing methods to encrypt and verify.

- Install Mongoose Bycrypt

```
npm install mongoose-bcrypt --save
```

- Update user schema
  database\schemas\user_schema.js

```javascript
    password: {
        type: String,
        required: true,
        trim: true,
        bcrypt: true
    },

    UserSchema.plugin(require("mongoose-bcrypt"));
```

---

### Optional - Authorisation

- When users are logged in, they shouldn't be able to go to the '/register' route. (Instead, users should be re-directed to '/dashboard' if they try to hit '/register' route when logged in.)

**1. Create our customised middleware for this**

middleware\authorisation_middleware.js

```javascript
function authRedirect(req, res, next) {
  //check if there's a session & there's a user property on the session
  if (req.session && req.session.user) {
    return res.redirect("/dashboard");
  }

  return next();
}

module.exports = {
  authRedirect
};
```

**2. Require our customised middleware in routes**

routes\index.js

```javascript
const { authRedirect } = require("./../middleware/authorisation_middleware");
//Destructuring function from the middleware file

// Authentication Routes
router.get("/register", authRedirect, AuthenticationController.registerNew);
```

**3. Create Log out function**

controllers\authentication_controller.js

```javascript
function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = {
  logout
};
```

controllers\page_controller.js

```javascript
function dashboard(req, res) {
  const email = req.session.user.email;
  res.render("pages/dashboard", { email });
}
```

views\pages\dashboard.handlebars

```javascript
<h1>Welcome to Your Dashboard</h1>

<div>
    <a href="/logout">Log out</a>
</div>
```

routes\index.js

```javascript
router.get("/logout", AuthenticationController.logout);
```

**4. Dashboard Authorisation**

- If users are not logged in, they can't proceed to dashboard (Instead, they will be redirected to landing page.)

middleware\authorisation_middleware.js

```javascript
function authRedirect(req, res, next) {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  return next();
}

function authorise(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.redirect("/");
}

module.exports = {
  authRedirect,
  authorise
};
```

routes\index.js

```javascript
const {
  authRedirect,
  authorise
} = require("./../middleware/authorisation_middleware");
router.get("/dashboard", authorise, PageController.dashboard); //Dashboard
```

---

### Optional - Authentication

**1. Login Functionality (also add error handler middleware here)**

- Need to create the login form, the two routes necessary to login and the controller methods attached to those routes

views\authentication\login.handlebars

```javascript
<h1>Log In</h1>

{{!-- Error message for invalid log in --}}
{{#if error }}
    <p>Error: {{error}}</p>
{{/if}}

{{!-- Log in form --}}
<form method="POST" action="/login">
    <div>
        <label>Email</label>
        <input type="text" name="email" />
    </div>
     <div>
        <label>Password</label>
        <input type="password" name="password" />
    </div>
    <div>
        <input type="submit" value="Log In">
    </div>
</form>
```

controllers\authentication_controller.js

```javascript
function loginNew(req, res) {
  res.render("authentication/login");
}

async function loginCreate(req, res) {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  //If user not existed in db, render login page with error message
  if (!user) {
    return res.render("authentication/login", {
      error: "Invalid email & password"
    });
  }

  //If invalid password, render login page with error message
  const valid = await user.verifyPassword(password);
  //verifyPassword: method from Mongoose-bcrypt
  if (!valid) {
    return res.render("authentication/login", {
      error: "Invalid email & password"
    });
  }

  //If there's user & valid password, redirect to dashboard
  req.session.user = user;
  res.redirect("/dashboard");
}

module.exports = {
  loginNew,
  loginCreate
};
```

routes\index.js

```javascript
router.get("/login", authRedirect, AuthenticationController.loginNew);

router.post(
  "/login",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }),
  AuthenticationController.loginCreate
);
```

- [Optional] Also add our customised error middleware here to handle error messages

middleware\error_handler_middleware.js

```javascript
module.exports = function(err, req, res, next) {
  if (err && err.name === "HTTPError") {
    return res.status(err.statusCode).send(err.message);
  }

  return next(err);
};
```

- Remember to require error handler in app.js
  app.js

```javascript
//Error Handler Middleware
app.use(require("./middleware/error_handler_middleware"));
```

---

### Optional - Save Express Session Data in MongoDB

**1. Install connect-mongo**

```
npm install connect-mongo --save
```

**2. Update app.js**

app.js

```javascript
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60000
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
```

---

### Optional - Authentication through Middleware (Passport - Local Strategy)

**- Passport**

- Passport: Passport is Express-compatible authentication middleware for Node.js.
- Passport Strategies: http://www.passportjs.org/packages/
- NPM: https://www.npmjs.com/package/passport

```
npm install passport --save
```

- Local strategy: Passport-local uses a username and password for authentication
- NPM: http://www.passportjs.org/packages/passport-local/

```
npm install passport-local --save
```

**1. Create new directory 'config' to store our passport configuration**

config\passport.js

```javascript
const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./../database/models/user_model");

//serializeUser: stores info inside of our session relating to the passport user.
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//deserializeUser(): gives us access to the info stored within the passport.user property of our session and allows us to return back data from the database that will be appended to req.user.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//LocalStrategy: 1st arg configuration object 'usernameField:', 2nd  callback function' async (email, password, done)'
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      const user = await UserModel.findOne({ email }).catch(done);

      if (!user || !user.verifyPasswordSync(password)) {
        return done(null, false);
      }

      return done(null, user);
    }
  )
);

module.exports = passport;
```

**2. Connect Passport to Our app**
app.js

```javascript
const passport = require("./config/passport");

//Passport (after express session, but before routes)
app.use(passport.initialize()); //use Passport as middleware
app.use(passport.session()); //when we want passport to keep track of our logged in user
```

**3. Use Passport in Routes (modify 'user login - post')**
routes\index.js

```javascript
const passport = require("passport");

// User Login
router.post(
  "/login",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }),
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
  })
);

// router.get("/dashboard", authorise, PageController.dashboard); //Turn off 'authorise' to make code work
router.get("/dashboard", PageController.dashboard); //Dashboard
```

**4. Update Our Validation Middleware (authorisation_middleware.js)**
middleware\authorisation_middleware.js

```javascript
function authRedirect(req, res, next) {
  if (req.user) {
    return res.redirect("/register");
  }
  return next();
}

//Turn off 'authorise' to make code work
// function authorise(req, res, next){
//     if(req.user){
//         return res.redirect("/dashboard");
//         return res.render("pages/dashboard"); //change to render to avoid continuing re-directing
//     }
//     return next();
// }

module.exports = {
  authRedirect
  // authorise
};
```

**5. Update Page Controller**

controllers\page_controller.js

```javascript
function dashboard(req, res) {
  if (req.user) {
    const email = req.user.email;
    res.render("pages/dashboard", { email });
  } else {
    res.redirect("/register");
  }
}
```

**6. Update Authentication Controller**
controllers\authentication_controller.js

```javascript
async function registerCreate(req, res, next) {
  const { email, password } = req.body;
  const user = await UserModel.create({ email, password });

  req.login(user, err => {
    if (err) {
      return next(err);
    }
    // res.redirect("/dashboard")
    res.redirect(`/users/${user._id}/edit`);
  });
}

// async function loginCreate(req, res){
//     const { email, password} = req.body;
//     const user = await UserModel.findOne({ email });

//     //If user not existed in db, render login page with err msg
//     if(!user){
//         return res.render("authentication/login", {error: "Invalid email & password"});
//     }

//      //If password invalid, render login page with err msg
//     const valid = await user.verifyPassword(password);
//     //verifyPassword: method from Mongoose-bcrypt
//     if(!valid){
//         return res.render("authentication/login", {error: "Invalid email & password"})
//     }

//     //If there's user & valid password, redirect to dashboard
//     req.session.user = user;
//     res.redirect("/dashboard")
// }

function logout(req, res) {
  req.logout();
  res.redirect("/");
}

module.exports = {
  // loginCreate
};
```

```
IMPORTANT: After implementing 'passport - local strategy', need to turn off 'authorisation' on 'middleware\authorisation_middleware.js' and 'routes\index.js' to make it work
```

---

### Optional - Authentication through Middleware (Passport - JWT Strategy)

**1. Install Passport JWT Strategy**

```
npm install passport-jwt --save
```

**2. Set Up JWT Strategy**

- config\passport.js

```javascript
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
//pull out Strategy & ExtractJwt & rename Strategy to JwtStrategy

passport.use(
  new LocalStrategy(
    {
      session: false
    },
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwt_payload, done) => {
      const user = await UserModel.findById(jwt_payload.sub).catch(done);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    }
  )
);
```

- .env

```javascript
JWT_SECRET=    //set up your key

```

**3. Modify route to send users the token when they login**
(so they can use this token to authenticate themselves elsewhere in the app)

routes\index.js

```javascript
router.post(
  }),
  passport.authenticate("local", {
    // successRedirect: "/dashboard",
    failureRedirect: "/login",
    session: false //when user logs in, don't use that session
  }),
  AuthenticationController.loginCreate
);
```

**4. Implement Json Web Token to generate JWT for us**

- Install Json Web Token

```
$ npm install jsonwebtoken
```

- Create loginCreate function to generate JWT and send it back to users

controllers\authentication_controller.js

```javascript
const jwt = require("jsonwebtoken");

function loginCreate(req, res) {
  const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET);
  //passport append user to req.user
}

module.exports = {
  loginCreate
};
```

- Modify dashboard route (change the routes authorisation middleware from authorise to JWT)

routes\index.js

```javascript
//Dashboard
router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  PageController.dashboard
);
```

**5. Implement Cookie**

- Set jwt token as a cookie when users login

controllers\authentication_controller.js

```javascript
function loginCreate(req, res) {
  const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET); //passport append user to req.user
  res.cookie("jwt", token); //setting our JWT token as a cookie name JWT.
  res.redirect("/dashboard");
}
```

(Now the only thing left to do is update our extractor function to look for a cookie named jwt.)

- Install Cookie Parser

```
npm install cookie-parser --save
```

- Add Cookie Parser as app level middleware

app.js

```javascript
const cookieParser = require("cookie-parser");

//Cookie Parser: Use it before Body Parser
app.use(cookieParser());
```

(Now that we can easily parse cookies lets update our jwt extractor function.)

- config\passport.js

```javascript
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: req => {
        let token = null; //if you don't find it, passport want a null instead of undefined

        if (req && req.cookies) {
          token = req.cookies["jwt"];
        }

        return token;
      },
```

(The last thing is when we logout the cookie is not being removed.)

- Update logout with cookie
  controllers\authentication_controller.js

```javascript
function logout(req, res) {
  req.logout();
  res.cookie("jwt", null, { maxAge: -1 }); //remove cookies from our browser by setting it expiration date to sometime in the past.
  res.redirect("/");
}
```
