const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/cliente.html');
});

app.post('/calcular', (req, res) => {
    const { operacion, a, b } = req.body;
    let resultado;
    switch (operacion) {
        case 'sumar':
            resultado = a + b;
            break;
        case 'restar':
            resultado = a - b;
            break;
        case 'multiplicar':
            resultado = a * b;
            break;
        case 'dividir':
            resultado = a / b;
            break;
    }
    res.json({ respuesta: `El resultado de la operacion ${operacion} es: ${resultado}` });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});