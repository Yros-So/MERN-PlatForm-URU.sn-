const Produit = require('../models/produit');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const APIFeatures = require('../utils/apiFeatures');


//Creer un nouveau Produit == /api/v1/produit/new
exports.newProduit = catchAsyncErrors(async (req, res, next)  => {
    
    req.body.user = req.user.id;

    const produit = await Produit.create(req.body);

    res.status(201).json({
        success: true,
        produit
    })
})  

//Get all Product  ==/   /api/v1/produits?keyword=iphone
exports.getProduits = catchAsyncErrors(async (req, res,next)  =>{

    const resPerPage = 10;
    const produitsCount = await Produit.countDocuments();
    
    const apiFeatures = new APIFeatures(Produit.find(), req.query)
    .search()
    .filter()

    let produits = await apiFeatures.query;
    let filteredProductsCount = produits.length;

    apiFeatures.pagination(resPerPage)
    // produits = await apiFeatures.query;

    res.status(200).json({
        success:true,
        produitsCount,
        resPerPage,
        filteredProductsCount,
        produits
    })
})

//Rechercher UN SEUL Produits
exports.getSingleProduit =  catchAsyncErrors(async (req, res, next) => {

    const produit = await Produit.findById(req.params.id);

    if(!produit){
        return next(new ErrorHandler('Produit Introuvable !', 404));
    }else{
        res.status(200).json({
            success: true,
            produit
        })
    }   
})


exports.updateProduit =  catchAsyncErrors(async (req, res, next) => {

    let produit = await Produit.findById(req.params.id);

    if(!produit){
        return next(new ErrorHandler('Produit Introuvable !', 404));

    }else{
        produit = await Produit.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify:false    
        })

        res.status(200).json({
            success: true,
            produit
        });
        
    }   
})

//Supprimer Produit

exports.deleteProduit =  catchAsyncErrors(async (req, res, next) => {
 let produit = await Produit.findById(req.params.id);
 
 if(!produit){
    return next(new ErrorHandler('Produit Introuvable !', 404));

 }else{
    await produit.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Produit Supprimer'
    })
 }
})

// Creer un nouveau Review
exports.createProduitReview =  catchAsyncErrors(async (req, res, next) => {
    
    const { rating, comment, produitId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: rating,
        comment
    }

    const produit = await Produit.findById(produitId);

    const isReviewed = produit.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if(isReviewed){
        produit.reviews.forEach( review => {
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    }else{
        produit.reviews.push(review);
        produit.numOfReviews = produit.reviews.length;
    }
    produit.ratings = produit.reviews.reduce((acc, item) => item.rating + acc, 0) / produit.reviews.length;

    await produit.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        produit
    })

})

//Obtenir le Produits De Reviews
exports.getProduitReviews =  catchAsyncErrors(async (req, res, next) => {
    const produit = await Produit.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: produit.reviews
    })

})

//Delete le Produits De Reviews
exports.deletetReview =  catchAsyncErrors(async (req, res, next) => {
    const produit = await Produit.findById(req.query.produitId);

    const reviews = produit.reviews.filter(review => review._id.toString() !== req.query.id.toString())

    const numOfReviews = reviews.length;


    const ratings = produit.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Produit.findByIdAndUpdate(req.query.produitId, {
        reviews,
        ratings,
        numOfReviews
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
})
