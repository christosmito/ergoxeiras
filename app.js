const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session); //Storin sessions on the database
const csrf = require("csurf"); //csrf protection
const flash = require("connect-flash");
const multer = require("multer"); //Parsing not only text but binary files such as files
const dotenv = require("dotenv");
const helmet = require("helmet");//Middleware for secure headers 
const compression = require("compression");

const mainRouter = require("./routes/mainRouter");
const adminRouter = require("./routes/adminRouter");
const errorController = require("./controllers/404Controller");

const app = express();
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // if(file.mimetype === "images/png" || file.mimetype === "images/jpeg" || file.mimetype === "images/jpg" ) {
    //     cb(null, true);
    // }else {
    //     cb(null, false);
    // }
    cb(null, true);
}
dotenv.config({path: "./config.env"});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(session({secret: "this is my superstrong secret value", 
                 resave: false, 
                 saveUninitialized: false,
                 store: new MongoStore({ mongooseConnection: mongoose.connection }) 
}));
// both middlewares must initialized after session initialization
app.use(csrfProtection);
app.use(flash());
app.use(helmet());
app.use(compression());

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-rx7oj.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true });

//middleware to provide csrf token on req.locals
app.use((req, res, next) => {
    res.locals.csrf = req.csrfToken();
    next();
});

//Routes
app.use(mainRouter);
app.use("/admin",adminRouter);

//404 Error
app.use(errorController.get404);

app.listen(process.env.PORT || 3000);