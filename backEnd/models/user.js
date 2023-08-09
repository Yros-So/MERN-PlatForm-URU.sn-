const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Mettez Votre Nom !'],
        maxLength: [30, 'Votre nomm ne doit pas depasser 30 caractere !']
    },
    email: {
        type: String,
        required: [true, 'Votre Mot de Pass !'],
        unique: true,
        validate: [validator.isEmail, 'Entrer le Bon Email !']
    },
    password: {
        type: String,
        required: [true, 'Entrer Le Bon Mot de Pass !'],
        minLength: [8,'Votre email doit depasser 8'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: {Date}

})

//Encrypter le mot de pass 
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);

})

// Campare le Mot de pass 
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// retourne JWT Token 
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

//Generation de Mot de pass reset token 
userSchema.methods.getResetPasswordToken = function () {
    // generated Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash and reset passwoerd token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Regle l'expiration du token
    this.resetPasswordToken = new Date(Date.now() + 30 * 60 * 1000);

    return resetToken;

}

module.exports = mongoose.model('User', userSchema);
