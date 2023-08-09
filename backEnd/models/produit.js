const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Veillez Saisir le Nom Du Produit'],
        trim:true,
        maxLength:[100, 'Le nom Du Produits ne doit pas depasser 100 caractere ']
    },
    description:{
        type:String,
        required:[true,'Veillez Saisir la Description Du Produit']
    },
    price:{
        type:Number,
        required:[true,'Veillez Saisir le Prix Du Produit'],
        trim:true,
        maxLength:[100, 'Le Prix Du Produits ne doit pas depasser 5 caractere '],
        default: 0.0
    },
    discountPercentage:{
        type:Number,
        required:[true,'Veillez Saisir le Prix Du Produit'],
        trim:true,
        maxLength:[100, 'Le Prix Du Produits ne doit pas depasser 5 caractere '],
        default: 0.0
    },
    ratings:{
        type:String,
        default:0
    },
    stock: {
        type: Number,
        required: [true, 'Entrer le Produit Stocker '],
        maxLength:[100, 'Le Prix Du Produits ne doit pas depasser 5 caractere '],
        default: 0
    },
    brand: {
        type: String,
        required: [true, 'Entrer le Produit du Vendeur ']
    },
    category:{
        type:String,
        required:[true,'Veillez selectionner le Category du Produit '],
        enum:{
            values: [
                'Electronique',
                'Camera',
                'Machines',
                'Laptops',
                'Accessoires',
                'Ecouteurs',
                'Telephones',
                'smartphones',
                'Voiture',
                'Nourritures',
                'Livres',
                'Vetements',
                'Beauty',
                'Sports',
                'OutDoor',
                'Home',
                'Chaussure'
            ],
            message: 'Veillez Selectionner un Category'
        }        
    },
    images:[
        {
            url: {
                type: String,
                required: true
            },
        }
    ],
   
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
})

module.exports = mongoose.model('Produit', produitSchema);