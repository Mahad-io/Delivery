'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const config = require('./src/lib/config');
const { cspNonce, securityHeaders, csrf, limits } = require('./src/middleware/security');
const { attachUser } = require('./src/middleware/auth');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';

if (isProd && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.includes('change-me'))) {
  console.error('Refusing to start in production without a real SESSION_SECRET. See .env.example.');
  process.exit(1);
}

app.set('trust proxy', isProd ? 1 : false);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

app.use(cspNonce);
app.use(securityHeaders());
app.use(limits.global);
app.use(express.urlencoded({ extended: false, limit: '64kb' }));
app.use(express.json({ limit: '256kb' }));

app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: isProd ? '7d' : 0,
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff')
  })
);

app.use(
  session({
    name: 'dh.sid',
    store: new SQLiteStore({
      db: 'sessions.db',
      dir: path.dirname(path.resolve(process.env.DATABASE_PATH || './data/delivery-hub.db')),
      concurrentDB: true
    }),
    secret: process.env.SESSION_SECRET || 'insecure-development-secret',
    resave: false,
    saveUninitialized: true, // needed to hold pre-signup consent + CSRF token
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 24 * 30
    }
  })
);

app.use(csrf);
app.use(attachUser);

// Values every view can rely on.
app.use((req, res, next) => {
  res.locals.config = config;
  res.locals.year = new Date().getFullYear();
  res.locals.title = config.siteName;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

/* ----------------------------- routes ----------------------------- */
app.use('/', require('./src/routes/pages'));
app.use('/', require('./src/routes/auth'));
app.use('/', require('./src/routes/downloads'));
app.use('/', require('./src/routes/tools'));
app.use('/', require('./src/routes/gdpr'));
app.use('/', require('./src/routes/legal'));

app.get('/healthz', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

/* ---------------------------- fallbacks --------------------------- */
app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    return res.render('pages/error', {
      title: 'Page not found',
      status: 404,
      heading: 'Page not found',
      message:
        'If you typed the web address, check it is correct. If you pasted the web address, check you copied the whole thing.'
    });
  }
  return res.json({ error: 'not_found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status);
  if (req.accepts('html')) {
    return res.render('pages/error', {
      title: status === 403 ? 'Request blocked' : 'Sorry, there is a problem with the service',
      status,
      heading: status === 403 ? 'Request blocked' : 'Sorry, there is a problem with the service',
      message:
        err.userMessage ||
        (status >= 500
          ? 'Try again later. Nothing you had entered has been saved.'
          : 'That request could not be completed.')
    });
  }
  return res.json({ error: err.code || 'error', message: err.userMessage || 'Request failed' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n  ${config.siteName} running at ${config.baseUrl}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    if (!process.env.SMTP_URL) {
      console.log('  Email: not configured - verification and reset links print here.\n');
    }
  });
}

module.exports = app;
