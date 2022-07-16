const mongoose=require('mongoose')




var cartSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
      //  min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        required: true
    },
    
    userid: {
        type:String
    },
    useremail: {
        type:String
    },
    productImage:
    {
        type:String
    }
})

const Cart = mongoose.model('cart',cartSchema);
module.exports=Cart