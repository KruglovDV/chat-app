import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import http from 'http';
import express from 'express';
import hbs from 'hbs';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io';
import sharedSession from 'express-socket.io-session';

import auth from './auth.js';
import userController from './controllers/user.controller.js';
import chatController from './controllers/chat.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const STATIC_PATH = path.join(__dirname, '../public');
const PARTIALS_PATH = path.join(__dirname, 'views/templates/partials');
const { SESSION_SECRET } = process.env;
const { MONGODB_URL } = process.env;

const sessConfig = {
  secret: SESSION_SECRET,
  store: MongoStore.create({ mongoUrl: MONGODB_URL }),
  saveUninitialized: false,
  resave: false,
  cookie: {},
};

const startApp = async () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  hbs.registerPartials(PARTIALS_PATH);
  await mongoose.connect(MONGODB_URL);

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessConfig.cookie.secure = true;
  }

  if (NODE_ENV === 'development') {
    const livereload = await import('livereload'); // eslint-disable-line
    const { default: connectLivereload } = await import('connect-livereload'); // eslint-disable-line

    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, 'public'));
    liveReloadServer.server.once('connection', () => {
      setTimeout(() => {
        liveReloadServer.refresh('/chat');
      }, 100);
    });
    app.use(connectLivereload());
  }
  const sess = session(sessConfig);

  io.use(sharedSession(sess, { autoSave: true }));
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'views'));
  app.set('view options', { layout: 'layouts/layout' });
  app.use(sess);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(STATIC_PATH));
  app.use(userController);

  // TODO move to separate file
  app.get('/', auth, (req, res) => {
    res.render('templates/index');
  });

  // TODO move to separate file
  app.get('/chat', auth, (req, res) => {
    res.render('templates/chat');
  });
  app.get('*', (req, res) => { // должен быть самым последним обработчиком
    res.send('404');
  });

  io.on('connection', chatController(io));

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`app listening on port ${PORT}`);
  });
};

export default startApp;
