const express = require('express');
const app = express();
const path=require('path');
const port = 3000;

/// Configuramos EJS como motor de plantillas
app.set('views', './views');
app.set('view engine', 'ejs');

// Rutas 
app.get('/', (req, res) => {
    const productos = [
        { nombre: 'Manzana', precio: 1.5 },
        { nombre: 'Banana', precio: 0.8 },
        { nombre: 'Naranja', precio: 1.2 }
    ];

    res.render('index', { productos });
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
  

