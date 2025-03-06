const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("form");
});

app.post("/mostrar", (req, res) => {
  let inicio = 0;
  let fin = 0;
  let numero = 0;
  const { operacion } = req.body;
  inicio = parseInt(req.body.inicio);
  fin = parseInt(req.body.fin);
  numero = parseInt(req.body.numero);
  let resultados = [];
  for (let i = inicio; i <= fin; i++) {
    if (operacion === "multiplicar") {
      resultados.push({
        numero,
        operacion: "*",
        variable: i,
        resultado: numero * i,
      });
    } else if (operacion === "dividir") {
      resultados.push({
        numero,
        operacion: "/",
        variable: i,
        resultado: numero / i,
      });
    } else if (operacion === "sumar") {
      resultados.push({
        numero,
        operacion: "+",
        variable: i,
        resultado: numero + i,
      });
    } else if (operacion === "restar") {
      resultados.push({
        numero,
        operacion: "-",
        variable: i,
        resultado: numero - i,
      });
    }
  }
  res.render("tabla", { resultados });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
