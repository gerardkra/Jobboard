const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model/models');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Import des routes
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const candidatureRoutes = require('./routes/candidatureRoutes');

// import du controller web-app
const pageController = require('./controller/pageController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ------------------ fichiers statiques ------------------
app.use(express.static('view'));     // ton dossier de pages HTML
app.use(express.static('public'));   // ton dossier d'assets (CSS, JS, images)


// Configuration Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Board API',
      version: '1.0.0',
      description: 'API REST pour la gestion des utilisateurs, entreprises, annonces et candidatures',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'], // chemin vers tes fichiers de routes
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/candidatures', candidatureRoutes);


// Routes pour les pages web
app.get('/', (req, res) => res.redirect('/home'));
app.get('/home', pageController.home);
app.get('/job/:id', pageController.job);
app.get('/apply/:id', pageController.apply);
app.get('/profil/:id', (req, res) => pageController.profil(req, res, req.params.id));
app.get('/register', pageController.register);
app.get('/login', pageController.login);
app.get('/dashboard', pageController.dashboard);


app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Synchronisation et démarrage du serveur
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌐 Frontend available at http://localhost:${PORT}/home`);
      console.log(`📘 Swagger Docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => console.error('❌ Error connecting to the database:', err));