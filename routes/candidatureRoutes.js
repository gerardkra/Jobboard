const express = require('express');
const router = express.Router();
const candidatureController = require('../controller/candidatureController');

/**
 * @swagger
 * tags:
 *   name: Candidatures
 *   description: Gestion des candidatures
 */

/**
 * @swagger
 * /api/candidatures:
 *   get:
 *     summary: Récupérer toutes les candidatures
 *     tags: [Candidatures]
 *     responses:
 *       200:
 *         description: Liste des candidatures
 */
router.get('/', candidatureController.getCandidatures);

/**
 * @swagger
 * /api/candidatures/{id}:
 *   get:
 *     summary: Récupérer une candidature par ID
 *     tags: [Candidatures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la candidature
 *       404:
 *         description: Candidature non trouvée
 */
router.get('/:id', candidatureController.getCandidatureById);

/**
 * @swagger
 * /api/candidatures:
 *   post:
 *     summary: Créer une candidature
 *     tags: [Candidatures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applied_date
 *               - statut
 *               - last_email_sent
 *               - notes
 *             properties:
 *               applied_date:
 *                 type: string
 *                 format: date
 *               statut:
 *                 type: string
 *               last_email_sent:
 *                 type: string
 *               notes:
 *                 type: string
 *               ad_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Candidature créée
 */
router.post('/', candidatureController.createCandidature);

/**
 * @swagger
 * /api/candidatures/{id}:
 *   put:
 *     summary: Mettre à jour une candidature
 *     tags: [Candidatures]
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
 *         description: Candidature mise à jour
 *       404:
 *         description: Candidature non trouvée
 */
router.put('/:id', candidatureController.updateCandidature);

/**
 * @swagger
 * /api/candidatures/{id}:
 *   delete:
 *     summary: Supprimer une candidature
 *     tags: [Candidatures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Candidature supprimée
 *       404:
 *         description: Candidature non trouvée
 */
router.delete('/:id', candidatureController.deleteCandidature);

module.exports = router;
