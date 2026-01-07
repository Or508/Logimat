const db = require('./models/db');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        console.log('🌱 Starting seed process...');

        // 1. יצירת משתמש אדמין (אם לא קיים)
        const adminEmail = 'admin';
        const plainPassword = 'password123';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // שימוש ב-INSERT IGNORE כדי לא לקבל שגיאה אם הוא כבר קיים
        const [adminResult] = await db.execute(
            `INSERT IGNORE INTO admins (username, password, role) VALUES (?, ?, 'superadmin')`,
            [adminEmail, hashedPassword]
        );

        if (adminResult.affectedRows > 0) {
            console.log(`✅ Admin created! Username: "${adminEmail}", Password: "${plainPassword}"`);
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

        // 2. יצירת פרויקט לדוגמה
        const [projectResult] = await db.execute(
            `INSERT IGNORE INTO projects (type, title, description, min_budget, max_budget) 
             VALUES ('Website', 'Example Website', 'A beautiful responsive website.', 5000, 10000)`
        );

        if (projectResult.affectedRows > 0) {
            console.log('✅ Sample project created!');
        } else {
            console.log('ℹ️ Sample project already exists.');
        }

        console.log('🎉 Seeding completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();