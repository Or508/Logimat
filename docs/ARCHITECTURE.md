# ארכיטקטורת המערכת

מסמך זה מסביר את המבנה והארגון של הקוד בפרויקט.

## עקרון עיקרי: Single Responsibility Principle (SRP)

כל קובץ אחראי על **דבר אחד בלבד**, ללא אחריות כפולה או חפיפה.

## מבנה התיקיות

```
server/
├── config/          # הגדרות ומשתני סביבה
│   ├── database.js  # חיבור למסד הנתונים בלבד
│   ├── constants.js # קבועים גלובליים
│   └── env.example  # דוגמה לקובץ .env
│
├── middleware/      # Middleware - פונקציות ביניים
│   ├── auth.middleware.js      # אימות JWT ותפקידים
│   ├── validation.middleware.js # תיקוף נתונים
│   └── error.middleware.js      # טיפול בשגיאות
│
├── services/        # Services - לוגיקה עסקית טהורה
│   ├── auth.service.js      # לוגיקת אימות והתחברות
│   ├── admin.service.js     # פעולות ניהול (CRUD)
│   ├── client.service.js    # ניהול לקוחות
│   ├── meeting.service.js   # ניהול פגישות
│   ├── project.service.js   # ניהול פרויקטים (ציבורי)
│   └── ai.service.js        # תקשורת עם Google AI
│
├── controllers/     # Controllers - רק HTTP handling
│   ├── auth.controller.js
│   ├── admin.controller.js
│   ├── client.controller.js
│   ├── meetings.controller.js
│   ├── projects.controller.js
│   └── ai.controller.js
│
├── routes/          # Routes - ניתוב וטיבול ב-middleware
│   ├── auth.routes.js
│   ├── admin.routes.js
│   ├── client.routes.js
│   ├── meetings.routes.js
│   ├── projects.routes.js
│   └── ai.routes.js
│
└── app.js           # נקודת כניסה - רישום routes ו-middleware

```

## הפרדת אחריות

### 1. **Config** (`server/config/`)
- **אחריות**: הגדרות ומשתני סביבה בלבד
- **לא מכיל**: לוגיקה עסקית, חיבורים פעילים (רק הגדרות)

### 2. **Services** (`server/services/`)
- **אחריות**: כל הלוגיקה העסקית
- **לא מכיל**: HTTP requests/responses, routing
- **מכיל**: קריאות למסד נתונים, עיבוד נתונים, חישובים

**דוגמה:**
```javascript
// auth.service.js - לוגיקה עסקית
exports.loginAdmin = async (username, password) => {
    // בדיקת משתמש, השוואת סיסמאות, יצירת טוקן
    return { token, username };
};
```

### 3. **Controllers** (`server/controllers/`)
- **אחריות**: רק HTTP handling - קבלת requests ושליחת responses
- **לא מכיל**: לוגיקה עסקית (קורא ל-services)
- **מכיל**: קריאה ל-service, עיבוד שגיאות (next), שליחת JSON

**דוגמה:**
```javascript
// auth.controller.js - רק HTTP
exports.login = async (req, res, next) => {
    try {
        const result = await authService.loginAdmin(username, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
```

### 4. **Routes** (`server/routes/`)
- **אחריות**: ניתוב (routing) וטיבול ב-middleware
- **לא מכיל**: לוגיקה עסקית, HTTP handling
- **מכיל**: הגדרת routes, middleware (auth, validation)

**דוגמה:**
```javascript
// admin.routes.js - רק routing
router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.requireRole('admin'));
router.get('/projects', adminController.getAllProjects);
```

### 5. **Middleware** (`server/middleware/`)
- **אחריות**: פונקציות ביניים לפני הגעה ל-controller
- **דוגמאות**: אימות, תיקוף, טיפול בשגיאות

## זרימת בקשה (Request Flow)

```
1. Client → Request
   ↓
2. app.js → Routes (ניתוב)
   ↓
3. Middleware → אימות/תיקוף (אם נדרש)
   ↓
4. Controller → קבלת request, קריאה ל-Service
   ↓
5. Service → לוגיקה עסקית, DB queries
   ↓
6. Controller → קבלת תוצאה, שליחת response
   ↓
7. Error Middleware → טיפול בשגיאות (אם יש)
   ↓
8. Client ← Response
```

## כללים חשובים

1. **Services לעולם לא משתמשים ב-`req` או `res`**
2. **Controllers לעולם לא מכילים SQL queries או לוגיקה עסקית**
3. **Routes רק מנתבים ומטיבלים ב-middleware**
4. **Middleware רק מוסיף/בודק, לא מבצע פעולות עסקיות**

## דוגמאות לשימוש

### יצירת endpoint חדש:

1. **Service** - הוסף את הלוגיקה:
```javascript
// services/example.service.js
exports.doSomething = async (data) => {
    // לוגיקה עסקית
    return result;
};
```

2. **Controller** - הוסף HTTP handling:
```javascript
// controllers/example.controller.js
exports.doSomething = async (req, res, next) => {
    try {
        const result = await exampleService.doSomething(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
```

3. **Route** - הוסף routing:
```javascript
// routes/example.routes.js
router.post('/something', 
    authMiddleware.authenticateToken,
    validationMiddleware.validateRequired(['field1']),
    exampleController.doSomething
);
```

4. **app.js** - הוסף את ה-route:
```javascript
app.use('/api/example', exampleRoutes);
```

## יתרונות המבנה הזה

✅ **קל לתחזוקה** - כל קובץ עושה דבר אחד  
✅ **קל לבדיקה** - כל layer נבדק בנפרד  
✅ **קל להרחבה** - הוספת פיצ'רים לא משפיעה על חלקים אחרים  
✅ **אין כפילויות** - כל לוגיקה במקום אחד  
✅ **קל לקריאה** - ברור איפה לחפש כל דבר
