import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import router from './routes/estebanquito.routes.js';
const app = express();

// configuraacion
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:8081' }));
app.use(express.json());

// Routes
app.use(router);

const corsOptions = {
  origin: 'http://localhost/8081',
};

app.use(cors({ corsOptions }));
// Exporto el modulo
export default app;
