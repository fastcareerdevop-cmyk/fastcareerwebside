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
exports.checkPostgresConnection = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dns_1 = __importDefault(require("dns"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ensure custom DNS resolution for Neon in local development environments
if (process.env.NODE_ENV !== 'production') {
    const originalLookup = dns_1.default.lookup;
    dns_1.default.setServers(['8.8.8.8', '1.1.1.1']);
    dns_1.default.lookup = function (hostname, options, callback) {
        let cb = callback;
        let opts = options;
        if (typeof options === 'function') {
            cb = options;
            opts = {};
        }
        if (hostname && hostname.includes('neon.tech')) {
            dns_1.default.resolve4(hostname, (err, addresses) => {
                if (err || !addresses || addresses.length === 0) {
                    return originalLookup(hostname, options, callback);
                }
                if (opts && opts.all) {
                    return cb(null, addresses.map(a => ({ address: a, family: 4 })));
                }
                return cb(null, addresses[0], 4);
            });
        }
        else {
            return originalLookup(hostname, options, callback);
        }
    };
}
const connectionString = process.env.DATABASE_URL || '';
const pool = new pg_1.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});
const checkPostgresConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield prisma.user.count();
        console.log(`[PostgreSQL Neon] Connected successfully! Verified ${userCount} users.`);
        return true;
    }
    catch (error) {
        console.error('[PostgreSQL Neon] Connection Warning:', error.message || error);
        return false;
    }
});
exports.checkPostgresConnection = checkPostgresConnection;
exports.default = prisma;
