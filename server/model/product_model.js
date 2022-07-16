const mongoose=require('mongoose')

var productSchema = mongoose.Schema({
    Name:{
        type: String,
        required: true,
        unique: true
    },
    Price:{
        type: String,
        required: true
    },
    Category:{
        type: String,
        required: true
    },
    Image :{
       
        type: String,
        required: true
    }
})

const Products = mongoose.model('products',productSchema);
module.exports=Products;