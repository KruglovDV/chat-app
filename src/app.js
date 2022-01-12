import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from 'express';
import hbs from 'hbs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const STATIC_PATH = path.join(__dirname, '../public');
const PARTIALS_PATH = path.join(__dirname, 'views/templates/partials');

const startApp = async () => {
  hbs.registerPartials(PARTIALS_PATH);
  const app = express();

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

  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'views'));
  app.set('view options', { layout: 'layouts/layout' });
  app.use(express.static(STATIC_PATH));

  app.get('/', (req, res) => {
    res.render('templates/index');
  });
  app.get('/chat', (req, res) => {
    res.render('templates/chat');
  });
  app.get('*', (req, res) => { // должен быть самым последним обработчиком
    res.send('404');
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`app listening on port ${PORT}`);
  });
};

export default startApp;
