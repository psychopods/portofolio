import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

// Store db in the root of the project
const dbPath = path.resolve(process.cwd(), 'data.db');
const db = new Database(dbPath, { timeout: 8000 });

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Cleanup expired sessions on startup
try {
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
} catch (err) {
  console.error("Expired sessions startup cleanup failed:", err);
}

export function cleanupSessions() {
  try {
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
  } catch (err) {
    console.error("Session cleanup error:", err);
  }
}

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_tags TEXT NOT NULL, -- Store as JSON array of strings
    github_link TEXT,
    live_link TEXT,
    order_index INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'systems' | 'cross-platform' | 'backend-web'
    is_active INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS status_update (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS portfolio_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL
  );
`);

// Seed default data if empty
function seedDatabase() {
  // Check if settings are seeded
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM portfolio_settings').get() as { count: number };
  if (settingsCount.count === 0) {
    console.log('Seeding initial portfolio_settings data...');
    const insertSetting = db.prepare('INSERT INTO portfolio_settings (key, value) VALUES (?, ?)');
    
    insertSetting.run('dev_name', 'Paschal Joseph');
    insertSetting.run('dev_role', 'Systems Architect & Developer');
    insertSetting.run('dev_languages', 'Rust, Kotlin, Python, Java, SQL');
    insertSetting.run('dev_focus', 'Rust Core logic & Kotlin Multiplatform');
    insertSetting.run('hero_title', 'Systems Architect & Cross-Platform Developer');
    insertSetting.run('hero_description', 'Systems-focused software developer specializing in Rust core logic and Kotlin Multiplatform (KMP). Experienced in building high-performance backend telemetry services, distributed database systems, and serial port hardware integrations.');
    insertSetting.run('about_title', '01. Technical Mindset');
    insertSetting.run('about_description_1', 'I design software with a focus on resource constraints and execution runtime efficiency. Whether hacking on Rust memory allocations, optimizing an OpenGL vertex buffer, or building a local database schema with SQLite, my philosophy remains the same: pragmatic, structured, and fast.');
    insertSetting.run('about_description_2', 'Having worked across low-level architectures and high-level client applications, I specialize in bridging the gap. I build offline-first desktop and mobile tools using Compose Multiplatform and Kotlin Coroutines, ensuring fluid performance even without network dependency.');
    insertSetting.run('about_description_3', 'I thrive on learning and adapting. I view programming languages as tools to model systems—picking up a new API surface or architecture is part of the engineering loop.');
    insertSetting.run('about_philosophy', 'Build local-first, compile static, optimize everything.');
    insertSetting.run('contact_email', 'paschaltimoth@gmx.us');
    insertSetting.run('contact_github', 'github.com/psychopods');
    insertSetting.run('contact_linkedin', 'linkedin.com/in/paschaltimoth');
    insertSetting.run('contact_resume_link', '/Paschal_Joseph_Resume.odt');
    insertSetting.run('contact_description', 'Interested in starting a project, collaborating on compilers, or looking for a polyglot engineer to reinforce your systems/client pipelines? Let\'s connect through the shell block on the right or reach out directly.');
    insertSetting.run('bento_systems_desc', 'Writing memory-safe code, raw OS interactions, native performance, and targeted WASM compiler systems.');
    insertSetting.run('bento_crossplatform_desc', 'Designing elegant application structures, offline-first client syncing, and multi-runtime desktop/mobile apps.');
    insertSetting.run('bento_backendweb_desc', 'Structuring hyper-fast server-side endpoints, microservices, local storage configurations, and database query layers.');
  }

  // Check if projects table is empty
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  if (projectCount.count === 0) {
    console.log('Seeding initial projects data from resume...');
    const insertProject = db.prepare(`
      INSERT INTO projects (title, description, tech_tags, github_link, live_link, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertProject.run(
      'CublocksV2 Ecosystem',
      'A cross-platform visual programming tool. Spearheaded development by implementing the high-performance core logic in Rust and transitioning the frontend editor to Kotlin Multiplatform (KMP) for unified deployment.',
      JSON.stringify(['Rust', 'Kotlin Multiplatform', 'Blockly', 'Visual Coding', 'Cross-Platform']),
      'https://github.com/psychopods/cublocks-v2',
      null,
      0
    );

    insertProject.run(
      'Serial Hardware Comm Control',
      'Developed serial port communication protocols (/dev/ttyUSB0) and hardware-software layers for serial/UART telemetry communication systems on Linux hosts.',
      JSON.stringify(['Rust', 'Serial/UART', 'Hardware Integration', 'Telemetry Systems', 'Linux']),
      'https://github.com/psychopods/serial-comm',
      null,
      1
    );

    insertProject.run(
      'Distributed Telemetry Automator',
      'Designed and deployed backend telemetry loggers, SSL certificate domain configurations, and distributed database services using SQL Server and MongoDB.',
      JSON.stringify(['Java', 'JavaScript', 'SQL Server', 'MongoDB', 'SSL/TLS', 'Backend Architectures']),
      'https://github.com/psychopods/telemetry-automator',
      null,
      2
    );
  }

  // Check if skills table is empty
  const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get() as { count: number };
  if (skillCount.count === 0) {
    console.log('Seeding initial skills data...');
    const insertSkill = db.prepare(`
      INSERT INTO skills (name, category, is_active, order_index)
      VALUES (?, ?, ?, ?)
    `);

    // Systems
    insertSkill.run('Rust (Core Logic)', 'systems', 1, 0);
    insertSkill.run('Java', 'systems', 1, 1);
    insertSkill.run('Python', 'systems', 1, 2);
    insertSkill.run('Linux Power User', 'systems', 1, 3);

    // Cross-Platform
    insertSkill.run('Kotlin Multiplatform (KMP)', 'cross-platform', 1, 0);
    insertSkill.run('Block-based Coding (Blockly)', 'cross-platform', 1, 1);
    insertSkill.run('Android Studio & Native', 'cross-platform', 1, 2);

    // Backend & Web
    insertSkill.run('SQL Server / SQLite / MongoDB', 'backend-web', 1, 0);
    insertSkill.run('Serial/UART integrations', 'backend-web', 1, 1);
    insertSkill.run('Telemetry Systems', 'backend-web', 1, 2);
    insertSkill.run('HTML / CSS / JavaScript', 'backend-web', 1, 3);
  }

  // Check if status is empty
  const statusCount = db.prepare('SELECT COUNT(*) as count FROM status_update').get() as { count: number };
  if (statusCount.count === 0) {
    console.log('Seeding initial status data...');
    const insertStatus = db.prepare(`
      INSERT INTO status_update (status, updated_at)
      VALUES (?, ?)
    `);
    insertStatus.run(
      'Transitioning the CublocksV2 frontend editor to Kotlin Multiplatform (KMP) for unified release.',
      new Date().toISOString()
    );
  }

  // Check if admin password is set
  const adminPassword = db.prepare('SELECT value FROM admin_settings WHERE key = ?').get('password_hash') as { value: string } | undefined;
  if (!adminPassword) {
    console.log('Generating default admin password hash...');
    const rawPassword = process.env.ADMIN_PASSWORD || 'admin';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);
    
    const insertSetting = db.prepare('INSERT OR REPLACE INTO admin_settings (key, value) VALUES (?, ?)');
    insertSetting.run('password_hash', hash);
    console.log(`Admin password initialized (Default: '${rawPassword}'). You can customize it by setting ADMIN_PASSWORD in environment.`);
  }
}

seedDatabase();

export default db;
