let currentLang = 'th'; // ตัวแปรเก็บภาษาปัจจุบัน

const translations = {
    th: {
        title: "ระบบจัดการเอกสาร",
        admin_title: "การจัดการระบบ (Admin)",
        subtitle: "E-Approval & Signature System",
        emp_id: "รหัสพนักงาน",
        emp_id_ph: "ระบุรหัสพนักงาน",
        admin_id: "รหัสผู้ดูแลระบบ",
        admin_id_ph: "ระบุรหัสผู้ดูแลระบบ",
        password: "รหัสผ่าน",
        password_ph: "••••••••",
        remember: "จดจำการเข้าสู่ระบบ",
        forgot: "ลืมรหัสผ่าน?",
        login_btn: "เข้าสู่ระบบ",
        admin_login: "<i class='fa-solid fa-shield-halved'></i> เข้าสู่ระบบในฐานะผู้ดูแลระบบ",
        user_login: "<i class='fa-regular fa-user'></i> กลับสู่หน้าเข้าสู่ระบบพนักงาน",
        footer: "&copy; 2026 - Isuzu Engine Manufacturing Co., (Thailand) Ltd."
    },
    en: {
        title: "Document Management",
        admin_title: "System Administration",
        subtitle: "E-Approval & Signature System",
        emp_id: "Employee ID",
        emp_id_ph: "Enter Employee ID",
        admin_id: "Administrator ID",
        admin_id_ph: "Enter Admin ID",
        password: "Password",
        password_ph: "••••••••",
        remember: "Remember me",
        forgot: "Forgot password?",
        login_btn: "Login",
        admin_login: "<i class='fa-solid fa-shield-halved'></i> Login as Administrator",
        user_login: "<i class='fa-regular fa-user'></i> Back to Employee Login",
        footer: "&copy; 2026 - Isuzu Engine Manufacturing Co., (Thailand) Ltd."
    },
    jp: {
        title: "文書管理システム",
        admin_title: "システム管理 (Admin)",
        subtitle: "電子承認・署名システム",
        emp_id: "社員番号",
        emp_id_ph: "社員番号を入力",
        admin_id: "管理者ID",
        admin_id_ph: "管理者IDを入力",
        password: "パスワード",
        password_ph: "••••••••",
        remember: "ログイン状態を保存",
        forgot: "パスワードをお忘れですか？",
        login_btn: "ログイン",
        admin_login: "<i class='fa-solid fa-shield-halved'></i> 管理者としてログイン",
        user_login: "<i class='fa-regular fa-user'></i> 従業員ログインに戻る",
        footer: "&copy; 2026 - Isuzu Engine Manufacturing Co., (Thailand) Ltd."
    }
};

// ฟังก์ชันสลับภาษา
function changeLanguage(lang) {
    currentLang = lang; // อัปเดตภาษาปัจจุบัน
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // ตรวจสอบว่าเป็นโหมดไหน เพื่อเปลี่ยน Placeholder ให้ถูกประเภท
    const isModeAdmin = document.getElementById('userRole').value === 'admin';
    document.getElementById('emp_input').placeholder = isModeAdmin ? translations[lang].admin_id_ph : translations[lang].emp_id_ph;
    document.getElementById('pass_input').placeholder = translations[lang].password_ph;

    if (lang === 'jp') {
        document.body.style.fontFamily = "'Noto Sans JP', 'Prompt', sans-serif";
    } else {
        document.body.style.fontFamily = "'Prompt', sans-serif";
    }
}

// ฟังก์ชันสลับโหมด พนักงาน <-> แอดมิน
function toggleAdminMode(e) {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชเวลากดลิงก์
    
    const roleInput = document.getElementById('userRole');
    const body = document.body;

    if (roleInput.value === 'employee') {
        // เข้าสู่โหมด Admin
        roleInput.value = 'admin';
        body.classList.add('admin-mode'); // ใส่คลาสเปลี่ยนสี
        
        // สลับ Key ของภาษาให้ชี้ไปที่คำศัพท์ของแอดมิน
        document.getElementById('mainTitle').setAttribute('data-i18n', 'admin_title');
        document.getElementById('userLabel').setAttribute('data-i18n', 'admin_id');
        document.getElementById('toggleAdminBtn').setAttribute('data-i18n', 'user_login');
    } else {
        // กลับสู่โหมด Employee
        roleInput.value = 'employee';
        body.classList.remove('admin-mode'); // เอาคลาสเปลี่ยนสีออก
        
        // สลับ Key ของภาษากลับมาเป็นพนักงาน
        document.getElementById('mainTitle').setAttribute('data-i18n', 'title');
        document.getElementById('userLabel').setAttribute('data-i18n', 'emp_id');
        document.getElementById('toggleAdminBtn').setAttribute('data-i18n', 'admin_login');
    }
    
    // สั่งให้โหลดข้อความภาษาใหม่ทันทีหลังจากสลับโหมด
    changeLanguage(currentLang);
}

// โหลดภาษาเริ่มต้น (ไทย) เมื่อเปิดเว็บครั้งแรก
window.onload = () => {
    changeLanguage('th');
};