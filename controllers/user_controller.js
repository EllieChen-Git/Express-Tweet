const UserModel = require("../database/models/user_model")

async function index(req, res) {
    const users = await UserModel.find();
    res.render("users/index", { users }); //{ users }: shorthand when an object's key is same as value
}

async function create(req, res) {
    let { name, bio, gender } = req.body;
    let user = await UserModel.create({ name, bio, gender })
        .catch(err => res.status(500).send(err));

    res.redirect("/users");
    // res.redirect(`/users/${user._id}`);
}

function newResource(req, res){
    res.render("users/new");
}

async function show(req, res){
    let { id } = req.params;
    let user = await UserModel.findById(id);
    res.render("users/show", { user })

}

async function destroy(req, res){
    let { id } = req.params;
    await UserModel.findByIdAndRemove(id);
    res.redirect("/users")
}

async function edit(req, res){
    let { id } = req.params;
    let user = await UserModel.findById(id);
    res.render("users/edit", { user })
}

async function update(req, res){
    let { name, bio, gender } = req.body;
    let { id } = req.params;
    await UserModel.findByIdAndUpdate(id, { name, bio, gender });

    res.redirect(`/users/${id}`);
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