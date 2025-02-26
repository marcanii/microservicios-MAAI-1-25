const fs = require("fs");

fs.promises.readFile("MiArchivo.txt", "utf8")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
