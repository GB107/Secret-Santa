const express=require('express')
const path=require('path');
const app=express();
const bodyparser=require('body-parser')
const bcrypt=require('bcrypt')

const port= process.env.PORT || 8000;

require('./db/conn');
const Register= require('./models/register');
const await = require('await');


app.use(express.json());
app.use('/static',express.static('static'));
app.use(express.urlencoded({extended:true}))

app.set('view engine','pug')
app.set('views',path.join(__dirname,"./views"))

app.get('/',(req,res)=>{
    
    res.status(200).render('index');
})
app.get('/sign-up',(req,res)=>{
    
    res.status(200).render('index1');
})
app.get('/sign-in',(req,res)=>{
    
    res.status(200).render('index');
})

app.post("/register",async (req,res) =>{
    try{
            var password = req.body.password;
            var repassword = req.body.repassword;
       if(password==repassword){
        const salt=await bcrypt.genSalt()
        const hashedpassword= await bcrypt.hash(password,salt)
        const hashedrepassword= await bcrypt.hash(repassword,salt)
        const registerUser=new Register({
             firstname:req.body.firstname,
     lastname: req.body.lastname,
     email:req.body.email,
     password :hashedpassword,
     repassword : hashedrepassword,
     mobileno :req.body.mobileno,
        })
const registered= await registerUser.save();
res.status(201).render('home')
       }     
       else{
        res.send("passwords are not matching")
       }
    }catch(error)
    {
        res.status(400).send(error);
    }
})

app.post("/login", async(req,res) =>{
    try{
        var email =req.body.email;
        var password = req.body.password;
            
    const useremail= await Register.findOne({email:email});
    const username= useremail.firstname + " " + useremail.lastname
    const Email=useremail.email
    if(await bcrypt.compare(password,useremail.password)){
        res.status(201).render('main',{
            userName:username,
            Email:Email
        })
    }
else{
    res.send("Invalid username or password");
}
    }
    catch(error){
        res.status(400).send(error);
    }
})


app.get('/logout', (req, res) => {
    res.clearCookie();
    return res.redirect('/');
  });




app.listen(port,()=>{
    console.log(`the application succesfully running on port ${port}`);
});