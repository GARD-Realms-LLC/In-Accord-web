"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const npmTerminalController_1 = require("../controllers/npmTerminalController");
const router = (0, express_1.Router)();
router.post('/run', npmTerminalController_1.runNpmScript);
exports.default = router;
