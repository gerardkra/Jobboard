// ===============================
// Imports et configuration
// ===============================
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs';
import path from 'path';

const { User, Company, Advertisement, Candidature } = require('../model/models.js');
const { Op } = require('sequelize');

// --- Associations (important si non déjà faites ailleurs)
Advertisement.belongsTo(Company, { foreignKey: 'compagnie_id' });
Company.hasMany(Advertisement, { foreignKey: 'compagnie_id' });

// =============================
// PAGE D'ACCUEIL : HOME
// =============================
export async function home(req, res) {
  const filePath = path.join(process.cwd(), 'view', 'home.html');

  fs.readFile(filePath, 'utf-8', async (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Erreur chargement home.html : ' + err.message);
    }

    try {
      // =============================
      // 🔍 1️⃣ Lecture des filtres GET
      // =============================
      const page = parseInt(req.query.page) || 1;
      const limit = 8;
      const offset = (page - 1) * limit;

      const titleFilter = req.query.title ? req.query.title.trim() : '';
      const locationFilter = req.query.location ? req.query.location.trim() : '';
      const salaryFilter = req.query.salary ? req.query.salary.trim() : '';
      const companyFilter = req.query.company ? req.query.company.trim() : '';

      // =============================
      // 🧱 2️⃣ Préparation des filtres Sequelize
      // =============================
      const where = {};
      if (titleFilter) where.title = { [Op.like]: `%${titleFilter}%` };
      if (locationFilter) where.location = { [Op.like]: `%${locationFilter}%` };

      const include = [
        {
          model: Company,
          where: companyFilter ? { name: { [Op.like]: `%${companyFilter}%` } } : undefined,
          required: !!companyFilter,
        },
      ];

      // // =============================
      // // 💾 3️⃣ Récupération depuis la BD
      // // =============================
      // const { count, rows: adsRaw } = await Advertisement.findAndCountAll({
      //   where,
      //   include,
      //   order: [['published_date', 'DESC']],
      // });
      // =============================
      // 3️⃣ Récupération depuis la BD avec tri
      // =============================
      let order = [['published_date', 'DESC']]; // par défaut = newest
      const sort = req.query.sort || 'newest';

      if (sort === 'oldest') order = [['published_date', 'ASC']];
      else if (sort === 'salary_asc') order = [['salary_range', 'ASC']];
      else if (sort === 'salary_desc') order = [['salary_range', 'DESC']];

      const { count, rows: adsRaw } = await Advertisement.findAndCountAll({
        where,
        include,
        order,
      });


      // =============================
      // 💰 4️⃣ Filtrage intelligent des salaires côté JS
      // =============================
      let salaryMin = null;
      let salaryMax = null;

      if (salaryFilter) {
        if (salaryFilter.includes('<')) {
          salaryMax = 24000;
        } else if (salaryFilter.includes('24k')) {
          salaryMin = 24000;
          salaryMax = 42000;
        } else if (salaryFilter.includes('42k')) {
          salaryMin = 42000;
          salaryMax = 60000;
        } else if (salaryFilter.includes('60k')) {
          salaryMin = 60000;
        }
      }

      const ads = adsRaw.filter((ad) => {
        if (!salaryMin && !salaryMax) return true;

        // Extrait les nombres (k = milliers)
        const match = ad.salary_range.match(/(\d+)\s*[kK]/g);
        if (!match) return false;

        const nums = match.map((s) => parseInt(s.replace(/k/i, '')) * 1000);
        const min = Math.min(...nums);
        const max = Math.max(...nums);

        if (salaryMin && salaryMax) return max >= salaryMin && min <= salaryMax;
        if (salaryMin) return max >= salaryMin;
        if (salaryMax) return min <= salaryMax;
        return true;
      });

      // =============================
      // 📄 5️⃣ Pagination des résultats
      // =============================
      // const total = ads.length;
      // const totalPages = Math.ceil(total / limit);
      // const shownAds = ads.slice(offset, offset + limit);
      // const shown = Math.min(page * limit, total);
      const total = ads.length;
      const totalPages = Math.ceil(total / limit);
      const shownAds = ads.slice(offset, offset + limit);
      // Nombre total d'offres "lues" jusqu'à cette page
      let readCount = page * limit;
      if (readCount > total) readCount = total; // ne pas dépasser total


      // Nombre d'offres réellement affichées sur la page courante
      const shownOnPage = shownAds.length;

      // =============================
      // 🧱 6️⃣ Génération HTML dynamique
      // =============================
      const adsHTML =
        shownAds.length > 0
          ? shownAds
              .map(
                (ad) => `
              <article class="bg-white rounded-xl p-4 shadow hover:shadow-md transition grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                <!-- Logo -->
                <div class="md:col-span-1 flex items-center">
                  <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-teal-400 text-white flex items-center justify-center font-bold">
                    ${ad.Company ? ad.Company.name[0].toUpperCase() : '?'}
                  </div>
                </div>

                <!-- Infos principales -->
                <div class="md:col-span-4">
                  <h3 class="text-lg font-semibold">${ad.title}</h3>
                  <div class="text-sm text-gray-600 mt-1">
                    ${ad.Company ? ad.Company.name : 'Entreprise inconnue'} • ${ad.location}
                  </div>
                  <p class="text-sm text-gray-600 mt-3">${ad.description}</p>
                  <div class="mt-3 flex items-center gap-3 text-xs">
                    <span class="px-2 py-1 bg-gray-100 rounded-full">${ad.salary_range || 'Salaire non précisé'}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="md:col-span-1 flex flex-col justify-between items-end">
                  <div class="text-sm text-gray-500">Publié le ${ad.published_date}</div>
                  <div class="mt-3 flex gap-2">
                    <a href="/job/${ad.id}" class="px-3 py-2 bg-white border rounded text-sm">Voir</a>
                    <a href="/apply/${ad.id}" class="px-3 py-2 bg-blue-600 text-white rounded text-sm">Postuler</a>

                  </div>
                </div>
              </article>
            `
              )
              .join('')
          : `<div class="text-center text-gray-500 py-10">Aucune offre trouvée pour ces critères.</div>`;

      // =============================
      // 🧭 7️⃣ Pagination HTML
      // =============================
      // const queryBase = `title=${titleFilter}&location=${locationFilter}&salary=${salaryFilter}&company=${companyFilter}`;
      const queryBase = `title=${titleFilter}&location=${locationFilter}&salary=${salaryFilter}&company=${companyFilter}&sort=${sort}`;

      let paginationHTML = `<nav class="inline-flex -space-x-px rounded-md shadow-sm">`;
      paginationHTML +=
        page > 1
          ? `<a href="?page=${page - 1}&${queryBase}" class="px-3 py-2 border bg-white text-sm">Prev</a>`
          : `<span class="px-3 py-2 border bg-gray-100 text-sm text-gray-400">Prev</span>`;
      for (let i = 1; i <= totalPages; i++) {
        paginationHTML +=
          i === page
            ? `<span class="px-3 py-2 border bg-blue-50 text-blue-600 font-bold text-sm">${i}</span>`
            : `<a href="?page=${i}&${queryBase}" class="px-3 py-2 border bg-white text-sm">${i}</a>`;
      }
      paginationHTML +=
        page < totalPages
          ? `<a href="?page=${page + 1}&${queryBase}" class="px-3 py-2 border bg-white text-sm">Next</a>`
          : `<span class="px-3 py-2 border bg-gray-100 text-sm text-gray-400">Next</span>`;
      paginationHTML += `</nav>`;

      // =============================
      // 🧩 8️⃣ Injection dans home.html
      // =============================
        const endText = (readCount === total)
          ? '<span class="text-green-600 ml-1">(All offers viewed)</span>'
          : '';

        content = content.replace(
          /<div[^>]*id=["']jobs-count["'][^>]*>[\s\S]*?<\/div>/i,
          `<div id="jobs-count" class="text-sm text-gray-600">
            Showing <span class="font-medium text-gray-800">${readCount}</span> /
            <span class="font-medium text-gray-800">${total}</span> jobs
            ${endText}
          </div>`
        )
        .replace('ads', adsHTML)
        .replace(/<nav class="inline-flex[\s\S]*?<\/nav>/, paginationHTML);
        
      // =============================
      // ✅ 9️⃣ Envoi au navigateur
      // =============================
      // Si la requête vient d'un fetch AJAX, on ne renvoie que la section <main> (ou un fragment utile)
      if (req.query && req.query.ajax === '1') {
        // Essayer d'extraire le <main> si présent, sinon renvoyer tout (fallback)
        const mainMatch = content.match(/<main[\s\S]*?<\/main>/i);
        const partial = mainMatch ? mainMatch[0] : content;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(partial);
      }

      // sinon envoi normal de la page complète
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);

    } catch (error) {
      console.error('❌ Erreur SQL :', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Database error: ' + error.message);
    }
  });
}

//++++++++++APPLY++++++++
export async function apply(req, res) {
  const jobId = req.params.id;
  const filePath = path.join(process.cwd(), 'view', 'apply.html');

  fs.readFile(filePath, 'utf-8', async (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Erreur lors du chargement de la page Apply.');
    }

    try {
      // Récupération du job depuis la BD
      const ad = await Advertisement.findByPk(jobId, { include: [Company] });

      if (!ad) {
        content = content.replace(
          /<div id="job-info"[\s\S]*?<\/div>/,
          `<div id="job-info" class="text-center text-gray-500">Aucune offre trouvée.</div>`
        );
      } else {
        // HTML du job (comme dans job.html)
        const jobHTML = `
          <div>
            <h2 class="text-xl font-bold mb-2">${ad.title}</h2>
            <p class="text-gray-600 mb-1">${ad.Company ? ad.Company.name : 'Entreprise inconnue'}</p>
            <p class="text-gray-500 mb-3">${ad.location}</p>
            <p class="text-gray-700 mb-3">${ad.description}</p>
            <div class="mt-2 text-sm text-gray-600">
              <span class="px-2 py-1 bg-gray-100 rounded-full inline-block mb-1">${ad.salary_range}</span><br>
              <span>📅 Publié le ${ad.published_date}</span>
            </div>
          </div>
        `;

        content = content.replace(/<div id="job-info"[\s\S]*?<\/div>/, `<div id="job-info">${jobHTML}</div>`);
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } catch (error) {
      console.error("Erreur lors du chargement du job :", error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erreur serveur : ' + error.message);
    }
  });
}

// +++++++JOB++++++++++
export async function job(req, res) {
  const filePath = path.join(process.cwd(), 'view', 'job.html');
  const jobId = req.params.id;

  fs.readFile(filePath, 'utf-8', async (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Error loading job view: ' + err.message);
    }

    try {
      const { Advertisement, Company } = require('../model/models.js');
      const job = await Advertisement.findByPk(jobId, { include: Company });

      if (!job) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Job not found');
      }

      // --- Injection des données dynamiques ---
      const html = `
        <div class="flex items-start gap-6">
          <div class="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-600 to-teal-400 text-white flex items-center justify-center font-bold">
            ${job.Company ? job.Company.name[0].toUpperCase() : '?'}
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold">${job.title}</h1>
            <div class="text-sm text-gray-600 mt-1">
              ${job.Company ? job.Company.name : 'Entreprise inconnue'} • ${job.location} •
              <span class="font-medium">${job.salary_range}</span>
            </div>

            <div class="mt-3 flex items-center gap-3 text-xs">
              <span class="px-2 py-1 bg-gray-100 rounded-full">Full-time</span>
              <span class="px-2 py-1 bg-gray-100 rounded-full">Publié le ${job.published_date}</span>
            </div>

            <div class="mt-6 grid gap-4">
              <section>
                <h3 class="text-lg font-semibold mb-2">About the role</h3>
                <p class="text-gray-600">${job.description}</p>
              </section>
            </div>
          </div>

          <aside class="w-64 hidden lg:block">
            <div class="bg-gray-50 p-4 rounded-lg border">
              <div class="text-sm text-gray-600"><strong>Company</strong></div>
              <div class="font-medium mt-2">${job.Company ? job.Company.name : 'Entreprise inconnue'}</div>
              <div class="text-xs text-gray-500 mt-1">
                ${job.Company && job.Company.industrie ? job.Company.industrie : 'N/A'} • ${job.location}
              </div>

              <div class="mt-4">
                <a href="/apply/${job.id}" class="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded">Apply Now</a>
                <a href="/home" class="block w-full text-center px-4 py-2 mt-2 border rounded bg-white text-sm">Back to Jobs</a>
              </div>
            </div>
          </aside>
        </div>
      `;

      const finalContent = content.replace(
        /<div class="bg-white rounded-xl shadow p-6">[\s\S]*?<\/div>/,
        `<div class="bg-white rounded-xl shadow p-6">${html}</div>`
      );

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(finalContent);

    } catch (error) {
      console.error('Erreur job():', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Database error: ' + error.message);
    }
  });
}
// ===============================
// MY APPLICATIONS (Candidate only)
// ===============================
export async function myApplications(req, res) {
  const userId = req.params.userId;
  const filePath = path.join(process.cwd(), 'view', 'my_applications.html');

  fs.readFile(filePath, 'utf-8', async (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Error loading My Applications page.');
    }

    try {
      // Get all applications from the database
      const applications = await Candidature.findAll({
        where: { user_id: userId },
        include: [{ model: Advertisement, include: [Company] }],
        order: [['createdAt', 'DESC']],
      });

      // Generate HTML dynamically
      const applicationsHTML = applications.length
        ? applications
            .map(
              (app) => `
            <article class="border p-4 rounded-lg hover:shadow-sm transition">
              <h3 class="font-semibold text-lg">${app.Advertisement.title}</h3>
              <p class="text-sm text-gray-600">
                ${app.Advertisement.Company?.name || 'Unknown Company'} • ${app.Advertisement.location}
              </p>
              <p class="mt-2 text-gray-700">${app.Advertisement.description}</p>
              <div class="mt-2 text-xs text-gray-500">
                Applied on ${new Date(app.createdAt).toLocaleDateString()}
              </div>
              <div class="mt-4 flex gap-2">
                <a href="/job/${app.Advertisement.id}" class="px-3 py-2 bg-white border rounded text-sm">View Offer</a>
                <a href="/apply/${app.Advertisement.id}" class="px-3 py-2 bg-blue-600 text-white rounded text-sm">Apply Again</a>
              </div>
            </article>`
            )
            .join('')
        : `<p class="text-gray-500 italic">You haven’t applied to any jobs yet.</p>`;

      // Inject HTML content
      content = content.replace('Loading your applications...', applicationsHTML);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } catch (error) {
      console.error('Error in myApplications():', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error: ' + error.message);
    }
  });
}


// ===============================
// AUTRES PAGES
// ===============================
export async function profil(req, res, id) {
  try {
    const users = await User.findByPk(id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error fetching profile: ' + err.message);
  }
}

export function register(req, res) {
  const filePath = path.join(process.cwd(), 'view', 'register.html');
  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading register view: ' + err.message);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
}

export function login(req, res) {
  const filePath = path.join(process.cwd(), 'view', 'login.html');
  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading login view: ' + err.message);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
}

export function dashboard(req, res) {
  const filePath = path.join(process.cwd(), 'view', 'dashboard.html');
  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading dashboard view: ' + err.message);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
}