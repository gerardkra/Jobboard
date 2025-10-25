const express = require('express');
const router = express.Router();
const advertisementController = require('../controller/advertisementController');

/**
 * @swagger
 * tags:
 *   name: Advertisements
 *   description: Gestion des annonces
 */

/**
 * @swagger
 * /api/advertisements:
 *   get:
 *     summary: Récupérer toutes les annonces
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: Liste des annonces
 */
router.get('/', advertisementController.getAdvertisements);

/**
 * @swagger
 * /api/advertisements/{id}:
 *   get:
 *     summary: Récupérer une annonce par ID
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'annonce
 *       404:
 *         description: Annonce non trouvée
 */
router.get('/:id', advertisementController.getAdvertisementById);

/**
 * @swagger
 * /api/advertisements:
 *   post:
 *     summary: Créer une annonce
 *     tags: [Advertisements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - compagnie_id
 *               - recruter_id
 *               - title
 *               - description
 *               - location
 *               - salary_range
 *               - published_date
 *             properties:
 *               compagnie_id:
 *                 type: integer
 *               recruter_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               salary_range:
 *                 type: string
 *               published_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Annonce créée
 */
router.post('/', advertisementController.createAdvertisement);

/**
 * @swagger
 * /api/advertisements/{id}:
 *   put:
 *     summary: Mettre à jour une annonce
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Annonce mise à jour
 *       404:
 *         description: Annonce non trouvée
 */
router.put('/:id', advertisementController.updateAdvertisement);

/**
 * @swagger
 * /api/advertisements/{id}:
 *   delete:
 *     summary: Supprimer une annonce
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Annonce supprimée
 *       404:
 *         description: Annonce non trouvée
 */
router.delete('/:id', advertisementController.deleteAdvertisement);

module.exports = router;
