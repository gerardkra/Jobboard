// app.js
import express from 'express';                    // ① crée l'app Express
import { home,apply,job, profil, register, login, dashboard } from './controller/pagecontroller.js';

const app = express();
const PORT = process.env.PORT || 3000;            // ② port configurable via variable d'environnement

// ------------------ middlewares ------------------
// Sert les fichiers statiques (CSS, JS client, images).
// Exemple : si view/style.css existe, /style.css renverra ce fichier.
app.use(express.static('view'));                  
app.use(express.static('public'));                // pratique pour séparer assets

// Si tu veux accepter les données POST en provenance d'un formulaire:
// app.use(express.urlencoded({ extended: true }));
// Pour JSON:
// app.use(express.json());

// ------------------ routes ------------------
// Routes publiques : on associe une URL à une fonction exportée par ton controller
app.get('/job/:id', job);
app.get('/apply/:id', apply);
app.get('/', (req, res) => res.redirect('/home')); // redirige la racine vers /home
app.get('/home', home);                            // quand GET /home -> appelle home(req,res)
app.get('/register', register);
app.get('/login', login);
app.get('/dashboard', dashboard);

// Route dynamique : accès à req.params.id
app.get('/profil/:id', (req, res) => profil(req, res, req.params.id));

// 404 (optionnel, placé après toutes les routes)
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// ------------------ démarrage du serveur ------------------
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé : http://localhost:${PORT}`);
});
