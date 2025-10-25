const { Candidature, Advertisement, User } = require('../model/models');

exports.getCandidatures = async (req, res) => {
  const candidatures = await Candidature.findAll({ include: [Advertisement, User] });
  res.json(candidatures);
};

exports.getCandidatureById = async (req, res) => {
  const cand = await Candidature.findByPk(req.params.id, { include: [Advertisement, User] });
  if (!cand) return res.status(404).send('Not found');
  res.json(cand);
};

exports.createCandidature = async (req, res) => {
  const cand = await Candidature.create(req.body);
  res.json(cand);
};

exports.updateCandidature = async (req, res) => {
  const cand = await Candidature.findByPk(req.params.id);
  if (!cand) return res.status(404).send('Not found');
  await cand.update(req.body);
  res.json(cand);
};

exports.deleteCandidature = async (req, res) => {
  const cand = await Candidature.findByPk(req.params.id);
  if (!cand) return res.status(404).send('Not found');
  await cand.destroy();
  res.sendStatus(204);
};
