// frontend/lib/db.server.js
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// التأكد من وجود مجلد data
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'deal-erp.db');
const db = new Database(dbPath);

// إنشاء جميع الجداول فوراً عند تحميل الملف
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS raw_materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      unit TEXT DEFAULT 'كجم',
      stock REAL DEFAULT 0,
      cost REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ raw_materials table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL DEFAULT 0,
      bom TEXT DEFAULT '[]',
      labor TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ products table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS work_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      product_name TEXT,
      quantity REAL DEFAULT 0,
      completed REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      material_cost REAL DEFAULT 0,
      labor_cost REAL DEFAULT 0,
      total_cost REAL DEFAULT 0,
      date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ work_orders table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS production_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      hourly_rate REAL DEFAULT 0,
      hours REAL DEFAULT 0.5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ production_steps table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS mfg_suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ mfg_suppliers table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      revenue REAL DEFAULT 0,
      progress REAL DEFAULT 0,
      end_date TEXT,
      manager TEXT,
      status TEXT DEFAULT 'active',
      health TEXT DEFAULT 'good',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ projects table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      salary REAL DEFAULT 0,
      phone TEXT,
      project_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ workers table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'operational',
      cost REAL DEFAULT 0,
      project_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ equipment table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      unit TEXT DEFAULT 'طن',
      price REAL DEFAULT 0,
      current_stock TEXT DEFAULT '{"main":0}',
      min_stock REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ materials table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ suppliers table ready');

  console.log('🎉 All tables created successfully!');
} catch (error) {
  console.error('Error creating tables:', error);
}

export default db;
