/**
 * SQLite 数据库
 */
const path = require('path');

const DB_PATH = path.resolve('data/data.db');

module.exports = require('better-sqlite3')(DB_PATH);