const Users = require('../model/model');
const bcrypt= require('bcryptjs')
const Products = require('../model/product_model');

exports.register = (req,res) =>{
  

    bcrypt.hash(req.body.pass,10,function(err,hashedPass){

        console.log("Reached inside Register Function");
        if(err){
            res.json({ error:err })
        }
        const user =new Users({
            email: req.body.email,
            pass: hashedPass,
            isAdmin: 'N'
        })


        if(!req.body){
            console.log("Reached inside Register Function 17");
            res.status(400).send({ message : "Content can not be emtpy!"});
            return;
        }
        user.save().then(user=>{
             res.redirect('/login');
        })
        .catch(err=>{
            res.json({
                message: err.message || "Some error occurred while registering the user"
            })
        })

    })

}

exports.login = async(req,res) =>{
    
    const email = req.body.email
    const pass = req.body.pass
    const user = await Users.findOne({email}).lean()
    if(user){
        console.log("Email exists")

        if(await bcrypt.compare(pass,user.pass)){
            console.log("User exists") 
            req.session.user_id = user._id;
            req.session.user_adminCheck = user.isAdmin;
            req.session.user_email = user.email;
            res.redirect('index') 
        }else{
        console.log("Email and password is incorrect 2")
        res.render('login',{message:"Email and password is incorrect"})
        }

    }else{
        console.log("Email and password is incorrect 2")
        res.render('login',{message:"Email and password is incorrect"})
    }
}

exports.logout = (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }res.redirect('/login')
    })
} 

exports.changepassword = async (req,res)=>{
    const email = req.body.email
    const pass = req.body.pass
    const user = await Users.findOne({email}).lean()
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
    if(user){
       
        const id= user._id;
        bcrypt.hash(req.body.pass,10,function(err,hashedPass){
        
            req.body.pass=hashedPass
            Users.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
            .then(data => {
                if(!data){
                    res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
                }else{
                    res.redirect('/login')
                    //res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message : "Error Update user information"})
            })
            
        })
    }    
    
}

exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Products.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                   res.send(data)
                   // res.render('AllProduct', { Products : response.data });
                       
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Products.find()
            .then(product => {
                //res.send(product)
                res.render('index',{ Products : product ,   user_email: req.session.user_email ,
                    user_adminCheck: req.session.user_adminCheck  })
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

