# הגדרת משתני סביבה (.env)

## יצירת קובץ .env

הקובץ `.env` נמצא בתיקיית `server/` ומכיל את כל ההגדרות הסודיות של הפרויקט.

## שלבים:

### 1. יצירת הקובץ
אם הקובץ לא קיים, העתק את `server/config/env.example` ל-`server/.env`:

**Windows (PowerShell):**
```powershell
Copy-Item server\config\env.example server\.env
```

**Windows (CMD):**
```cmd
copy server\config\env.example server\.env
```

**Linux/Mac:**
```bash
cp server/config/env.example server/.env
```

### 2. עדכון הערכים

פתח את `server/.env` ועדכן את הערכים הבאים:

```env
# מסד נתונים MySQL
DB_HOST=localhost              # כתובת השרת
DB_USER=root                   # שם משתמש MySQL
DB_PASSWORD=                   # סיסמה של MySQL (ריק אם אין סיסמה)
DB_NAME=smart_meeting_db       # שם מסד הנתונים

# שרת
PORT=3000                      # פורט השרת

# אבטחה
JWT_SECRET=your_secret_key_change_this_in_production  # מפתח סודי ל-JWT (שנה בהפקה!)

# AI Service
GEMINI_API_KEY=your_gemini_api_key_here  # מפתח API מ-Google Gemini
```

### 3. קבלת מפתח Gemini API

1. היכנס ל-[Google AI Studio](https://makersuite.google.com/app/apikey)
2. התחבר עם חשבון Google שלך
3. לחץ על "Create API Key"
4. העתק את המפתח והדבק ב-`GEMINI_API_KEY`

### 4. יצירת מסד נתונים

וודא ש-MySQL מותקן ורץ, ואז צור את מסד הנתונים:

```sql
CREATE DATABASE IF NOT EXISTS smart_meeting_db;
```

או דרך MySQL Workbench / phpMyAdmin.

### 5. בדיקה

לאחר עדכון ה-.env, הפעל מחדש את השרת:

```bash
npm run dev
```

אמור לראות:
- ✅ Connected to MySQL Database successfully!
- ✅ AI Service initialized

## פתרון בעיות

### שגיאה: "Access denied for user 'root'@'localhost'"

**פתרון:**
1. ודא ש-MySQL רץ
2. ודא שה-`DB_USER` ו-`DB_PASSWORD` נכונים
3. אם אין סיסמה, השאר את `DB_PASSWORD` ריק: `DB_PASSWORD=`
4. אם יש סיסמה, ודא שהיא נכונה: `DB_PASSWORD=your_password`

### שגיאה: "GEMINI_API_KEY לא הוגדר"

**פתרון:**
1. ודא שהקובץ `server/.env` קיים
2. ודא שיש שורה: `GEMINI_API_KEY=your_actual_key`
3. ודא שאין רווחים לפני או אחרי ה-`=`
4. הפעל מחדש את השרת

### שגיאה: "Database connection failed"

**פתרונות:**
1. ודא ש-MySQL מותקן ורץ
2. בדוק את ההגדרות ב-`.env`
3. ודא שמסד הנתונים נוצר: `CREATE DATABASE smart_meeting_db;`
4. נסה להתחבר ידנית ל-MySQL כדי לוודא שהפרטים נכונים

## אבטחה

⚠️ **חשוב מאוד:**
- לעולם אל תעלה את קובץ ה-`.env` ל-GitHub או לכל מקום פומבי!
- הוסף את `.env` ל-`.gitignore`
- השתמש במפתחות שונים לסביבות שונות (פיתוח/הפקה)
- שנה את `JWT_SECRET` למשהו חזק וייחודי בהפקה
