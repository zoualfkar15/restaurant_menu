"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsController = void 0;
const common_1 = require("@nestjs/common");
const restaurants_service_1 = require("./restaurants.service");
const analytics_service_1 = require("../analytics/analytics.service");
const products_service_1 = require("../products/products.service");
let RestaurantsController = class RestaurantsController {
    constructor(restaurants, analytics, products) {
        this.restaurants = restaurants;
        this.analytics = analytics;
        this.products = products;
    }
    async getProduct(slug, productSlug) {
        return this.products.findBySlug(slug, productSlug);
    }
    async getCatalog(slug) {
        return this.restaurants.getCatalogBySlug(slug);
    }
    async getMenu(slug) {
        return this.restaurants.getCatalogBySlug(slug);
    }
    async recordMenuView(slug) {
        return this.analytics.recordMenuView(slug);
    }
    async recordQrScan(slug) {
        return this.analytics.recordQrScan(slug);
    }
    async getProfile(slug) {
        return this.restaurants.getPublicProfile(slug);
    }
};
exports.RestaurantsController = RestaurantsController;
__decorate([
    (0, common_1.Get)(':slug/products/:productSlug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('productSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Get)(':slug/catalog'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getCatalog", null);
__decorate([
    (0, common_1.Get)(':slug/menu'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Post)(':slug/menu/view'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "recordMenuView", null);
__decorate([
    (0, common_1.Post)(':slug/qr/scan'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "recordQrScan", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getProfile", null);
exports.RestaurantsController = RestaurantsController = __decorate([
    (0, common_1.Controller)('restaurants'),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService,
        analytics_service_1.AnalyticsService,
        products_service_1.ProductsService])
], RestaurantsController);
//# sourceMappingURL=restaurants.controller.js.map