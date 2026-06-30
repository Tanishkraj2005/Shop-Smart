const initSqlJs = require('sql.js')
const path = require('path')
const fs = require('fs')

const DB_PATH = path.join(__dirname, 'data', 'shopsmart.db')

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true })
}

let dbInstance = null;

class WrappedStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
  }

  get(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    const stmt = this.db.prepare(this.sql);
    try {
      stmt.bind(flatParams);
      if (stmt.step()) {
        const obj = stmt.getAsObject();
        if (Object.keys(obj).length === 0) return undefined;
        return obj;
      }
      return undefined;
    } finally {
      stmt.free();
    }
  }

  all(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    const stmt = this.db.prepare(this.sql);
    try {
      stmt.bind(flatParams);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      return results;
    } finally {
      stmt.free();
    }
  }

  run(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    const stmt = this.db.prepare(this.sql);
    try {
      stmt.bind(flatParams);
      stmt.step();
    } finally {
      stmt.free();
    }

    let lastInsertRowid = 0;
    let changes = 0;
    
    const stmtRowid = this.db.prepare("SELECT last_insert_rowid() AS id");
    try {
      if (stmtRowid.step()) {
        lastInsertRowid = stmtRowid.getAsObject().id;
      }
    } finally {
      stmtRowid.free();
    }

    const stmtChanges = this.db.prepare("SELECT changes() AS n");
    try {
      if (stmtChanges.step()) {
        changes = stmtChanges.getAsObject().n;
      }
    } finally {
      stmtChanges.free();
    }

    // Save to disk!
    if (this.db.saveToDisk) {
      this.db.saveToDisk();
    }

    return { lastInsertRowid, changes };
  }
}

// Database Wrapper Object
const dbWrapper = {
  prepare(sql) {
    if (!dbInstance) {
      throw new Error("Database not initialized yet.");
    }
    return new WrappedStatement(dbInstance, sql);
  },

  exec(sql) {
    if (!dbInstance) {
      throw new Error("Database not initialized yet.");
    }
    dbInstance.run(sql);
    if (dbInstance.saveToDisk) {
      dbInstance.saveToDisk();
    }
  },

  pragma(str) {
    if (!dbInstance) {
      throw new Error("Database not initialized yet.");
    }
    try {
      dbInstance.run(`PRAGMA ${str}`);
    } catch (e) {
      // Ignore pragma errors in sql.js
    }
  }
};

function initDb() {
  return initSqlJs().then(SQL => {
    let filebuffer = null;
    if (fs.existsSync(DB_PATH)) {
      filebuffer = fs.readFileSync(DB_PATH);
    }
    
    dbInstance = new SQL.Database(filebuffer);
    
    dbInstance.saveToDisk = () => {
      const data = dbInstance.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    };

    // Enable basic WAL support if needed (ignored in WASM but keeps logs clean)
    dbWrapper.pragma('journal_mode = WAL');
    dbWrapper.pragma('foreign_keys = ON');

    // Setup tables
    dbWrapper.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        name      TEXT    NOT NULL,
        email     TEXT    NOT NULL UNIQUE,
        password  TEXT    NOT NULL,
        role      TEXT    NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id            TEXT PRIMARY KEY,
        user_id       TEXT,
        user_email    TEXT,
        items_json    TEXT NOT NULL,
        address_json  TEXT NOT NULL,
        subtotal      REAL NOT NULL,
        shipping      REAL NOT NULL,
        tax           REAL NOT NULL,
        discount      REAL NOT NULL DEFAULT 0,
        coupon_code   TEXT,
        total         REAL NOT NULL,
        payment_method TEXT NOT NULL DEFAULT 'cod',
        status        TEXT NOT NULL DEFAULT 'Confirmed',
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        name       TEXT    NOT NULL,
        text       TEXT    NOT NULL,
        rating     INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_orders_user_id    ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
      CREATE INDEX IF NOT EXISTS idx_reviews_product   ON reviews(product_id);
    `);

    console.log('✅ SQLite WASM database ready at', DB_PATH);
  });
}

module.exports = dbWrapper;
module.exports.initDb = initDb;
