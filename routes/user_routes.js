const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user_controller");

//Get route to show all users
router.get("/", UserController.index)

//Post route to create new users
router.post("/", UserController.create)

//Get route for 'create form'
router.get("/new", UserController.newResource)

//Get route to show a user
router.get("/:id", UserController.show)

//Delete route to delete a user
router.delete("/:id", UserController.destroy)

//Get route for 'edit form'
router.get("/:id/edit", UserController.edit)

//PATCH route to update a user
router.patch("/:id", UserController.update)

//PUT route to update a user
router.put("/:id", UserController.update)

module.exports = router;