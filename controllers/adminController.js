const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const Image = require("../models/image");

exports.getAdmin = (req, res, next) => {
    res.render("administration/admin", {
        pageTitle: "Σελιδα διαχειρησης",
        isLoggedIn: req.session.isLoggedIn
    })
}

exports.getCreateUser = (req, res, next) => {
    res.render("administration/create-user", {
        pageTitle: "Δημιουργια χρηστη",
        isLoggedIn: req.session.isLoggedIn,
        error: req.flash("error")
    })
}

exports.postCreateUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const error = validationResult(req);

    if(!error.isEmpty()) {
        req.flash("error", error.array()); //error.array extracts the array from validationResult's(req) Result object
        return res.redirect("/admin/create-user");
    }

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({email: email, password: hashedPassword});
        user.save().
        then(res.redirect("/"));
    })
}

exports.getLogin = (req, res, next) => {
    let error = req.flash('error');
    if (error.length > 0) { //Prevents of populating an empty error flash message
        error = error[0];
    } else {
        error = null;
    }
    res.render("administration/login", {
        pageTitle: "Συνδεση",
        isLoggedIn: req.session.isLoggedIn,
        error: error
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const error = validationResult(req);

    if(!error.isEmpty()) {
        //req.flash("error", error.array()); //error.array extracts the array from validationResult's(req) Result object
        return res.render("administration/login", {
            pageTitle: "Συνδεση",
            isLoggedIn: req.session.isLoggedIn,
            error: error.array()[0].msg
        })
    }

    User.findOne({email: email})
    .then( user => {
        if(!user) {
            req.flash("error", "Ο χρήστης δεν βρέθηκε στην βάση δεδομένων")
            return res.redirect("/admin/login");
        }

        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(!isMatch) {
                return res.redirect("/admin/login");
            }

            req.session.isLoggedIn = true;
            res.redirect("/admin");
        })
    })
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/");
    })
}

exports.getAddProject = (req, res, next) => {
    res.render("administration/add-project", {
        pageTitle: "Προσθήκη Έργου",
        isLoggedIn: req.session.isLoggedIn,
        error: ""
    })
}

exports.postAddProject = (req, res, next) => {
    const image = req.file;
    const category = req.body.category;
    const description = req.body.description;
    if(!image) {
        res.render("administration/add-project", {
            pageTitle: "Προσθήκη Έργου",
            isLoggedIn: req.session.isLoggedIn,
            error: "Η μορφή εικόνας δεν υποστηρίζεται"
        })
    }

    const imageUrl = image.path;

    const savedImage = new Image({imageUrl: imageUrl, category: category, description: description});
    savedImage.save().
    then(
        res.render("administration/add-project", {
            pageTitle: "Προσθήκη Έργου",
            isLoggedIn: req.session.isLoggedIn,
            error: "Η εικόνα αποθηκεύτηκε"
        })
    )
}