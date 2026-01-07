const fs = require('fs');
const path = require('path');

// מבנה הפרויקט המלא
const structure = {
  dirs: [
    'client/pages/home',
    'client/pages/about',
    'client/pages/projects',
    'client/pages/meeting',
    'client/modules/token',
    'client/modules/ui',
    'client/assets/images',
    'client/assets/icons',
    'client/assets/videos',
    'client/css',
    'admin/login',
    'admin/dashboard',
    'server/routes',
    'server/controllers',
    'server/services',
    'server/models',
    'server/middlewares',
    'server/utils',
    'server/config',
    'server/tests',
    'server/sql', 
    'docs'
  ],
  files: [
    // Client - Home
    { path: 'client/pages/home/home.html', content: '' },
    { path: 'client/pages/home/home.css', content: '/* Home Page Styles */' },
    { path: 'client/pages/home/home.js', content: '// Home Page Logic\nconsole.log("Home loaded");' },

    // Client - About
    { path: 'client/pages/about/about.html', content: '' },
    { path: 'client/pages/about/about.css', content: '/* About Page Styles */' },
    { path: 'client/pages/about/about.js', content: '// About Page Logic' },

    // Client - Projects
    { path: 'client/pages/projects/projects.html', content: '' },
    { path: 'client/pages/projects/projects.css', content: '/* Projects Page Styles */' },
    { path: 'client/pages/projects/projects.js', content: '// Fetch projects filtered by budget range and type' },

    // Client - Meeting
    { path: 'client/pages/meeting/meeting.html', content: '' },
    { path: 'client/pages/meeting/meeting.css', content: '/* Meeting Page Styles */' },
    { path: 'client/pages/meeting/meeting.js', content: '// Handle booking logic and slot selection' },

    // Client - Modules
    { path: 'client/modules/token/token.js', content: '// Handle one-time tokens (create/verify/refresh)' },
    { path: 'client/modules/token/tokenValidator.js', content: '// Validate token format/expiry/usage' },
    { path: 'client/modules/ui/components.js', content: '// Small UI helpers (modals, toasts)' },
    { path: 'client/modules/ui/forms.js', content: '// Form validation helpers' },
    
    // Client - CSS Global
    { path: 'client/css/globals.css', content: ':root {\n  --primary-color: #333;\n}\n\n/* Global Reset */\n* { box-sizing: border-box; margin: 0; padding: 0; }' },

    // Admin - Login
    { path: 'admin/login/admin-login.html', content: '' },
    { path: 'admin/login/admin-login.css', content: '/* Admin Login Styles */' },
    { path: 'admin/login/admin-login.js', content: '// Submit admin credentials and store JWT in sessionStorage' },

    // Admin - Dashboard
    { path: 'admin/dashboard/dashboard.html', content: '' },
    { path: 'admin/dashboard/dashboard.css', content: '/* Dashboard Styles */' },
    { path: 'admin/dashboard/dashboard.js', content: '// Admin Dashboard Logic (CRUD, Charts)' },

    // Server - Config
    { path: 'server/config/env.example', content: 'DB_HOST=localhost\nDB_USER=root\nDB_PASS=password\nDB_NAME=smart_meeting_db\nPORT=3000\nJWT_SECRET=secret_key' },
    { path: 'server/config/constants.js', content: 'module.exports = {\n  // Global constants\n};' },

    // Server - Models (DB Connection)
    { path: 'server/models/db.js', content: `const mysql = require('mysql2');\nconst dbConfig = require('../config/constants');\n\n// Create a connection pool\n// const pool = mysql.createPool({...});\n// module.exports = pool;` },
    
    // Server - Entry Point
    { path: 'server/app.js', content: `const express = require('express');\nconst app = express();\n\n// Express app bootstrap\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));` },

    // Server - Routes (Placeholders)
    { path: 'server/routes/auth.routes.js', content: '// Admin auth routes' },
    { path: 'server/routes/client.routes.js', content: '// Register client, token flow' },
    { path: 'server/routes/projects.routes.js', content: '// Public projects listing/filters' },
    { path: 'server/routes/meetings.routes.js', content: '// Slots, booking' },
    { path: 'server/routes/admin.routes.js', content: '// Admin-only CRUD' },

    // Server - Controllers
    { path: 'server/controllers/auth.controller.js', content: '// Admin login/session/JWT' },
    { path: 'server/controllers/client.controller.js', content: '// Register/check email/phone, issue token' },
    { path: 'server/controllers/projects.controller.js', content: '// Read projects & media' },
    { path: 'server/controllers/meetings.controller.js', content: '// Slots & bookings' },
    { path: 'server/controllers/admin.controller.js', content: '// Projects/media/availability/meetings mgmt' },
    
     // Server - SQL Schema (Empty file to be filled)
    { path: 'server/sql/schema.sql', content: '' },

    // Documentation
    { path: 'docs/README.md', content: '# Smart Meeting Platform\n\nDeveloper documentation.' }
  ]
};

// Create Directories
structure.dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create Files
structure.files.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, file.content);
    console.log(`Created file: ${file.path}`);
  }
});

console.log('✅ Project structure created successfully inside SMARTMITHINGPJ!');