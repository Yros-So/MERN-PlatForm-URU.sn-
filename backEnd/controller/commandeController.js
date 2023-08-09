const Commande = require('../models/commande');
const Produit = require('../models/produit');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create un nouveau Order
exports.newCommande = catchAsyncErrors( async (req, res, next) => {
    const {
        commandeItems,
        expeditionInfo,
        itemsPrice,
        taxPrice,
        expeditionPrice,
        totalPrice,
        paymentInfo
        
    } = req.body;
    
    const commande = await Commande.create({
        commandeItems,
        expeditionInfo,
        itemsPrice,
        taxPrice,
        expeditionPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.send(200).json({
        success: true,
        message: "Commande Passèe !!!",
        commande
    })
})

//Voirs les Commande de l'utilisateur Connecter ! /Admin
exports.getSingleCommande = catchAsyncErrors( async (req, res, next) => {
    const commande  = await Commande.findById(req.params.id).populate('user', 'name email');

    if(!commande){
        return next(new ErrorHandler('Pas de Commande avec cet ID !', 404));
    }

    res.status(200).json({
        success: true,
        commande
    })

})

//Voirs les Commande de l'utilisateur Connecter ! /Admin
exports.myCommandes = catchAsyncErrors( async (req, res, next) => {
    const commandes  = await Commande.find({ user: req.user.id });
    console.log(commandes);

    if(!commandes){
        return next(new ErrorHandler('Pas de Commande avec cet ID !', 404));
    }


    res.status(200).json({
        success: true,
        commandes
    })

})

//Voirs tous les Commande ! /Admin
exports.getAllCommandes = catchAsyncErrors( async (req, res, next) => {
    const commandes  = await Commande.find();

    let totalAmount = 0;

    commandes.forEach(commandes => {
        totalAmount += commandes.totalPrice;
    })

    if(!commandes){
        return next(new ErrorHandler('Pas de Commande avec cet ID !', 404));
    }


    res.status(200).json({
        success: true,
        totalAmount,
        commandes
    })

})


//Mis A jours tous les Commande ! /Admin
exports.updateCommande = catchAsyncErrors( async (req, res, next) => {
    const commande  = await Commande.findById(req.params.id);

    if(!commande.statusCommande === 'Delivered'){
        return next(new ErrorHandler('Vous avez deja Passèe ce Commande !!!', 404));
    }

    commande.commandeItems.forEach( async item => {
        await updateStock(item.produit, item.quantity)
    })

    commande.statusCommande = req.body.status;
    commande.deliveredAt = Date.now();

    commande.save();

    res.status(200).json({
        success: true,

    })
})

async function updateStock(id, quantity) {
    const produit = await Produit.findById(id);

    produit.stock = produit.stock - quantity;

    await produit.save({ validateBeforeSave: false });
}

//Delate commande ===== /commande/:id
exports.deleteCommande = catchAsyncErrors( async (req, res, next) => {
    const commande  = await Commande.findById(req.params.id);

    if(!commande){
        return next(new ErrorHandler('Pas de Commande avec cet ID !', 404));
    }
    const CDelete = [commande._id];
    console.log(commande);
    await commande.deleteOne();
    res.status(200).json({
        success: true,
        message: "Commande Supprimer !\n ID: "+commande._id+"\n name: "+commande.commandeItems.name
    })
})

