"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../.env')
});
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const purchaseRoutes_1 = __importDefault(require("./routes/purchaseRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const saleRoute_1 = __importDefault(require("./routes/saleRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Kết nối MongoDB
const MONGO_URI = process.env.MONGO_URI || '';
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
// Mount routers with version prefix v1
app.use('/api/v1/products', productRoutes_1.default);
app.use('/api/v1/purchase', purchaseRoutes_1.default);
app.use('/api/v1/sale', saleRoute_1.default);
app.use('/api/v1/report', reportRoutes_1.default);
app.use('/api/v1/invoice', invoiceRoutes_1.default);
// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});
// Start server
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
