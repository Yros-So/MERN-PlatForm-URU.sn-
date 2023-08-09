const express = require('express');
const app = express();

const errorMiddleware = require('' + './middlewares/errors');

const cookie = require('cookie-parser');
const bodyparser = require('body-parser');
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookie());
app.use(fileUpload())

// Reglage cloudinary configuration 
// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });
cloudinary.config({ 
    cloud_name: 'dimma', 
    api_key: '719514348977522', 
    api_secret: 'bxCDVfXYq25mjtaMlfETWGfQRk4' 
});

const accessRouteP = './routes/produit';
const accessRouteA = './routes/auth';
const accessRouteC = './routes/commande';

//Impotation des router de ./route/

const produits = require(accessRouteP);
const auth = require(accessRouteA);
const commande = require(accessRouteC);


app.use('/api/v1', produits);
app.use('/api/v1', auth);
app.use('/api/v1', commande);


//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;