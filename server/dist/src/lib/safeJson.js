"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeTryParseString = safeTryParseString;
exports.safeReadJsonSync = safeReadJsonSync;
exports.safeReadJson = safeReadJson;
exports.safeWriteJsonSync = safeWriteJsonSync;
exports.safeWriteJson = safeWriteJson;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
function tryParse(raw) {
    try {
        return JSON.parse(raw);
    }
    catch (err) {
        try {
            const sanitized = raw
                .replace(/\/\/.*$/gm, '')
                .replace(/,\s*([}\]])/gm, '$1');
            return JSON.parse(sanitized);
        }
        catch (err2) {
            return null;
        }
    }
}
function safeTryParseString(raw) {
    if (typeof raw !== 'string')
        return null;
    try {
        return tryParse(raw);
    }
    catch (_a) {
        return null;
    }
}
function safeReadJsonSync(filePath, defaultValue = null) {
    try {
        if (!fs_1.default.existsSync(filePath))
            return defaultValue;
        const raw = fs_1.default.readFileSync(filePath, 'utf8');
        const parsed = tryParse(raw);
        return parsed === null ? defaultValue : parsed;
    }
    catch (e) {
        return defaultValue;
    }
}
function safeReadJson(filePath_1) {
    return __awaiter(this, arguments, void 0, function* (filePath, defaultValue = null) {
        try {
            yield promises_1.default.access(filePath).catch(() => { throw new Error('NOFILE'); });
            const raw = yield promises_1.default.readFile(filePath, 'utf8');
            const parsed = tryParse(raw);
            return parsed === null ? defaultValue : parsed;
        }
        catch (e) {
            return defaultValue;
        }
    });
}
function safeWriteJsonSync(filePath, obj) {
    try {
        fs_1.default.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
        return true;
    }
    catch (e) {
        return false;
    }
}
function safeWriteJson(filePath, obj, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield promises_1.default.writeFile(filePath, JSON.stringify(obj, null, 2), options);
            return true;
        }
        catch (e) {
            return false;
        }
    });
}
