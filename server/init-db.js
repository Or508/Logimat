const db = require('./models/db');

const createTables = async () => {
    try {
        const queries = [
            `CREATE DATABASE IF NOT EXISTS smart_meeting_db`,
            `USE smart_meeting_db`,

            `CREATE TABLE IF NOT EXISTS clients (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NULL,
                phone VARCHAR(20) NULL,
                registration_date DATE NOT NULL DEFAULT (CURRENT_DATE),
                registration_time TIME NOT NULL DEFAULT (CURRENT_TIME),
                is_connected BOOLEAN NOT NULL DEFAULT FALSE,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uq_clients_email (email),
                UNIQUE KEY uq_clients_phone (phone)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

            `CREATE TABLE IF NOT EXISTS tokens (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                client_id INT UNSIGNED NOT NULL,
                token VARCHAR(128) NOT NULL,
                expiry_date DATETIME NOT NULL,
                used BOOLEAN NOT NULL DEFAULT FALSE,
                is_connected BOOLEAN NOT NULL DEFAULT FALSE,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uq_tokens_token (token),
                CONSTRAINT fk_tokens_client FOREIGN KEY (client_id) REFERENCES clients(id) ON UPDATE CASCADE ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

            `CREATE TABLE IF NOT EXISTS admins (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('superadmin','editor') NOT NULL DEFAULT 'editor',
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uq_admins_username (username)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

            `CREATE TABLE IF NOT EXISTS projects (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                type ENUM('Website','CRM','Restaurant','Dashboard','Other') NOT NULL,
                title VARCHAR(120) NOT NULL,
                description TEXT NULL,
                min_budget INT UNSIGNED NOT NULL,
                max_budget INT UNSIGNED NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                KEY idx_projects_budget (min_budget, max_budget),
                KEY idx_projects_type (type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

            `CREATE TABLE IF NOT EXISTS availability_slots (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                slot_datetime DATETIME NOT NULL,
                duration_min INT UNSIGNED NOT NULL DEFAULT 60,
                is_open BOOLEAN NOT NULL DEFAULT TRUE,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uq_slot_datetime (slot_datetime)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

            `CREATE TABLE IF NOT EXISTS meetings (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                client_id INT UNSIGNED NOT NULL,
                slot_id INT UNSIGNED NOT NULL,
                comment TEXT NULL,
                status ENUM('pending','approved','declined','did_not_show','completed') NOT NULL DEFAULT 'pending',
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uq_meeting_slot (slot_id),
                CONSTRAINT fk_meetings_client FOREIGN KEY (client_id) REFERENCES clients(id) ON UPDATE CASCADE ON DELETE RESTRICT,
                CONSTRAINT fk_meetings_slot FOREIGN KEY (slot_id) REFERENCES availability_slots(id) ON UPDATE CASCADE ON DELETE RESTRICT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

            `CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'super_admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

            `CREATE TABLE IF NOT EXISTS user_projects (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                prompt_used TEXT,
                ai_response_json LONGTEXT,
                is_sold BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

            `CREATE TABLE IF NOT EXISTS system_stats (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                total_visits INT DEFAULT 0,
                total_projects_generated INT DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
        ];

        for (const query of queries) {
            await db.query(query);
            console.log(`Executed: ${query.substring(0, 50)}...`);
        }

        console.log('✅ Base Database Initialized Successfully');
        process.exit();

    } catch (error) {
        console.error('❌ Failed to init DB:', error);
        process.exit(1);
    }
};

createTables();