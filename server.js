const express = require('express');
const bodyparser = require('body-parser');
const dotenv =require('dotenv');
const path = require('path');
const app=express();
const connectDB =require('./server/database/connection')
const axios = require('axios')
const Razorpay = require('razorpay');
var mongoose = require('mongoose');
const expressLayouts= require('express-ejs-layouts');
const expressEjsLayouts = require('express-ejs-layouts');
app.use(expressEjsLayouts)
app.use(require("express-session")({
    secret: "ShopClose",
    resave: true,
    saveUninitialized: true
}));
app.use(bodyparser.urlencoded({extended: true}))
dotenv.config({path : 'config.env' })
const PORT = process.env.PORT || 8080
app.set("view engine","ejs")
app.use('/files', express.static("files"));
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/',require(path.resolve(__dirname,'server/routes/routes')))
//app.use('/checkout',require(path.resolve(__dirname,'server/routes/razorpay')))
connectDB();
app.listen(PORT,()=>{console.log(`App is running on  http://localhost:${PORT} `)})


