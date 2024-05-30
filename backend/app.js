require("./config");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const bookRouter = require("./app/books/routes");
const studentRouter = require("./app/students/routes");
const transactionRouter = require("./app/transaction/routes");
const inventoryRouter = require("./app/inventory/routes");
const reportRouter = require("./app/report/routes");

const logger = require("morgan");

app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/", bookRouter);
app.use("/api/", studentRouter);
app.use("/api/", transactionRouter);
app.use("/api/", inventoryRouter);
app.use("/api/", reportRouter);

app.use((req, res, next) => {
  res.status(404);
  res.send({
    status: "Failed",
    message: "Resource" + req.originalUrl + " not found",
  });
});

app.listen(3000, () => console.log("Server:http://localhost:3000"));
