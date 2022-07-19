const Products = require('../model/product_model');
const Cart = require('../model/Cart');
const User = require('../model/model');
const axios = require('axios')
const Razorpay = require('razorpay');

exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

    Products.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                   res.send(data)     
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Products.find()
            .then(product => {

                res.send(product)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}


exports.update = (req, res)=>{


    console.log('Reached here to update from id')
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    console.log(req.params.id)
    Products.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update product with ${id}. Maybe product not found!`})
            }else{
     
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update product information"})
        })
}


exports.delete = (req, res)=>{
    const id = req.params.id;

    Products.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Product was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });

        
       

}
exports.AddProductstoCart = async(req,res)=>
        {
            console.log("Reached inside Add Product to cart Function ");
            console.log('Add to cart function');
            const _id = req.params.id;
           
           
            const products = await Products.findOne({_id}).lean()
            console.log("Prodcut is =>  ", products._id , "  ", products.Price  , " ", req.session.user_id);
          
            const email = req.session.user_email
            
            const finduser = await User.findOne({email}).lean()

         
            const cart = new Cart({
                productId: products._id,
                productName: products.Name,
                quantity: 1,
                price: products.Price,
                userid:  req.session.user_id,
                useremail: req.session.user_email,
                productImage: products.Image,
                paymentStatus: 'Unpaid',
                orderId: 'Blank',
                Deliverystatus: 'Undelivered'
            });
            const user_id= req.session.user_id;
            const totals = products.Price+ finduser.totalAmount;
            User.findByIdAndUpdate(user_id, { 
                totalAmount: totals }, 
                function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    console.log("Updated User : ", docs);
                }
            });

            cart.save().then(data=>{
                res.send({
                    message : "Product was added to cart successfully!"
                })
             
             //  message : "Product was added to cart successfully!"
            })
            .catch(err=>{
                res.json({
                    message: err.message || "Some error occurred while adding the product"
                 })
            })
        }

exports.GotoCart = async(req,res)=>{
    console.log('Display cart function',req.session.user_id  );
    const usermail = req.session.user_email;
    const userid = req.session.user_id;
    const email = req.session.user_email;
            
    const finduser = await User.findOne({email}).lean();
    console.log("total amount ", finduser.totalAmount);
    Cart.find(  {"userid" : userid} )
    .then(data =>{
        if(!data){
            res.status(404).send({ message : "Not found Cart with id "+ userid})
        }else{
          res.render('DisplayCart', {cart : data, user_id : req.session.user_id,
            user_email : req.session.user_email,totalamount:finduser.totalAmount } )     
        }
    })
    .catch(err =>{
        res.status(500).send({ message: "Erro retrieving user with id " + userid})
    })

} 

exports.placeorder = async(req,res)=>{
    console.log('Order  function',req.session.user_id  );
    const email = req.session.user_email;
    const finduser = await User.findOne({email}).lean();
    const userid = req.session.user_id;
    const useraddress = finduser.address;
    Cart.find(  {"userid" : userid} )
    .then(data =>{
        if(!data){
            res.status(404).send({ message : "Not found Cart with id "+ userid})
        }else{
          res.render('placeorder', {cart : data, user_id : req.session.user_id,
            user_email : req.session.user_email,totalamount:finduser.totalAmount,
            useraddress: finduser.address} ) 
            
            
        }
    })
    .catch(err =>{
        res.status(500).send({ message: "Erro retrieving user with id " + userid})
    })


}


exports.findorders = async(req, res)=>{
   

      //  console.log("email is :=>", email);
        //"paymentStatus": 'Paid',
        Cart.find({"paymentStatus": 'Paid'})
            .then(cart => {
                res.send(cart)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    

    
}