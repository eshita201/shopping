const mongoose = require('mongoose')
const connectDB = async=> { 
    const con = mongoose.connect(process.env.MONGO_URI,err=>{
        if(err) throw err;
        console.log('Connection to shopping database is successful')
    });
}
module.exports= connectDB