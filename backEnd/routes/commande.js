const express = require('express');
const router = express.Router();

const { newCommande, getSingleCommande, myCommandes, getAllCommandes, updateCommande, deleteCommande } = require('../controller/commandeController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/commande/new').post(isAuthenticatedUser, newCommande);
router.route('/commande/:id').get(isAuthenticatedUser, getSingleCommande);

router.route('/commandes/me').get(isAuthenticatedUser, myCommandes);
router.route('/admin/commandes').get(isAuthenticatedUser, authorizeRoles('admin'), getAllCommandes);

router.route('/admin/commande/:id')
            .put(isAuthenticatedUser, authorizeRoles('admin'), updateCommande)
            .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCommande);


module.exports = router