import express from 'express';
import { User, genetrateJwtToken } from '../models/users.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';



dotenv.config()


const router = express.Router();

//signup

router.post("/signup",async(req,res)=>{
    try {
        //find user exist
        let user = await User.findOne({email:req.body.email});
        if(user) return res.status(400).json({message:"Email already Exist"})

        //generate password
 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
    
        //new password updation
        user =await new User({
            name :req.body.name,
            email: req.body.email,
            password : hashedPassword,
            contact: req.body.contact
        }).save()

      const token = genetrateJwtToken(user._id)
      res.status(200).json({message:"SignUp Sucessfully",token})
    } catch (error) {
       res.status(500).json({message:"Please fill the Informations"})
    }
})

//login

router.post("/login",async(req,res)=>{
    try {
        //validate user exist
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        //validate password
        const validatePassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if(!validatePassword){
            return res.status(400).json({message:"Invalid Password"})
        }
        //generate token 
        const token = genetrateJwtToken(user._id);
        res.status(200).json({message:"Login sucessfully",token,user})
    } catch (error) {
        console.log("login error",error)
        res.status(500).json({message:"Internal server Error"})
    }
})

//forget
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure:false,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD
    }
  });
  
  router.post('/forgot', async(req, res) => {
    const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const token = genetrateJwtToken(user._id);
        const link = `http://localhost:3000/verify/${user._id}`;
        console.log(link);
    // You can generate a secure token here for the password reset link
    // For simplicity, let's assume you have a token 'resetToken123'
    const userEmail = req.body.email;
    const mailOptions = {
      from: process.env.MAIL,
      to: userEmail,
      subject: 'Password Reset',
      text: link
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({message:"Error Sending Mail"})
      } else {
        console.log('Email sent: ');
        res.status(200).json({message:"Email Sending Sucessfully",token,user})
      }
    });
  });

//reset
router.put("/verify/:id", async (req, res) => {

  try {
   
     const { password } = req.body;
      const userdata = await User.findOne({ _id:req.params.id});
    if (!userdata.password) {
      res.status(400).json({ message: "User doesn't exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
   
    const user = await User.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    const token = genetrateJwtToken(user._id);
    res.status(200).json({ status: "verified", userdata,token});
  } catch (error) {
    console.log(error)
    res.json({ status: "Something Went Wrong",error});
  }
});


export const UserRouter = router ;