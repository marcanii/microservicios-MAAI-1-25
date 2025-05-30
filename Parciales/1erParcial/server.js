require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const libroRoutes = require('./routes/libroRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB usando la URI del .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB conectado'))
    .catch(error => console.log('Error en conexión:', error));

// Rutas
app.use('/api', libroRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});