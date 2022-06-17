const express=require("express")
const router = express.Router()
const User= require("../../models/User")
const { check, validationResult } = require('express-validator')
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const config=require("config")
/** 
 @api {post} /api/user Create the single registation
 * @apiName post user
 * @apiGroup user
 *
 * @apiSuccess {String} name get the name
 * @apiSuccess {String} userName get the userName
 * @apiSuccess {String} password get the password
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {Number} CreatedAt get the date of CreatedAt
 * 
 * @apiError {String} User user  already exist
; */


router.post('/',[
    check('name','name is required').not().isEmpty(),
    check("username","username is required ").isEmail(),
    check("createdBy","please enter the correct password").not().isEmpty(),
    check("password","piease enter the valid password").isLength({min:6, max: 12})
],
async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})

    }
    const {name,username,password,createdBy}=req.body
    try{
        let user= await User.findOne({ username })
        if(user){
            res.status(400).json({errors:[{msg:"User already registered"}]})
        }
    user= new User({
        name,
        username,
        password,
        createdBy

    })
    const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save()

        const payload={
            user:{
            id:user.id
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{
            expiresIn:360000
        },(err,token) =>{
            if(err) throw err;
            res.json({ token })
        })
      
    } catch(err){
        console.error(err.message)
        res.status(500).send("server error")
    }

})
module.exports = router
