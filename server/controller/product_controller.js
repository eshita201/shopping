const Products = require('../model/product_model');
const Cart = require('../model/cart');
const axios = require('axios')

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
            console.log("Id is =>  ", _id);
           
            const products = await Products.findOne({_id}).lean()
            console.log("Prodcut is =>  ", products._id , "  ", products.Price  , " ", req.session.user_id);
          
          
            const cart = new Cart({
                productId: products._id,
                productName: products.Name,
                quantity: 1,
                price: products.Price,
                userid:  req.session.user_id,
                useremail: req.session.user_email,
                productImage: products.Image
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
    const userid = req.session.user_id;

  
    Cart.find(  {"userid" : userid} )
    .then(data =>{
        if(!data){
            res.status(404).send({ message : "Not found Cart with id "+ userid})
        }else{
          res.render('displayCart', {cart : data, user_id : req.session.user_id,
            user_email : req.session.user_email} )     
        }
    })
    .catch(err =>{
        res.status(500).send({ message: "Erro retrieving user with id " + userid})
    })

} 
