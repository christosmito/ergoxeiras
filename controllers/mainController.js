const Images = require("../models/image");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: ""
    }
}))

exports.getIndex = (req, res, next) => {

    Images.find()
    .then( images => {
        res.render("index", {
            pageTitle: "Εργοχειρας",
            isLoggedIn: req.session.isLoggedIn,
            error: req.flash("error"),
            images: images
        });
    })

};

exports.postSendEmail = (req, res, next) => {
    const name = req.body.name
    const last = req.body.last
    const email = req.body.email
    const message = req.body.message
    const error = validationResult(req);

    if(!error.isEmpty()) {
        req.flash("error", error.array()); //error.array extracts the array from validationResult's(req) Result object
        return res.redirect("/");
    }

    transporter.sendMail({
        to: "christosglx@hotmail.com",
        from: email,
        subject: `${name} ${last} ergoxeiras`,
        html: message
    })

    res.render("index", {
        pageTitle: "Εργοχειρας",
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.getCategories = (req, res, next) => {
    const category = req.params.category;

    Images.find({category: category})
    .then( images => {
        res.render("categories", {
            pageTitle: category,
            isLoggedIn: req.session.isLoggedIn,
            error: req.flash("error"),
            images: images
        });
    })

    // Image.find({category: category})
    // .then(images => {
    //     res.render("/categories/:category")
    // })
};
