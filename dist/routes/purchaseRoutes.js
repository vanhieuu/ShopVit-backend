"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchaseController_1 = require("../controllers/purchaseController");
const purchaseRouter = (0, express_1.Router)();
// Nhập hàng
purchaseRouter.post('/', purchaseController_1.createPurchase);
exports.default = purchaseRouter;
