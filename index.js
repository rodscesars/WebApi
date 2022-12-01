const express = require("express");
const fs = require("fs");
const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

const router = express.Router();

server.use("/", router);

const store = require("./db.json");

router.get("/", (req, res) => {
  res.send("Conectado!");
});

router.get("/products", (req, res) => {
  res.json(store);
});

router.post("/products", (req, res) => {
  let id = 1;

  const lastproduct = store.products[store.products.length - 1];
  if (lastproduct) {
    id = lastproduct.id + 1;
  }

  let { category, title, description, image, price, quantity, status } =
    req.body;

  store.products.push({
    id,
    category,
    title,
    description,
    image,
    price,
    quantity,
    status,
  });

  fs.writeFile("db.json", JSON.stringify(store, null, 2), function (err) {
    if (err) return res.send("Erro ao cadastrar!");
    return res.send("Produto cadastrado com sucesso!");
  });
});

router.get("/products/:id", (req, res) => {
  const id = req.params.id;

  const product = store.products.find((product) => {
    return product.id == id;
  });

  if (!product) {
    return res.send("Produto não encontrado!");
  }

  return res.json(product);
});

router.put("/products/:id", (req, res) => {
  const id = req.params.id;
  let index = 0;

  const product = store.products.find((product, findIndex) => {
    if (product.id == id) {
      index = findIndex;
      return true;
    }
  });

  if (!product) {
    return res.send("Produto não encontrado!");
  }

  const newproduct = {
    ...product,
    ...req.body,
  };

  store.products[index] = newproduct;

  fs.writeFile("db.json", JSON.stringify(store, null, 2), function (err) {
    if (err) return res.send("Erro ao editar");
    return res.redirect("/products");
  });
});

router.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  const filter = store.products.filter(function (product) {
    return product.id != id;
  });

  store.products = filter;

  fs.writeFile("db.json", JSON.stringify(store, null, 2), function (err) {
    if (err) return res.send("Erro ao deletar!");
    return res.redirect("/products");
  });
});

server.listen(3000, function () {
  console.log("Servidor rodando!");
});
