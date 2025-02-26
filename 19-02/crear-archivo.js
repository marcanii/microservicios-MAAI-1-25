const fs = require('fs');

const data = 'Esto se escribirá en el archivo';

fs.writeFile('miArchivo.txt', data, (err) => {
  if (err) throw err;
  console.log('El archivo fue creado con éxito!');
});
