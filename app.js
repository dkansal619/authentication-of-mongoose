require('dotenv').config()

const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption");

const app = express();

// serving the static files we use the below code
app.use(express.static("public"));

// When you set the view engine to EJS using the app.set() method, it tells your Express.js application to use EJS for rendering your views. This means that you can write HTML templates that include EJS syntax, which will be processed by EJS to generate the final HTML output that is sent to the client's browser.
app.set('view engine', 'ejs');

// below code is used for parsing the data when make in available to use in req.body
app.use(express.urlencoded({ extended: true }));


// connection using async and await 
async function main() {
    await mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });
}

// if there is any error while calling the function then print that error on the console
main().catch(err => console.log(err));

// creaing schema --
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

console.log(process.env.SECRET);

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}) ;

//   model creation
const User = mongoose.model("User", userSchema);


app.get("/", function (req, res) {
    res.render("home");
})
app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/register", function (req, res) {
    res.render("register");
})


app.post("/register", function (req, res) {
    // creating a new document based on what we have entered inside the register page
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    // if newUser is saved then render the secrets.ejs otherwise console.log the err which occured while saving document
    newUser.save().then(() => {
        res.render("secrets")
    })
        .catch((err) => {
            console.log(err);
        })
})


app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser.password === password) {
                res.render("secrets")
            }
        })
        .catch((err)=>{
            console.log(err);
        })
})


app.listen(3000, function () {
    console.log("server is running on port 3000");
})