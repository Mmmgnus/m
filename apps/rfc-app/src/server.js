import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import {
  getCommentsForRfc,
  createComment,
  findUserByEmail,
  createUser,
  createLoginToken,
  findLoginToken,
  deleteLoginTokensForUser,
  deleteExpiredLoginTokens,
  getCommentCounts
} from './db.js';
import { listRfcs, getRfcBySlug } from './rfcs.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

marked.setOptions({ mangle: false, headerIds: false });
app.locals.markdownToHtml = (markdown) => marked.parse(markdown);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'rfc-app-secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.flash = req.session.flash || [];
  delete req.session.flash;
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.flash = [{ type: 'error', message: 'You must be signed in to do that.' }];
    return res.redirect('/login');
  }
  next();
}

function addFlash(req, type, message) {
  if (!req.session.flash) {
    req.session.flash = [];
  }
  req.session.flash.push({ type, message });
}

app.get('/', (req, res) => {
  const rfcs = listRfcs();
  const commentCounts = getCommentCounts();
  const countsBySlug = commentCounts.reduce((acc, { slug, count }) => {
    acc[slug] = count;
    return acc;
  }, {});

  const enrichedRfcs = rfcs.map((rfc) => ({
    ...rfc,
    commentCount: countsBySlug[rfc.slug] ?? 0
  }));

  res.render('index', { rfcs: enrichedRfcs });
});

app.get('/rfc/:slug', (req, res) => {
  const { slug } = req.params;
  const rfc = getRfcBySlug(slug);

  if (!rfc) {
    return res.status(404).render('not-found');
  }

  const comments = getCommentsForRfc(slug);
  res.render('rfc', { rfc, comments });
});

app.post('/rfc/:slug/comments', requireAuth, (req, res) => {
  const { slug } = req.params;
  const rfc = getRfcBySlug(slug);
  if (!rfc) {
    return res.status(404).render('not-found');
  }

  const body = req.body.body?.trim();
  if (!body) {
    addFlash(req, 'error', 'Comment cannot be empty.');
    return res.redirect(`/rfc/${slug}`);
  }

  createComment({ rfcSlug: slug, userId: req.session.user.id, body });
  addFlash(req, 'success', 'Comment posted successfully.');
  res.redirect(`/rfc/${slug}`);
});

app.get('/login', (req, res) => {
  const pendingLogin = req.session.pendingLogin;
  res.render('login', {
    form: { email: pendingLogin?.email || '' },
    awaitingCode: Boolean(pendingLogin)
  });
});

app.post('/login/start', (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  if (!email) {
    addFlash(req, 'error', 'Email is required.');
    return res.redirect('/login');
  }

  let user = findUserByEmail(email);
  if (!user) {
    const result = createUser({ email });
    user = { id: result.lastInsertRowid, email };
  }

  deleteExpiredLoginTokens();
  deleteLoginTokensForUser(user.id);

  const token = String(crypto.randomInt(100000, 1000000));
  const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60;
  createLoginToken({ userId: user.id, token, expiresAt });

  req.session.pendingLogin = { userId: user.id, email: user.email };

  addFlash(
    req,
    'info',
    `A sign-in code has been sent to ${user.email}. (For development use: ${token})`
  );

  res.redirect('/login');
});

app.post('/login/verify', (req, res) => {
  const code = req.body.code?.trim();
  const pendingLogin = req.session.pendingLogin;

  if (!pendingLogin) {
    addFlash(req, 'error', 'Request a sign-in code before verifying.');
    return res.redirect('/login');
  }

  if (!code) {
    addFlash(req, 'error', 'Enter the sign-in code sent to your email.');
    return res.redirect('/login');
  }

  const loginToken = findLoginToken({ userId: pendingLogin.userId, token: code });
  if (!loginToken) {
    addFlash(req, 'error', 'That code is invalid or has expired.');
    return res.redirect('/login');
  }

  deleteLoginTokensForUser(pendingLogin.userId);
  req.session.user = { id: pendingLogin.userId, email: pendingLogin.email };
  delete req.session.pendingLogin;
  addFlash(req, 'success', 'Signed in successfully.');
  res.redirect('/');
});

app.get('/register', (req, res) => {
  addFlash(
    req,
    'info',
    'Create an account by entering your email on the sign-in page to receive a code.'
  );
  res.redirect('/login');
});

app.post('/register', (req, res) => {
  res.redirect('/login');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.use((req, res) => {
  res.status(404).render('not-found');
});

app.listen(PORT, () => {
  console.log(`RFC app listening on http://localhost:${PORT}`);
});
