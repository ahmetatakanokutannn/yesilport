"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.migrate = migrate;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL ?? "postgresql://yesilport:password@localhost:5432/yesilport"
});
async function migrate() {
    const compiledPath = node_path_1.default.join(__dirname, "schema.sql");
    const sourcePath = node_path_1.default.join(process.cwd(), "src", "db", "schema.sql");
    const schema = node_fs_1.default.readFileSync(node_fs_1.default.existsSync(compiledPath) ? compiledPath : sourcePath, "utf8");
    await exports.pool.query(schema);
}
