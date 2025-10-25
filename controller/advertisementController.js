const { Advertisement, Company, User } = require('../model/models');

exports.getAdvertisements = async (req, res) => {
  const ads = await Advertisement.findAll({ include: [Company, User] });
  res.json(ads);
};

exports.getAdvertisementById = async (req, res) => {
  const ad = await Advertisement.findByPk(req.params.id, { include: [Company, User] });
  if (!ad) return res.status(404).send('Not found');
  res.json(ad);
};

exports.createAdvertisement = async (req, res) => {
  const ad = await Advertisement.create(req.body);
  res.json(ad);
};

exports.updateAdvertisement = async (req, res) => {
  const ad = await Advertisement.findByPk(req.params.id);
  if (!ad) return res.status(404).send('Not found');
  await ad.update(req.body);
  res.json(ad);
};

exports.deleteAdvertisement = async (req, res) => {
  const ad = await Advertisement.findByPk(req.params.id);
  if (!ad) return res.status(404).send('Not found');
  await ad.destroy();
  res.sendStatus(204);
};
