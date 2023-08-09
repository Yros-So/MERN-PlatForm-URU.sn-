const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next)  => {
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV == 'PRODUCTION'){
        let error = {...err}

        error.message = err.message;

        // Wrong Mongose Object ID ERROR
        if(err.name === 'CastError'){
            const message = 'Ressource Introuvable ! | invalid '+err.path;
            error = new ErrorHandler(message, 400);

        }

        //HandLing Mongoose Validation Error
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }
        
        //HandLing Mongoose duplicated Keys Errors
        if(err.code === 11000){
            const message = 'Email Dupliquer '+ Object.keys(err.keyValue) +' Essayer un autre Email !!!';
            error = new ErrorHandler(message, 400);
        }
        
        //HandLing wrong JWT Error
        if(err.name === 'JsonWebTokenError'){
            const message = 'Json Web Token est Invalide, Ressayer SVP !!!';
            error = new ErrorHandler(message, 400);
        }
        
        //HandLing wrong JWT Error
        if(err.name === 'TokenExpiredError'){
            const message = 'Json Web Token est Expiree, Ressayer SVP !!!';
            error = new ErrorHandler(message, 400);
        }
        
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Error serveur Interne'
        })
    }

}