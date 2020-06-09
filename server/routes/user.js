const router = require("express").Router();
const nodemailer = require("nodemailer");
const mailcredentials = require("../config/mailcredentials");
const Str = require('@supercharge/strings');

/* Models */
const User = require('../models/User.js');
const User_drink_relation = require('../models/User_drink_relation.js');
const Password_reset = require('../models/Password_reset.js');

router.get("/user", async(req, res) => {
    const Users = await User.query().select('email','id')
    console.log(Users)
    res.send({Users})
})

router.post("/user/request-pass-reset", async(req, res) => {
    const {email} = req.body;

    if(email == ""){
        return res.send({response:"Please enter email"})
    } 
    const Users = await User.query().select('email','id').where({email:email}).limit(1)
    const user = Users[0]
    console.log(user)

    if(!user){
        res.send({response: "Profile not found"})
    } else {
        const token = Str.random(20)
        console.log(token)
        

        const insertToken = await Password_reset.query().insert({
            token: token,
            user_id: user.id
        })

        let transporter = nodemailer.createTransport({
            host: mailcredentials.SMTP,
            port: 587,
            secure: false, 
            auth: {
              user: mailcredentials.email, 
              pass: mailcredentials.password, 
            },
            tls: {
                rejectUnauthorized: false
            }
          });
        
        
          let mailTemplate = await transporter.sendMail({
            from: '"Your Drinks " <min.dummy.mail93@gmail.com>', 
            to: email , 
            subject: "Request password Reset ", 
            text: `Hello. You have requested a password reset. If this was not request by you, log into your profile and change the password manually and disregard this message.${token}` , // plain text body
            html: `<b>Hello </b> 
            <p> There has been requested for a password reset. </p>
            <p>If this was not request by you, 
            log into your profile and change the password manually and disregard this message.</p>
            <p>If you have requested a password reset, press the following link </p>
            <a href="http://localhost:3000/reset-password?token=${token}&id=${insertToken.id}" >Click here</a>`, 
          });

        transporter.sendMail(mailTemplate, function(error, data){
            if(error){
                console.log('Error', error);
            } else {
                console.log('Email has been sent');
            }
        })
        res.send({response:"Mail has been sent"})
    }
})

router.patch('/user/change-password', async(req, res) => {
    const {email, currentPassword, newPassword, repeatPassword} = req.body;
    console.log(req.body)

   
    console.log(req.body)
    if(currentPassword === newPassword){
        res.send({response: 'New password cannot match your current'})
    } else {
       if(newPassword === repeatPassword){
           const findUser = await User.query().select('password').where({email:email}).where({password: currentPassword})
           const user = findUser[0]
           console.log(user)
           
           if(!user){
               res.send({response: "Current password is wrong"})
           } else {
               const changePassword = await User.query().update({ password: newPassword }).where({email: email});
               res.send({response: "Password was successfully changed"})
           }
        } else {
            res.send({response:"New password did not match"})
       }
    }
})

router.post('/user/reset-password', async(req, res) => {
    const {password, repeatPassword, token, id} = req.body;
    console.log(req.body);
    if (password === repeatPassword) {
        const findRequest = await Password_reset.query().select().where({token: token, id: id}).limit(1)
        const request = findRequest[0]

        if(!request){
            res.send({response:"Something went wrong"})
        } else {
            const findUserID = await Password_reset.query()
            .select('user.id')
            .join('user', 'password_reset.user_id', 'user.id').where({'password_reset.token': token});
            const userID = findUserID[0].id
            
            const updatePassword = await User.query()
            .update({ password: password })
            .where({id: userID});
            res.send({response: "Password was changed successfully"})
        }
    } else {
        res.send({response:"Password did not match"})
    }
})

router.post("/user/register", async(req, res) => {
    const {email, password, repeatPassword, name} = req.body;

    if(password === repeatPassword){
        const existingUsers = await User.query().select().where({email: email}).limit(1);
        const existingUser = existingUsers[0];
        console.log(existingUser)
        if(!existingUser){
            const insertUser = await User.query().insert({
                name: name,
                password: password,
                email: email
            })
        
            res.status(200).send({response: "User created"})
        } else {
            res.send({response: "Email in use"})
        }
    } else {
        res.send({response:"Password did not match"})
    }
})

router.post("/user/login", async(req, res) => {
    const {email, password} = req.body;
    console.log(email)
    console.log(password)
    
    if(email == "" && password == ""){
        res.send({response: "Please provide Email and Password"})
    } else {
        const findUser = await User.query().select().where({email: email}).limit(1)
        const user = findUser[0]
        console.log(findUser)
        if(!user){
            res.send({response: "Incorrect Email"})
        } else {
            console.log("User found")
            if(user.password === password){
                console.log("password correct")
                const name = user.name
                res.send({response: "Correct", name})
            } else {
                res.send({response: "Incorrect password"})
            }
        }
    }
})  

router.patch("/user/change-email", async(req,res) => {
    const {oldEmail, newEmail} = req.body;

    if(oldEmail === newEmail){
        res.send({response:"New email matches old one"})
    } else {
        const existingEmails = await User.query().select('email').where({email: newEmail}).limit(1)
        const existingEmail = existingEmails[0]
        console.log(existingEmail)

        if(!existingEmail){
            const updatePassword = await User.query()
            .update({ email: newEmail })
            .where({email: oldEmail});

            res.send({response: "Mail has been changed"})
        } else {
            res.send({response: "Email already in use"})
        }
    }
    console.log(req.body)

    
})

router.patch("/user/change-name", async(req,res) => {
    const {oldName, newName, email} = req.body;

    if(oldName === newName){
        res.send({response:"New name matches old one"})
    } else {
            const updatename = await User.query()
            .update({ name: newName })
            .where({email: email});

            res.send({response:"Name has been changed"})
  
    }
    console.log(req.body)

    
})

router.delete("/user/delete", async(req,res) => {
    const {email} = req.body;

    const findUser = await User.query().select('id').where({email:email}).limit(1)
    const id = findUser[0].id
    console.log(id)
    const deleteRelations = await User_drink_relation.query().delete().where({user_id: id})
    const deletePasswordResets = await Password_reset.query().delete().where({user_id: id})
    const deleteUser = await User.query().delete().where({email: email})

    res.send({reponse:"Deleted"})
})


module.exports = router;