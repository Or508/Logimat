# Smart Meeting Platform

Developer documentation.

## תיעוד

- [ארכיטקטורת המערכת](./ARCHITECTURE.md) - הסבר מפורט על המבנה והארגון של הקוד

## מבנה מהיר

הפרויקט מאורגן לפי **Single Responsibility Principle**:
- **Services** - לוגיקה עסקית
- **Controllers** - HTTP handling
- **Routes** - ניתוב ו-middleware
- **Middleware** - אימות, תיקוף, שגיאות
- **Config** - הגדרות

ראה [ARCHITECTURE.md](./ARCHITECTURE.md) לפרטים מלאים.