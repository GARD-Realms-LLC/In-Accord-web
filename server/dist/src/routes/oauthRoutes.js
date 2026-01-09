"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauthControllers_1 = __importDefault(require("../controllers/oauthControllers"));
const router = (0, express_1.Router)();
router.get('/github/url', oauthControllers_1.default.githubAuthUrl);
router.get('/github/callback', oauthControllers_1.default.githubCallback);
router.get('/discord/url', oauthControllers_1.default.discordAuthUrl);
router.get('/discord/callback', oauthControllers_1.default.discordCallback);
router.get('/status', oauthControllers_1.default.integrationStatus);
exports.default = router;
