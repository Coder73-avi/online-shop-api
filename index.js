require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const router = require("./router/router");
const server = express();
const port = process.env.PORT || 4000;

server.use(express.json());
server.use(cookieParser());
server.use(cors({ origin: "*" }));
server.use("/", express.static("public"));
server.use(router);

server.listen(port, () => console.log(`Server stated with port ${port}`));
