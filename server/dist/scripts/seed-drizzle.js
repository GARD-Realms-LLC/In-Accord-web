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
exports.seedUsers = seedUsers;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../src/db");
const schema_1 = require("../src/schema");
function seedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const dataPath = path_1.default.resolve(__dirname, '..', 'data', 'users.json');
        if (!fs_1.default.existsSync(dataPath)) {
            console.warn('No users.json found at', dataPath);
            return;
        }
        const raw = fs_1.default.readFileSync(dataPath, 'utf8');
        let entries = [];
        try {
            entries = JSON.parse(raw);
        }
        catch (err) {
            console.error('Failed to parse users.json', err);
            return;
        }
        for (const u of entries) {
            try {
                // Upsert-like behaviour: try insert, ignore on conflict
                yield db_1.db.insert(schema_1.users).values({
                    userId: (_b = (_a = u.userId) !== null && _a !== void 0 ? _a : u.id) !== null && _b !== void 0 ? _b : String(u.id || Date.now()),
                    name: (_d = (_c = u.name) !== null && _c !== void 0 ? _c : u.displayName) !== null && _d !== void 0 ? _d : '',
                    email: (_e = u.email) !== null && _e !== void 0 ? _e : '',
                    website: (_f = u.website) !== null && _f !== void 0 ? _f : null,
                    githubLogin: (_g = u.githubLogin) !== null && _g !== void 0 ? _g : null,
                    discordLogin: (_h = u.discordLogin) !== null && _h !== void 0 ? _h : null,
                    description: (_j = u.description) !== null && _j !== void 0 ? _j : null,
                    lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
                }).onConflictDoNothing();
            }
            catch (e) {
                console.warn('Failed inserting user', u, (_k = e === null || e === void 0 ? void 0 : e.message) !== null && _k !== void 0 ? _k : e);
            }
        }
        console.log('Seed complete: users (attempted)', entries.length);
    });
}
if (require.main === module) {
    seedUsers()
        .then(() => process.exit(0))
        .catch((err) => {
        console.error('Seed failed', err);
        process.exit(1);
    });
}
