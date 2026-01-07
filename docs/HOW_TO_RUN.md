# איך להריץ את האתר

## שלב 1: הפעלת השרת (Backend)

לפני שתפתח את דפי ה-HTML, **חייב** להפעיל את השרת:

```bash
# התקנת תלויות (אם עדיין לא)
npm install

# הפעלת השרת
npm run dev
```

השרת יפעל על: `http://localhost:3000`

> **חשוב**: בלי השרת פעיל, הדפים לא יוכלו לתקשר עם ה-API!

## שלב 2: פתיחת האתר (Frontend)

יש לך כמה אפשרויות:

### אפשרות 1: דף בית ראשי (מומלץ)
פתח בדפדפן:
```
index.html
```

או דרך Live Server ב-VSCode (לחיצה ימנית על `index.html` → "Open with Live Server")

### אפשרות 2: דפים ספציפיים
- **בדיקת AI**: `test-ai.html`
- **דף בית לקוח**: `client/pages/home/home.html`
- **אודות**: `client/pages/about/about.html`
- **פרויקטים**: `client/pages/projects/projects.html`
- **פגישות**: `client/pages/meeting/meeting.html`
- **התחברות אדמין**: `admin/login/admin-login.html`
- **דאשבורד אדמין**: `admin/dashboard/dashboard.html`

## שלב 3: וידוא שהכל עובד

1. **בדוק שהשרת רץ**: פתח `http://localhost:3000` בדפדפן - צריך לראות: "Smart Meeting Platform API is Running!"

2. **בדוק AI**: פתח `test-ai.html` ונסה ליצור עיצוב

3. **בדוק API**: פתח את הקונסול בדפדפן (F12) ובדוק שאין שגיאות CORS או 404

## פתרון בעיות

### שגיאת CORS
אם אתה רואה שגיאת CORS, וודא שהשרת רץ ושה-`cors` middleware פעיל ב-`app.js`.

### דפים לא טוענים
- ודא שהשרת רץ (`npm run dev`)
- ודא שאתה פותח את ה-HTML דרך HTTP (לא file://) - השתמש ב-Live Server

### API לא עובד
- בדוק שהשרת רץ על פורט 3000
- בדוק את הקונסול בדפדפן לפרטים על השגיאות
- ודא שיש לך קובץ `.env` עם כל המשתנים הנדרשים

## טיפים

- השתמש ב-**Live Server** extension ב-VSCode לפתיחה מהירה
- תמיד הפעל את השרת **לפני** פתיחת הדפים
- בדוק את הקונסול בדפדפן (F12) לראות שגיאות
