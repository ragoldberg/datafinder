const express        = require('express');
const authController = require('../controllers/auth');
const auth           = require("../middleware/auth");


const router = express.Router();




router.post('/registrar', authController.registrar);

router.post('/trial', authController.trial);

router.post('/lgpd', authController.LGPD);

router.post('/login', authController.login);

router.get('/',auth, authController.validar);








module.exports = router;