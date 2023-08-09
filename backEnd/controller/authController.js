const User = require("../models/user");

const ErrorHandler = require('../utils/errorHandler');

const castAsyncError = require('../middlewares/catchAsyncErrors');
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");
const { send } = require("process");
const cloudinary = require('cloudinary');

//Inscription d'un Utilisateur 
exports.registerUser = castAsyncError( async (req, res, next)  =>{
    
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    });

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res);
    
})

// Logn user ==== /api/v1/login
exports.loginUser = catchAsyncErrors( async(req, res, next) => {
    const { email, password } = req.body;

    // selectionner si l'emails et le mot de pass est mis par le user
    if(!email || !password){
        return next(new ErrorHandler('Entrer Email et le Mot de pass Normal', 400));
    }

    // retrouver lUtilisateur sur le Base de Donnee 
    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new ErrorHandler('Email Invalide ou Mot de pass Invalide !', 401));
    }

    // check si le mot de pass es tcorrect 

    const isPasswordMatched = await user.comparePassword(password);
    
    if(!isPasswordMatched) {
        return next(new ErrorHandler('Email Invalide ou Mot de pass Invalide !', 401));
    }

    sendToken(user, 200, res);
})



// forgot Password ==== /api/v1/password/forgot*
exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    // console.log(user);
    if(!user){
        return next(new ErrorHandler('Utilisateur introuvable avec ce email', 404));
    }

    //get reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // create reset password url
    const resetUrl = req.protocol+'://'+req.get('host')+'/api/v1/password/reset/'+resetToken;

    const message = 'Ton message de renitialisation est un cour ! '+resetUrl+' si tu as deja recu un email de renitialisation, donc ignore le ';

    try {
        await sendMail({
            email: user.email,
            subject: 'renitialisation de Password',
            message,
            resetToken
        })

        res.status(200).json({
            success: true,
            message: 'Email Envoyer à : '+user.email
        })
    } catch (error) {
        user.resetPasswordToken= undefined;
        user.resetPasswordExpire= undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})

// reset Password ==== /api/v1/password/rest*
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    
    // console.log(resetPasswordTokens);
    const user = await User.findOneAndUpdate({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { 
            $gte: Date.now()
        },
    })


    if(!user){
        return next(new ErrorHandler('Mot de pass Token Invalide or expired ', 400));
    }
    
    // console.log(user)
    
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Mot de pass Invalide ', 400));
    }

    //set up new Password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);


})

// Obtenir L'information sur la connection d'un User 
exports.getUserProfile = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({ 
        success: true,
        user
    })
})

// Changer Motde pass d'un User 
exports.updatePassword = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //check previous Password
    const isMatched = await user.comparePassword(req.body.oldPassword);

    if(!isMatched){
        return next(new ErrorHandler('Ancien Mot de passe Incorrecte !!!',400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)

})

//Mis a jour Profil User
exports.updateProfile = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //Update Avatar
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if(!user){
        return next(new ErrorHandler('Avatar Non trouver !!!', 400));
    }

    res.status(200).json({
        success: true
    })
})


//log out user 

exports.logout = catchAsyncErrors( async (req, res, next) => {
    res.cookie('token' ,null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Deconnectèe !'
    })
})

//Router Admin

//Get All User
exports.allUsers = catchAsyncErrors( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//Het User detail
exports.getUserDetails = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next( new ErrorHandler('Utilisateur Introuvable, avec id : '+req.params.id));
    }

    res.status(200).json({
        success: true,
        user
    })
})

//Mis a jour Administration User
exports.updateUser = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if(!user){
        return next(new ErrorHandler('Avatar Non trouver !!!', 400));
    }

    res.status(200).json({
        success: true,
        message: 'Utlisateur modifier !',
        user
    })
})

//Supprimer User
exports.deleteUser = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next( new ErrorHandler('Utilisateur Introuvable, avec id : '+req.params.id));
    }

    //Suppresion de Utilisateur 

    await user.deleteOne();

    res.status(200).json({
        success: true
    })
})
