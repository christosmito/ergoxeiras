const express = require("express");
const { check } = require("express-validator");
 
const mainController = require("../controllers/mainController");

const router = express.Router();

router.get('/', mainController.getIndex);

router.get("/categories/:category", mainController.getCategories);

router.post("/send-email",
            check("name").not().isEmpty().withMessage("Παρακαλω συμπληρωστε το ονομα σας"),
            check("last").not().isEmpty().withMessage("Παρακαλω συμπληρωστε το επιθετο σας"),
            check("email").isEmail().normalizeEmail(),
            check("message").not().isEmpty().withMessage("Παρακαλω συμπληρωστε το μηνυμα σας"),
            mainController.postSendEmail);

module.exports = router;