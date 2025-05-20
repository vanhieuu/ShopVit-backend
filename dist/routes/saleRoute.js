"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saleController_1 = require("../controllers/saleController");
const saleRouter = (0, express_1.Router)();
// Bán hàng
saleRouter.post('/', saleController_1.createSale);
exports.default = saleRouter;
