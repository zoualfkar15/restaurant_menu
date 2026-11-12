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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaFallbackFilter = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
let SpaFallbackFilter = class SpaFallbackFilter {
    constructor(clientDir) {
        this.clientDir = clientDir;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        const path = req.path || '';
        if (path.startsWith('/api') || path.startsWith('/uploads')) {
            const status = exception.getStatus();
            res.status(status).json(exception.getResponse());
            return;
        }
        res.sendFile((0, path_1.join)(this.clientDir, 'index.html'));
    }
};
exports.SpaFallbackFilter = SpaFallbackFilter;
exports.SpaFallbackFilter = SpaFallbackFilter = __decorate([
    (0, common_1.Catch)(common_1.NotFoundException),
    __metadata("design:paramtypes", [String])
], SpaFallbackFilter);
//# sourceMappingURL=spa-fallback.filter.js.map