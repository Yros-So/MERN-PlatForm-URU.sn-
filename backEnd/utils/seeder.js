const Produit = require('../models/produit');
const dotenv = require('dotenv');
const connectDB = require('../config/database');
const produits = require('../data/produit');

//Parametre du fichier dotenv
dotenv.config({ path: 'backend/config/config.env' });

connectDB();

const seedProduits = async () => {
    try {
        await Produit.deleteMany();
        console.log('Produits Supprimer !');

        await Produit.insertMany();
        console.log('Produits Inserer !');

        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}
seedProduits();