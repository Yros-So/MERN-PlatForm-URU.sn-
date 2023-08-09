const User = require('../models/user');
const jwt = require('jsonwebtoken')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');

//checks if user est autentifier ou non
exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {
    const { token } = req.cookies;


    if(!token){
        return next(new ErrorHandler('Login first to access this resource .', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    next();
})

//handling User roles 
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHandler('Role '+(req.user.role)+' ne est pas acceepter par cette resource ', 403));
        }

        next();
    }
}