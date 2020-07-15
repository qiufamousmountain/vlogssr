/**
 * Created by saiteluo on 2018/10/9.
 */
const express = require('express');
const router = express.Router();

router.use((req, res,next) => {
   next()

});
module.exports = router;