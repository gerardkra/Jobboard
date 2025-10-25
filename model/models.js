const { Sequelize, DataTypes } = require('sequelize');

//  Connexion à la base

// const sequelize = new Sequelize('job_board', 'root', '', {       // mot de passe vide
//   host: 'localhost',
//   dialect: 'mysql'
// });
const sequelize = new Sequelize('job_board', 'node_user', 'Motdepasse123!', {
  host: 'localhost',
  dialect: 'mysql'
});


//  Définition des modèles


// --- User ---

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  firstname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.BIGINT, allowNull: false }
}, {
  tableName: 'user',
  timestamps: false
});

// --- Company ---

const Company = sequelize.define('Company', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  industrie: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  website: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'companies',
  timestamps: false
});

// --- Advertisement ---

const Advertisement = sequelize.define('Advertisement', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  compagnie_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }, 
  recruter_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }, 
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  salary_range: { type: DataTypes.STRING, allowNull: false },
  published_date: { type: DataTypes.DATEONLY, allowNull: false }
}, {
  tableName: 'advertisements',
  timestamps: false
});

// // --- Candidature ---

// const Candidature = sequelize.define('Candidature', {
//   id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
//   applied_date: { type: DataTypes.DATEONLY, allowNull: false },
//   statut: { type: DataTypes.STRING, allowNull: false },
//   last_email_sent: { type: DataTypes.STRING, allowNull: false },
//   notes: { type: DataTypes.STRING, allowNull: false }
// }, {
//   tableName: 'candidatures',
//   timestamps: false
// });


const Candidature = sequelize.define('Candidature', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  ad_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },   // ✅ peut être NULL
  user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true }, // ✅ peut être NULL
  applied_date: { type: DataTypes.DATEONLY, allowNull: false },
  statut: { type: DataTypes.STRING, allowNull: false },
  last_email_sent: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'candidatures',
  timestamps: false
});


//  Définition des relations

Advertisement.belongsTo(Company, { foreignKey: 'compagnie_id' });
Advertisement.belongsTo(User, { foreignKey: 'recruter_id' });

// Candidature.belongsTo(Advertisement, { foreignKey: 'ad_id' });
// Candidature.belongsTo(User, { foreignKey: 'user_id' });
Candidature.belongsTo(Advertisement, { foreignKey: 'ad_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Candidature.belongsTo(User, { foreignKey: 'user_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// Synchroniser la base (optionnel)
// sequelize.sync({ alter: true })
//   .then(() => console.log('All models synced!'))
//   .catch(err => console.error(err));

// Exporter

module.exports = { sequelize, User, Company, Advertisement, Candidature };

//commmentaire pour tester branch backend local