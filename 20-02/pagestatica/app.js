const express = require('express');
const app = express();
const path=require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Rutas 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bienvenida.html'));

});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
  

