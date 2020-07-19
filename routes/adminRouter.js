const express = require("express");
const { check, body } = require("express-validator");
 
const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/", isAuth, adminController.getAdmin);

router.get("/create-user", adminController.getCreateUser);
router.post("/create-user", 
    [check("email").isEmail().withMessage("Παρακαλω βαλτε εγκυρο μειλ"),
     body("password").isLength({min: 8}).withMessage("Ο κωδικος πρεπει να ειναι τουλαχιστον 8 χαρακτηρες"),
     body("confirmPassword").custom( (value, { req }) => {
         if(value !== req.body.password) {
             throw new Error("Kωδικος και επιβεβαιωση κωδικου δεν ταιριαζουν");
         }
         return true; //we return value = true, else we get invalid value message when we flash errors
     } )], 
    adminController.postCreateUser);

router.get("/login", adminController.getLogin);
router.post("/login", 
[check("email").isEmail().withMessage("Παρακαλω βαλτε εγκυρο μειλ"),
 body("password").isLength({min: 8}).withMessage("Ο κωδικος πρεπει να ειναι τουλαχιστον 8 χαρακτηρες")],
 adminController.postLogin);

router.get("/logout", adminController.getLogout);

router.get("/admin", isAuth, adminController.getAddProject);
router.post("/admin", adminController.postAddProject);


module.exports = router;