// --- LOGIMATH FLOW CONTROLLER 3.0 ---
const appFlow = {
    isLoggedIn: false,
    userRole: 'guest',

    // --- אתחול המערכת ---
    init: function() {
        this.updateThemeByTime(); // בדיקת שעה לשינוי צבע
        setInterval(() => this.updateThemeByTime(), 60000); // בדיקה כל דקה
        console.log("🚀 System Initialized: LOGIMATH 3.0");
    },

    // --- 1. פיצ'רים עתידניים ---
    updateThemeByTime: function() {
        const hour = new Date().getHours();
        const root = document.documentElement;
        
        // בוקר (6-12): כחול טכנולוגי
        if (hour >= 6 && hour < 12) {
            root.style.setProperty('--primary-neon', '#00c6ff');
            root.style.setProperty('--secondary-neon', '#b000ff');
        } 
        // צהריים (12-18): כתום/זהב (Cyber Gold)
        else if (hour >= 12 && hour < 18) {
            root.style.setProperty('--primary-neon', '#ff9900');
            root.style.setProperty('--secondary-neon', '#ff0055');
        }
        // לילה (18-6): סגול עמוק (המקורי)
        else {
            root.style.setProperty('--primary-neon', '#b000ff');
            root.style.setProperty('--secondary-neon', '#00c6ff');
        }
    },

    activateVoice: function() {
        const btn = document.getElementById('voice-control');
        btn.classList.add('listening');
        alert("🎤 Voice Command Activated: Waiting for input...");
        setTimeout(() => btn.classList.remove('listening'), 3000);
    },

    // --- 2. ניווט ---
    navigateTo: function(sectionId) {
        document.querySelectorAll('section').forEach(sec => {
            sec.classList.remove('active-section');
            sec.style.display = 'none';
        });

        // עדכון אקטיב בנאבר
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        // לוגיקה למציאת הכפתור המתאים (אופציונלי)

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            setTimeout(() => targetSection.classList.add('active-section'), 10);
        }
    },

    // --- 3. מערכת הזדהות (Auth) ---
    handleAuth: function() {
        if (this.isLoggedIn) {
            this.isLoggedIn = false;
            this.userRole = 'guest';
            document.getElementById('auth-btn').innerText = 'LOGIN / REGISTER';
            document.querySelector('.admin-only').style.display = 'none';
            this.navigateTo('home');
            alert('מערכת: התנתקות בוצעה בהצלחה.');
        } else {
            this.navigateTo('login');
        }
    },

    switchAuthMode: function(mode) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active-form'));
        
        if (mode === 'login') {
            document.querySelectorAll('.auth-tab')[0].classList.add('active');
            document.getElementById('login-form').classList.add('active-form');
        } else {
            document.querySelectorAll('.auth-tab')[1].classList.add('active');
            document.getElementById('register-form').classList.add('active-form');
        }
    },

    performLogin: function() {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        const errorMsg = document.getElementById('login-error');

        // סימולציה של בדיקת שרת
        if (email === 'admin' && pass === '1234') {
            this.loginSuccess('admin', 'Commander');
        } else if (email.includes('@') && pass.length > 3) {
            this.loginSuccess('client', email.split('@')[0]);
        } else {
            errorMsg.innerText = "Access Denied: בדוק שם משתמש וסיסמה";
            errorMsg.style.display = 'block';
            this.shakeElement(document.querySelector('.auth-container'));
        }
    },

    performRegister: function() {
        const fname = document.getElementById('reg-fname').value;
        const lname = document.getElementById('reg-lname').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const pass = document.getElementById('reg-pass').value;
        
        // ולידציה
        if (!fname || !lname || !email || !phone || !pass) {
            this.showError("חסרים נתונים! אנא מלא את כל השדות.");
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            this.showError("כתובת האימייל אינה תקינה.");
            return;
        }
        const phonePattern = /^05\d{8}$/; 
        if (!phonePattern.test(phone.replace(/-/g, ''))) {
            this.showError("מספר טלפון לא תקין (חייב להיות נייד ישראלי).");
            return;
        }
        if (pass.length < 6) {
            this.showError("הסיסמה חלשה מדי (מינימום 6 תווים).");
            return;
        }

        alert(`ברוך הבא למשפחת LOGIMATH, ${fname}!`);
        this.loginSuccess('client', fname);
    },

    showError: function(msg) {
        const el = document.getElementById('reg-error');
        el.innerText = "⚠️ " + msg;
        el.style.display = 'block';
        this.shakeElement(document.querySelector('.auth-container'));
    },

    shakeElement: function(element) {
        element.style.animation = 'none';
        element.offsetHeight; /* trigger reflow */
        element.style.animation = 'shake 0.5s';
    },

    loginSuccess: function(role, name) {
        this.isLoggedIn = true;
        this.userRole = role;
        
        const authBtn = document.getElementById('auth-btn');
        authBtn.innerHTML = `LOGOUT (${name})`;
        authBtn.onclick = () => this.handleAuth();

        if (role === 'admin') {
            document.querySelector('.admin-only').style.display = 'block';
            this.navigateTo('admin-dashboard');
            this.initCharts();
            this.startTerminalLogs();
        } else {
            document.querySelector('.admin-only').style.display = 'none';
            this.navigateTo('builder');
        }
    },

    // --- 4. Admin Dashboard ---
    initCharts: function() {
        const ctx1 = document.getElementById('salesChart').getContext('2d');
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales (₪)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-neon').trim(),
                    backgroundColor: 'rgba(176, 0, 255, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: true
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } }, x: { grid: { display: false }, ticks: { color: '#888' } } } }
        });

        const ctx2 = document.getElementById('categoryChart').getContext('2d');
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Cyber', 'Gaming', 'Medical', 'Legal'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: ['#b000ff', '#00c6ff', '#25D366', '#ff9900'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }
        });
    },

    startTerminalLogs: function() {
        const logs = ["User ID: 842 connected", "Generating AI Layout...", "New Lead Received", "System Backup: OK", "Database Sync: OK"];
        const terminal = document.getElementById('terminal-logs');
        setInterval(() => {
            const randomLog = logs[Math.floor(Math.random() * logs.length)];
            const time = new Date().toLocaleTimeString();
            const logElement = document.createElement('div');
            logElement.className = 'log-line';
            logElement.innerHTML = `<span style="color:#666">[${time}]</span> ${randomLog}`;
            terminal.prepend(logElement);
            if (terminal.children.length > 6) terminal.lastChild.remove();
        }, 2000);
    },

    // --- 5. AI & Modal ---
    setPrompt: function(text) { document.getElementById('desc').value = text; },
    generateSite: async function() { /* קוד AI קיים... */ },
    submitLead: async function() { alert('נשמר בהצלחה!'); this.closeModal(); },
    closeModal: function() { document.getElementById('leadModal').style.display = 'none'; },
    openModal: function() { document.getElementById('leadModal').style.display = 'flex'; }
};

// הפעלת המערכת
appFlow.init();