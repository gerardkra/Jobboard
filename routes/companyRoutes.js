const express = require('express');
const router = express.Router();
const companyController = require('../controller/companyController');

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Gestion des entreprises
 */

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Récupérer toutes les entreprises
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Liste des entreprises
 */
router.get('/', companyController.getCompanies);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Récupérer une entreprise par ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'entreprise
 *       404:
 *         description: Entreprise non trouvée
 */
router.get('/:id', companyController.getCompanyById);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Créer une entreprise
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - industrie
 *               - location
 *               - website
 *             properties:
 *               name:
 *                 type: string
 *               industrie:
 *                 type: string
 *               location:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entreprise créée
 */
router.post('/', companyController.createCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Mettre à jour une entreprise
 *     tags: [Companies]
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
 *         description: Entreprise mise à jour
 *       404:
 *         description: Entreprise non trouvée
 */
router.put('/:id', companyController.updateCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Supprimer une entreprise
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Entreprise supprimée
 *       404:
 *         description: Entreprise non trouvée
 */
router.delete('/:id', companyController.deleteCompany);

module.exports = router;
