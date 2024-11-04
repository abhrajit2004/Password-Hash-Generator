require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/createuser', async (req, res) => {

    const {name, email, password} = req.body;

    let success = false;

    try{
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email already exists" });
        }
        
        const salt = await bcrypt.genSalt(10);

        const secPass = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: secPass
        });

        const data = {
            user:{
                id: user.id
            }
        } 

        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({success, authToken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/login', async (req, res) => {

    const {email, password} = req.body;

    try{
        let user = await User.findOne({email});
        let success = false;
        if (!user) {
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            success = false;
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }

        const data = {
            user:{
                id: user.id
            }
        } 

        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;

        res.json({success, authToken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;