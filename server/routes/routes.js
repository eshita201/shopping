const express=require('express')
const controller=require('../controller/controller')
const product_controller=require('../controller/product_controller')
const auth=require('../middleware/auth')
const services=require('../services/render')
const routes = express.Router()
const axios = require('axios')
const Products = require('../model/product_model');
const multerInstance = require('../config/multer_file');
/////////////////////////////////////////////////////////////////////////////////////////////

const session = require('express-session')
const { render } = require('ejs')
routes.use(session({secret: process.env.sessionSecret}))
///////////////////////////////Session Management /////////////////////////////////////////
routes.get('/',(req,res)=>{res.render('login')})
routes.get('/login',auth.isLogOut,(req,res)=>{res.render('login')})
routes.get('/register',auth.isLogOut,(req,res)=>{res.render('register')})
routes.get('/index',auth.isLogin,controller.find)
routes.get('/changepassword',auth.isLogOut,(req,res)=>{res.render('changepassword')})

routes.post('/login', controller.login )
routes.post('/register', controller.register )
routes.get('/logout',auth.isLogin, controller.logout )
routes.post('/changepassword', controller.changepassword )
//routes.get('/uploadimage', controller.changepassword )
//////////////////////////////////////Session Management /////////////////////////////////////////

//////////////////////////////////////Product Management /////////////////////////////////////////
routes.get('/AddProduct',auth.isLogin,(req,res)=>{res.render('AddProduct', { 
    user_id: req.session.user_id ,user_adminCheck: req.session.user_adminCheck, user_email: req.session.user_email   })})


routes.post('/AddProduct',multerInstance.upload.single('image'),(req,res) =>{
           // console.log(req.body.Name ,req.body.Price ,  req.body.Category,req.file.filename )
            console.log("Reached inside Add Product Function " , req.file.path , " ");      
    
            const product =new Products({
                Name: req.body.Name,
                Price: req.body.Price,
                Category: req.body.Category,
                Image: req.file.path
            });

            
        if(!req.body){
                console.log("Reached inside Add Product  Function 18");
                res.status(400).send({ message : "Content can not be emtpy!"});
                return;
            }
            product.save().then(product=>{
                res.redirect('/AllProduct');
            })
            .catch(err=>{
                res.json({
                    message: err.message || "Some error occurred while adding the product"
                })
            })
})







routes.get('/AllProduct',auth.isLogin,services.all_product)
routes.get('/api/products',product_controller.find);
routes.get('/UpdateProduct',auth.isLogin,services.update_product)
routes.put('/api/products/:id',product_controller.update);
routes.delete('/api/products/:id', product_controller.delete);
//routes.get('/AddProductstoCart',auth.isLogin, services.AddProductstoCart);
routes.post('/api/producttocart/:id',product_controller.AddProductstoCart);
routes.get('/GotoCart',product_controller.GotoCart);
routes.get('/displayCart',(req,res)=>{res.render('DisplayCart')});


/////////////////////////////Product Management ////////////////////////////////////////////////


module.exports = routes

