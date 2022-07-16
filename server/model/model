const mongoose=require('mongoose')

var userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    pass:{
        type: String,
        required: true
    },
    isAdmin : String

})

const Users = mongoose.model('users',userSchema);
module.exports=Users