// let express = require('express');
// let router = express.Router();
// let adminRegister = require('../../models/admin.model');

// router.get('/registeradmin', (req, res) => {
//     return res.render("admin/registeradmin");
// });

// router.post('/registeradmin', async (req, res) => {
//     let data = req.body;

//     let register = new adminRegister();

//     register.name = data.name;
//     register.email = data.email;
//     register.password = data.password;
//     register.isAdmin = "admin";
    
//     await register.save();
//     return res.redirect('/loginadmin');
// });

// module.exports = router;