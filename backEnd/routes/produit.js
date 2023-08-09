const express = require('express')
const router = express.Router();

const { getProduits, newProduit, getSingleProduit, updateProduit, deleteProduit, createProduitReview, getProduitReviews, deletetReview } = require('../controller/produitController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.route('/produits').get(getProduits);

router.route('/produit/:id').get(getSingleProduit);

router.route('/admin/produit/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduit);

router.route('/admin/produit/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduit)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduit);

router.route('/review').put(isAuthenticatedUser, createProduitReview);
router.route('/reviews').get(isAuthenticatedUser, getProduitReviews);
router.route('/reviews').delete(isAuthenticatedUser, deletetReview);

module.exports = router;