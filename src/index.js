import app from './app.js';

const main = () => {
  app.listen(app.get('port'));
  console.log('La app esta escuchando por el puerto(server on port:): ', app.get('port'));
};

main();
