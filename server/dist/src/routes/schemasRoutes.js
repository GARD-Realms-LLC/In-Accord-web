"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const safeJson_1 = require("../lib/safeJson");
const router = (0, express_1.Router)();
const dataFile = path_1.default.resolve(__dirname, '..', '..', 'data', 'custom_tables.json');
const ALLOWED_FIELD_TYPES = ['string', 'number', 'boolean', 'date', 'text'];
function readFileSafe() {
    try {
        if (!fs_1.default.existsSync(path_1.default.dirname(dataFile)))
            fs_1.default.mkdirSync(path_1.default.dirname(dataFile), { recursive: true });
        if (!fs_1.default.existsSync(dataFile)) {
            fs_1.default.writeFileSync(dataFile, JSON.stringify({ tables: [] }, null, 2));
        }
        return (0, safeJson_1.safeReadJsonSync)(dataFile, { tables: [] });
    }
    catch (err) {
        console.error('[Schemas] read error', err);
        return { tables: [] };
    }
}
function writeFileSafe(obj) {
    try {
        if (!fs_1.default.existsSync(path_1.default.dirname(dataFile)))
            fs_1.default.mkdirSync(path_1.default.dirname(dataFile), { recursive: true });
        return (0, safeJson_1.safeWriteJsonSync)(dataFile, obj);
    }
    catch (err) {
        console.error('[Schemas] write error', err);
        return false;
    }
}
// Optional API key middleware: if SCHEMAS_API_KEY is set, require it for POST/modify endpoints
function requireApiKey(req, res, next) {
    const key = process.env.SCHEMAS_API_KEY;
    if (!key)
        return next(); // not configured — allow
    const provided = req.headers['x-api-key'] || req.query.api_key || req.headers['authorization'];
    if (!provided) {
        return res.status(401).json({ ok: false, error: 'API key required' });
    }
    // allow either raw header value or Bearer token
    const token = String(provided).replace(/^Bearer\s+/i, '');
    if (token !== key)
        return res.status(403).json({ ok: false, error: 'Invalid API key' });
    return next();
}
function validateTablesPayload(tables) {
    const errors = [];
    if (!Array.isArray(tables)) {
        return { valid: false, errors: ['tables must be an array'] };
    }
    tables.forEach((t, ti) => {
        if (!t || typeof t !== 'object')
            return errors.push(`table[${ti}] must be an object`);
        if (!t.id || typeof t.id !== 'string')
            errors.push(`table[${ti}].id must be a string`);
        if (!t.name || typeof t.name !== 'string')
            errors.push(`table[${ti}].name must be a string`);
        if (!Array.isArray(t.fields))
            return errors.push(`table[${ti}].fields must be an array`);
        t.fields.forEach((f, fi) => {
            if (!f || typeof f !== 'object')
                return errors.push(`table[${ti}].fields[${fi}] must be an object`);
            if (!f.id || typeof f.id !== 'string')
                errors.push(`table[${ti}].fields[${fi}].id must be a string`);
            if (!f.name || typeof f.name !== 'string')
                errors.push(`table[${ti}].fields[${fi}].name must be a string`);
            if (!f.type || typeof f.type !== 'string')
                errors.push(`table[${ti}].fields[${fi}].type must be a string`);
            if (f.type && !ALLOWED_FIELD_TYPES.includes(f.type))
                errors.push(`table[${ti}].fields[${fi}].type must be one of ${ALLOWED_FIELD_TYPES.join(', ')}`);
        });
    });
    return { valid: errors.length === 0, errors };
}
router.get('/', (req, res) => {
    const data = readFileSafe();
    return res.json({ ok: true, tables: data.tables || [] });
});
router.post('/', requireApiKey, (req, res) => {
    const { tables } = req.body;
    const validation = validateTablesPayload(tables);
    if (!validation.valid)
        return res.status(400).json({ ok: false, errors: validation.errors });
    const ok = writeFileSafe({ tables });
    if (!ok)
        return res.status(500).json({ ok: false, error: 'failed to write' });
    return res.json({ ok: true, tables });
});
exports.default = router;
