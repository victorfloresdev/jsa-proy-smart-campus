import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Servidor Backend Smart Campus`);
  console.log(` Escuchando en: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
