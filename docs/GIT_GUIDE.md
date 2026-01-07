# מדריך Git - העלאת הפרויקט

## מה להשאיר ומה לא להעלות

### ✅ **חייב להשאיר (לא להתעלם):**
- `server/config/env.example` - תבנית של משתני סביבה (ללא סודות)
- `package.json` - תלויות הפרויקט
- כל הקבצים בקוד (`.js`, `.html`, `.css`)
- `README.md` - תיעוד
- `.gitignore` - קובץ זה!

### ❌ **אסור להעלות (בגלל .gitignore):**
- `server/.env` - **חשוב מאוד!** מכיל מפתחות API וסודות
- `node_modules/` - תלויות (נטען עם `npm install`)
- כל קבצי `.log`
- קבצי מערכת (`.DS_Store`, `Thumbs.db`, וכו')
- קבצי IDE (`.vscode/`, `.idea/`, וכו')

---

## שלבים להעלאה ל-GitHub

### 1. בדיקה לפני commit

```bash
# בדוק מה שונה
git status

# ודא ש-.env לא מופיע ברשימה!
```

אם אתה רואה `server/.env` ברשימה, זה מסוכן! אל תעשה commit.

### 2. הוסף קבצים ל-staging

```bash
# הוסף את כל הקבצים החשובים
git add .

# או באופן סלקטיבי:
git add index.html
git add test-ai.html
git add server/
git add client/
git add package.json
```

### 3. Commit

```bash
git commit -m "Initial commit: Smart Meeting Platform with AI features"
```

### 4. צור Repository ב-GitHub

1. היכנס ל-GitHub.com
2. לחץ על "New repository"
3. תן שם (למשל: `smart-meeting-ai`)
4. אל תסמן "Initialize with README" (כבר יש לך קבצים)
5. לחץ "Create repository"

### 5. העלה את הקוד

```bash
# הוסף remote
git remote add origin https://github.com/YOUR_USERNAME/smart-meeting-ai.git

# העלה
git branch -M main
git push -u origin main
```

---

## אבטחה - קריטי!

### ⚠️ **לעולם אל תעלה:**
- `server/.env` - מכיל מפתחות API סודיים!
- `GEMINI_API_KEY` - מפתח Google AI
- `JWT_SECRET` - מפתח אבטחה
- סיסמאות MySQL

### ✅ **במקום זה:**
1. השאר את `server/config/env.example` - זה בטוח
2. אחרים יכתבו את הערכים שלהם ב-`.env` מקומי
3. הוסף README עם הוראות להגדרה

---

## אם כבר העלית .env בטעות:

### מיד תקן את זה:

```bash
# 1. מחק את הקובץ מה-Git history
git rm --cached server/.env

# 2. הוסף ל-.gitignore (כבר יש)
echo "server/.env" >> .gitignore

# 3. Commit את השינויים
git commit -m "Remove .env from repository"

# 4. Force push (זהירות!)
git push --force

# 5. חשוב: שנה את כל המפתחות ב-.env שלך!
# כי הם כבר נחשפו ב-GitHub
```

---

## בדיקה מהירה:

לפני כל commit, הרץ:

```bash
# בדוק מה עומד להיכנס
git status

# ודא שאין .env ברשימה
git status | grep .env

# אם אין תוצאות - טוב! ✅
```

---

## טיפים:

1. **תמיד בדוק `git status` לפני commit**
2. **אל תשכח את `env.example`** - זה עוזר לאחרים
3. **תיעד את המשתנים ב-README** - מה צריך להיות ב-`.env`
4. **שנה מפתחות אחרי כל חשיפה** - אם העלית בטעות

---

## דוגמה ל-README עבור אחרים:

```markdown
## הגדרה ראשונית

1. העתק את `server/config/env.example` ל-`server/.env`
2. עדכן את הערכים ב-`.env`:
   - `GEMINI_API_KEY` - מפתח מ-Google AI Studio
   - `DB_PASSWORD` - סיסמת MySQL שלך
   - וכו'
```

---

**זכור: אבטחה לפני הכל! 🔒**
