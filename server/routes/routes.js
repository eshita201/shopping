const express=require('express')
const controller=require('../controller/controller')
const product_controller=require('../controller/product_controller')
const auth=require('../middleware/auth')
const services=require('../services/render')
const routes = express.Router()
const axios = require('axios')
const User = require('../model/model');
const Cart = require('../model/Cart');
const Products = require('../model/product_model');
const multerInstance = require('../config/multer_file');
const session = require('express-session')
const { render } = require('ejs')
const Razorpay = require('razorpay');
routes.use(session({secret: process.env.sessionSecret}))
routes.get('/',(req,res)=>{res.render('login')})
routes.get('/login',auth.isLogOut,(req,res)=>{res.render('login')})
routes.get('/register',auth.isLogOut,(req,res)=>{res.render('register')})
routes.get('/index',auth.isLogin,controller.find)
routes.get('/changepassword',auth.isLogOut,(req,res)=>{res.render('changepassword')})
routes.post('/login', controller.login )
routes.post('/register', controller.register )
routes.get('/logout',auth.isLogin, controller.logout )
routes.post('/changepassword', controller.changepassword )
var instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
  });
  routes.get('/Allorders',auth.isLogin,services.all_orders);
  routes.get('/api/orders',product_controller.findorders);
  routes.get('/orders',auth.isLogin,(req,res)=>{res.render('orders')})
routes.get('/AllProduct',auth.isLogin,services.all_product)
routes.get('/api/products',product_controller.find);
routes.get('/UpdateProduct',auth.isLogin,services.update_product)
routes.put('/api/products/:id',product_controller.update);
routes.delete('/api/products/:id', product_controller.delete);
routes.post('/api/producttocart/:id',product_controller.AddProductstoCart);
routes.get('/GotoCart',auth.isLogin,product_controller.GotoCart);
routes.get('/placeorder',auth.isLogin,product_controller.placeorder);
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
routes.get('/checkout',auth.isLogin,(req,res)=>{

    console.log('Reached inside checkout params')
    const amount = req.query.amount;
    console.log(req.query);
    console.log(req.params);
    var options = {
        amount: amount*100,
        currency: 'INR',
    };
    const user_id = req.session.user_id;
    instance.orders.create(options, function (err, order) {
        if (err) {
            console.log(err);
        } else {
            console.log(order);
            res.render('checkout', {amount: order.amount, order_id: order.id,user_id: user_id});
        }
    });

});

routes.post('/checkout/pay-verify',(req,res) => {
    console.log(req.body);
    body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', process.env.key_secret)
                                    .update(body.toString())
                                    .digest('hex');
                                    console.log("sig"+req.body.razorpay_signature);
                                    console.log("sig"+expectedSignature);
    
    if(expectedSignature === req.body.razorpay_signature){
      
        const email = req.session.user_email;
  
        const _id= req.session.user_id;

        User.findByIdAndUpdate(_id, { 
            totalAmount: 0 }, 
            function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated User : ", docs);
            }
        });
        
        Cart.updateMany( {"userid" : _id , "paymentStatus": 'Unpaid'} , {$set: {orderId: req.body.razorpay_order_id} } ,
        function(err, res){
            if (err) throw err;
             console.log( " order Id updated");
          //  db.close();
        });
        Cart.updateMany( {"userid" : _id, "paymentStatus": 'Unpaid'} , {$set: {paymentStatus: 'Paid'} } ,
        function(err, res){
            if (err) throw err;
             console.log( " payment status updated");
           // db.close();
        });

     res.send('Payment Success');
    }else{
      console.log("Payment Fail");
     // res.render('orders');
    }
   
  });



module.exports = routes

