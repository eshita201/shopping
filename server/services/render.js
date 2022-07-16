const axios = require('axios');


exports.update_product =    (req, res) =>{
    axios.get(process.env.siteUrl+'/api/products', { params : { id : req.query.id }})
        .then(function(productData){
           
            res.render("UpdateProduct", { Product : productData.data})
        })
        .catch(err =>{
            res.send(err);
        })

}
exports.all_product = (req,res)=>{
        axios.get(process.env.siteUrl+'/api/products')
            .then(function(productData){
                res.render("AllProduct", { Products : productData.data})
            })
            .catch(err =>{
                res.send(err);
            })
}
exports.AddProductstoCart = (req,res)=>{
    axios.get(process.env.siteUrl+'/api/producttocart', { params : { id : req.query.id }})
        .then(function(cart){
           
            res.render("AddtoCart", {cart : cart.data , user_id: req.session.user_id,
                user_email: req.session.user_email})
        })
        .catch(err =>{
            console.log("errored out here")
            res.send(err);
        })
}
