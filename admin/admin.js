// ==========================================================================
// 🌍 1. พจนานุกรมและระบบแปลภาษา (Translations & Multi-language)
// ==========================================================================
const translations = {
    th: {
        menu_dashboard: "ภาพรวมระบบ", menu_departments: "จัดการแผนก", menu_users: "จัดการผู้ใช้งาน", menu_smtp: "ตั้งค่า SMTP",
        page_dashboard: "Admin Dashboard", page_departments: "จัดการแผนก", page_users: "จัดการผู้ใช้งาน", page_smtp: "ตั้งค่า SMTP",
        card_users: "พนักงานทั้งหมด", card_depts: "แผนกทั้งหมด", card_docs_today: "เอกสารวันนี้", card_docs_pending: "เอกสารรออนุมัติ",
        card_desc_today: "อัปโหลดใหม่วันนี้", card_desc_pending: "ที่ยังไม่เสร็จสิ้น", recent_docs: "เอกสารล่าสุดในระบบ", btn_view_all: "ดูทั้งหมด",
        title_dept: "จัดการแผนก", desc_dept: "เพิ่มลบแก้ไขรายชื่อแผนกในองค์กร", btn_add_dept: "เพิ่มแผนกใหม่", th_dept_name: "ชื่อแผนก", th_manage: "จัดการ",
        title_user: "จัดการผู้ใช้งาน", desc_user: "รายชื่อพนักงาน จัดการบัญชีผู้ใช้งาน สิทธิ์ และสถานะ", btn_add_user: "เพิ่มพนักงาน", th_employee: "พนักงาน", th_role: "สิทธิ์ (ROLE)", th_status: "สถานะ",
        title_smtp: "ตั้งค่าการส่งเมล (SMTP)", desc_smtp: "กำหนดค่า Email Server สำหรับระบบแจ้งเตือนอัตโนมัติ",
        th_time: "เวลา", th_creator: "ผู้สร้างเอกสาร", th_doc_title: "หัวข้อเอกสาร", th_status_doc: "สถานะ",
        empty_docs: "ยังไม่มีข้อมูลเอกสารในระบบ",
        stat_users_has: "มีข้อมูล {count} คน เดือนนี้", stat_users_empty: "ยังไม่มีพนักงานในระบบ",
        stat_depts_has: "มีข้อมูล {count} แผนกในระบบ", stat_depts_empty: "ยังไม่ได้ตั้งค่าแผนก",
        empty_users: "ยังไม่มีข้อมูลพนักงานในระบบ", empty_depts: "ยังไม่มีข้อมูลแผนกในระบบ",
        not_found: 'ไม่พบข้อมูลที่ตรงกับ "{keyword}"',
        search_placeholder: "ค้นหาชื่อ, รหัสพนักงาน หรืออีเมล...",
        smtp_form_mock: "(พื้นที่สำหรับใส่ฟอร์ม SMTP ตามในรูปภาพ)",
        sidebar_admin: "ผู้ดูแลระบบ", logout: "ออกจากระบบ",
        confirm_del_dept: "ต้องการลบแผนกนี้?", confirm_del_user: "ต้องการลบพนักงานคนนี้?",
        cannot_recover: "ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้",
        csv_title: "นำเข้า CSV", csv_desc: "ไฟล์ต้องมีคอลัมน์: EmployeeID, FullName, Email, DeptName",
        csv_drop_text: "คลิกเพื่อเลือกไฟล์ .csv", btn_cancel: "ยกเลิก", btn_upload: "อัปโหลด",
        modal_add_user_title: "เพิ่มพนักงานใหม่", modal_edit_user_title: "แก้ไขข้อมูลพนักงาน",
        label_emp_id: "รหัสพนักงาน", placeholder_emp_id: "IEMT001",
        label_dept: "แผนก", select_dept_default: "-- เลือกแผนก --",
        label_fullname: "ชื่อ-นามสกุล", placeholder_fullname: "สมชาย ใจดี",
        label_email: "อีเมล", label_role: "สิทธิ์การใช้งาน", label_status: "สถานะ",
        label_password: "กำหนดรหัสผ่านใหม่", password_hint: "(เว้นว่างหากไม่ต้องการเปลี่ยน)",
        btn_save: "บันทึกข้อมูล", modal_add_dept_title: "เพิ่มแผนกใหม่", modal_edit_dept_title: "แก้ไขชื่อแผนก",
        label_dept_name: "ชื่อแผนก", placeholder_dept_name: "ระบุชื่อแผนก เช่น IT, HR",
        role_user: "User (ผู้ใช้งานทั่วไป)", role_admin: "Admin (ผู้ดูแลระบบ)",
        status_active: "Active (ใช้งานปกติ)", status_inactive: "Inactive (ระงับการใช้งาน)",
        
        // 🔥 ข้อความส่วนป๊อปอัปยืนยันการลบ และแจ้งเตือน Toast 🔥
        modal_del_title: "ยืนยันการลบข้อมูล?", btn_delete: "ลบข้อมูล",
        toast_success: "สำเร็จ!", toast_error: "ผิดพลาด", toast_warning: "แจ้งเตือน",
        alert_empty_dept: "กรุณาระบุชื่อแผนกด้วยครับ!",
        alert_empty_user: "กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วนครับ!",
        alert_csv_wrong_type: "ระบบรองรับเฉพาะไฟล์นามสกุล .csv เท่านั้นครับ!",
        alert_csv_no_file: "กรุณาคลิกเลือกไฟล์ CSV ก่อนกดอัปโหลดครับ!",
        alert_csv_empty: "ไฟล์ CSV ไม่มีข้อมูล หรือรูปแบบไม่ถูกต้องครับ!",
        alert_csv_columns: "คอลัมน์ไม่ถูกต้อง! ต้องมี: EmployeeID, FullName, Email, DeptName",
        alert_csv_success: "นำเข้าข้อมูลพนักงานจำนวน {count} รายการ เรียบร้อยแล้ว",
        alert_delete_dept_success: "ลบข้อมูลแผนกเรียบร้อยแล้ว",
        alert_delete_user_success: "ลบข้อมูลพนักงานเรียบร้อยแล้ว"
    },
    en: {
        menu_dashboard: "Dashboard", menu_departments: "Departments", menu_users: "Users", menu_smtp: "SMTP Settings",
        page_dashboard: "Admin Dashboard", page_departments: "Manage Departments", page_users: "Manage Users", page_smtp: "SMTP Settings",
        card_users: "Total Employees", card_depts: "Total Departments", card_docs_today: "Today's Docs", card_docs_pending: "Pending Docs",
        card_desc_today: "New uploads today", card_desc_pending: "Unfinished processes", recent_docs: "Recent Documents", btn_view_all: "View All",
        title_dept: "Manage Departments", desc_dept: "Add, edit, or remove company departments", btn_add_dept: "Add Department", th_dept_name: "Department Name", th_manage: "Action",
        title_user: "Manage Users", desc_user: "Employee list, account management, roles, and status", btn_add_user: "Add Employee", th_employee: "Employee", th_role: "Role", th_status: "Status",
        title_smtp: "SMTP Configuration", desc_smtp: "Configure Email Server for automatic notifications",
        th_time: "Time", th_creator: "Creator", th_doc_title: "Document Title", th_status_doc: "Status",
        empty_docs: "No documents in the system yet",
        stat_users_has: "{count} employees this month", stat_users_empty: "No employees in the system",
        stat_depts_has: "{count} departments configured", stat_depts_empty: "No departments configured",
        empty_users: "No employees in the system", empty_depts: "No departments in the system",
        not_found: 'No results found for "{keyword}"',
        search_placeholder: "Search name, ID, or email...",
        smtp_form_mock: "(SMTP Form placeholder area follows the image)",
        sidebar_admin: "Administrator", logout: "Logout",
        confirm_del_dept: "Delete this department?", confirm_del_user: "Delete this employee?",
        cannot_recover: "Deleted data cannot be recovered.",
        csv_title: "Import CSV", csv_desc: "File must contain columns: EmployeeID, FullName, Email, DeptName",
        csv_drop_text: "Click to select .csv file", btn_cancel: "Cancel", btn_upload: "Upload",
        modal_add_user_title: "Add Employee", modal_edit_user_title: "Edit Employee",
        label_emp_id: "Employee ID", placeholder_emp_id: "IEMT001",
        label_dept: "Department", select_dept_default: "-- Select Department --",
        label_fullname: "Full Name", placeholder_fullname: "John Doe",
        label_email: "Email", label_role: "Role", label_status: "Status",
        label_password: "New Password", password_hint: "(Leave blank to keep current)",
        btn_save: "Save", modal_add_dept_title: "Add Department", modal_edit_dept_title: "Edit Department",
        label_dept_name: "Department Name", placeholder_dept_name: "e.g., IT, HR",
        role_user: "User (General)", role_admin: "Admin (Administrator)",
        status_active: "Active (Normal)", status_inactive: "Inactive (Suspended)",
        
        // 🔥 ข้อความส่วนป๊อปอัปยืนยันการลบ และแจ้งเตือน Toast 🔥
        modal_del_title: "Confirm Deletion?", btn_delete: "Delete",
        toast_success: "Success!", toast_error: "Error", toast_warning: "Warning",
        alert_empty_dept: "Please enter a department name!",
        alert_empty_user: "Please fill in all required (*) fields!",
        alert_csv_wrong_type: "Only .csv files are supported!",
        alert_csv_no_file: "Please select a CSV file before uploading!",
        alert_csv_empty: "CSV file is empty or has an invalid format!",
        alert_csv_columns: "Invalid columns! Required: EmployeeID, FullName, Email, DeptName",
        alert_csv_success: "Successfully imported {count} records.",
        alert_delete_dept_success: "Department deleted successfully.",
        alert_delete_user_success: "Employee deleted successfully."
    },
    jp: {
        menu_dashboard: "ダッシュボード", menu_departments: "部署管理", menu_users: "ユーザー管理", menu_smtp: "SMTP設定",
        page_dashboard: "管理ダッシュボード", page_departments: "部署管理", page_users: "ユーザー管理", page_smtp: "SMTP設定",
        card_users: "全従業員", card_depts: "全部署", card_docs_today: "今日の書類", card_docs_pending: "保留中の書類",
        card_desc_today: "今日の新規アップロード", card_desc_pending: "未完了のプロセス", recent_docs: "最近のドキュメント", btn_view_all: "すべて見る",
        title_dept: "部署管理", desc_dept: "社内部署の追加、編集、削除", btn_add_dept: "部署を追加", th_dept_name: "部署名", th_manage: "操作",
        title_user: "ユーザー管理", desc_user: "従業員リスト、アカウント管理、権限、ステータス", btn_add_user: "従業員を追加", th_employee: "従業員", th_role: "権限 (ROLE)", th_status: "ステータス",
        title_smtp: "SMTP設定", desc_smtp: "自動通知用のメールサーバーを設定",
        th_time: "時間", th_creator: "作成者", th_doc_title: "ドキュメント名", th_status_doc: "ステータス",
        empty_docs: "システムにドキュメントがありません",
        stat_users_has: "今月は {count} 人のデータがあります", stat_users_empty: "システムに従業員がいません",
        stat_depts_has: "システムに {count} の部署があります", stat_depts_empty: "部署が設定されていません",
        empty_users: "システムに従業員がいません", empty_depts: "システムに部署がありません",
        not_found: '"{keyword}" に一致する結果が見つかりません',
        search_placeholder: "名前、社員ID、またはメールで検索...",
        smtp_form_mock: "(ここに画像のようなSMTPフォームが入ります)",
        sidebar_admin: "管理者", logout: "ログアウト",
        confirm_del_dept: "この部署を削除しますか？", confirm_del_user: "この従業員を削除しますか？",
        cannot_recover: "削除されたデータは復元できません。",
        csv_title: "CSVインポート", csv_desc: "必須カラム: EmployeeID, FullName, Email, DeptName",
        csv_drop_text: ".csvファイルを選択", btn_cancel: "キャンセル", btn_upload: "アップロード",
        modal_add_user_title: "従業員を追加", modal_edit_user_title: "従業員情報を編集",
        label_emp_id: "社員ID", placeholder_emp_id: "IEMT001",
        label_dept: "部署", select_dept_default: "-- 部署を選択 --",
        label_fullname: "氏名", placeholder_fullname: "山田 太郎",
        label_email: "メールアドレス", label_role: "権限", label_status: "ステータス",
        label_password: "新しいパスワード", password_hint: "(変更しない場合は空白)",
        btn_save: "保存", modal_add_dept_title: "部署を追加", modal_edit_dept_title: "部署名を編集",
        label_dept_name: "部署名", placeholder_dept_name: "例: IT, HR",
        role_user: "User (一般ユーザー)", role_admin: "Admin (管理者)",
        status_active: "Active (通常)", status_inactive: "Inactive (停止)",
        
        // 🔥 ข้อความส่วนป๊อปอัปยืนยันการลบ และแจ้งเตือน Toast 🔥
        modal_del_title: "削除の確認?", btn_delete: "削除する",
        toast_success: "成功！", toast_error: "エラー", toast_warning: "警告",
        alert_empty_dept: "部署名を入力してください！",
        alert_empty_user: "必須項目（*）をすべて入力してください！",
        alert_csv_wrong_type: ".csvファイルのみサポートされています！",
        alert_csv_no_file: "アップロードする前にCSVファイルを選択してください！",
        alert_csv_empty: "CSVファイルが空か、無効な形式です！",
        alert_csv_columns: "無効なカラムです！必須: EmployeeID, FullName, Email, DeptName",
        alert_csv_success: "{count} 件のデータを正常にインポートしました。",
        alert_delete_dept_success: "部署を正常に削除しました。",
        alert_delete_user_success: "従業員を正常に削除しました。"

    }
};

function changeLanguage(lang) {
    localStorage.setItem('my_app_lang', lang); 
    document.getElementById('langSelect').value = lang; 
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
    });
    
    const activeMenu = document.querySelector('.sidebar-menu li.active');
    if (activeMenu) {
        const tabId = activeMenu.getAttribute('onclick').match(/'([^']+)'/)[1];
        const pageTitle = document.getElementById('page-title');
        if (pageTitle && translations[lang]['page_' + tabId]) {
            pageTitle.innerText = translations[lang]['page_' + tabId];
        }
    }

    updateDashboardStats();
    renderUsers(); 
}

// ==========================================================================
// ✨ ระบบแสดงแจ้งเตือน (Toast Notification System) ✨
// ==========================================================================
function showToast(title, message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-xmark';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // ลบอัตโนมัติเมื่อผ่านไป 4 วินาที
    setTimeout(() => {
        toast.style.animation = 'fadeOutRight 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ==========================================================================
// 🚀 INIT: โหลดคำสั่งเมื่อเปิดหน้าเว็บ
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('my_app_lang') || 'th';
    changeLanguage(savedLang); 
    renderDepartments();
    renderUsers(); 
});

window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('profileDropdown');
    const container = document.querySelector('.user-profile-container');
    if (container && !container.contains(e.target) && dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

function switchTab(tabId, element) {
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');

    const currentLang = localStorage.getItem('my_app_lang') || 'th';
    const pageTitle = document.getElementById('page-title');
    if (translations[currentLang] && translations[currentLang]['page_' + tabId]) {
        pageTitle.innerText = translations[currentLang]['page_' + tabId];
    }
}

function toggleDropdown(e) {
    e.stopPropagation();
    document.getElementById('profileDropdown').classList.toggle('show');
}

function updateDashboardStats() {
    const departments = getDepartmentsFromStorage(); 
    const count = departments.length;
    const lang = localStorage.getItem('my_app_lang') || 'th'; 
    
    const countDisplay = document.getElementById('dashboardDeptCount');
    const textDisplay = document.getElementById('dashboardDeptText');
    if (countDisplay) countDisplay.innerText = count; 
    if (textDisplay) {
        if (count > 0) {
            textDisplay.innerText = translations[lang].stat_depts_has.replace('{count}', count);
            textDisplay.className = 'text-green fw-bold'; 
        } else {
            textDisplay.innerText = translations[lang].stat_depts_empty;
            textDisplay.className = 'text-gray'; 
        }
    }
}

function updateDashboardUsers(count) {
    const lang = localStorage.getItem('my_app_lang') || 'th'; 
    const countDisplay = document.getElementById('dashboardUserCount');
    const textDisplay = document.getElementById('dashboardUserText');
    
    if (countDisplay) countDisplay.innerText = count;
    if (textDisplay) {
        if (count > 0) {
            textDisplay.innerText = translations[lang].stat_users_has.replace('{count}', count);
            textDisplay.className = 'text-green fw-bold';
        } else {
            textDisplay.innerText = translations[lang].stat_users_empty;
            textDisplay.className = 'text-gray';
        }
    }
}

// ==========================================================================
// 🏢 4. จัดการแผนก (Departments)
// ==========================================================================
function getDepartmentsFromStorage() {
    const depts = localStorage.getItem('my_departments');
    return depts ? JSON.parse(depts) : []; 
}

function renderDepartments() {
    const tbody = document.getElementById('deptTableBody');
    if (!tbody) return; 
    
    const departments = getDepartmentsFromStorage();
    const lang = localStorage.getItem('my_app_lang') || 'th';
    
    if (departments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 60px 20px;">
                    <i class="fa-regular fa-building" style="font-size: 48px; color: #e2e8f0; margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 15px; font-weight: 500;">${translations[lang].empty_depts}</p>
                </td>
            </tr>`;
        updateDashboardStats();
        return;
    }
    
    tbody.innerHTML = ''; 
    departments.forEach((deptName, index) => {
        tbody.innerHTML += `
            <tr>
                <td style="color: var(--text-muted);">${index + 1}</td>
                <td style="font-weight: 500; color: var(--text-main);">${deptName}</td>
                <td style="text-align: center;">
                    <button class="icon-btn edit" onclick="editDepartment(${index})"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete" onclick="openDeleteModal('dept', ${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
    });
    updateDashboardStats();
}

function openAddDeptModal() {
    document.getElementById('addDeptModal').style.display = 'flex';
    document.getElementById('deptNameInput').focus(); 
}

function closeAddDeptModal() {
    document.getElementById('addDeptModal').style.display = 'none';
    document.getElementById('deptNameInput').value = ''; 
}

function saveDepartment() {
    const input = document.getElementById('deptNameInput');
    const deptName = input.value.trim();
    const lang = localStorage.getItem('my_app_lang') || 'th';
    
    if (deptName === '') {
        showToast(translations[lang].toast_warning, translations[lang].alert_empty_dept, 'warning');
        return;
    }
    
    const departments = getDepartmentsFromStorage(); 
    departments.push(deptName); 
    localStorage.setItem('my_departments', JSON.stringify(departments)); 
    renderDepartments(); 
    closeAddDeptModal(); 
}

let editTargetIndex = null; 
function editDepartment(index) {
    const departments = getDepartmentsFromStorage();
    editTargetIndex = index; 
    document.getElementById('editDeptNameInput').value = departments[index]; 
    document.getElementById('editDeptModal').style.display = 'flex'; 
    document.getElementById('editDeptNameInput').focus(); 
}

function closeEditModal() {
    document.getElementById('editDeptModal').style.display = 'none';
    editTargetIndex = null; 
}

function confirmEdit() {
    if (editTargetIndex !== null) {
        const input = document.getElementById('editDeptNameInput');
        const newName = input.value.trim();
        const lang = localStorage.getItem('my_app_lang') || 'th';
        
        if (newName === '') {
            showToast(translations[lang].toast_warning, translations[lang].alert_empty_dept, 'warning');
            return;
        }
        
        const departments = getDepartmentsFromStorage();
        const oldName = departments[editTargetIndex]; 
        
        departments[editTargetIndex] = newName; 
        localStorage.setItem('my_departments', JSON.stringify(departments)); 

        const users = getUsersFromStorage();
        let isUserUpdated = false;
        users.forEach(user => {
            if (user.dept === oldName) {
                user.dept = newName;
                isUserUpdated = true;
            }
        });
        
        if (isUserUpdated) {
            localStorage.setItem('my_users', JSON.stringify(users));
            renderUsers(); 
        }

        renderDepartments(); 
        closeEditModal(); 
    }
}

// ==========================================================================
// 👥 5. จัดการผู้ใช้งาน (Users)
// ==========================================================================
function getUsersFromStorage() {
    const users = localStorage.getItem('my_users');
    return users ? JSON.parse(users) : [];
}

function populateDeptDropdown() {
    const deptSelect = document.getElementById('empDept');
    const departments = getDepartmentsFromStorage();
    const lang = localStorage.getItem('my_app_lang') || 'th'; 
    
    deptSelect.innerHTML = `<option value="">${translations[lang].select_dept_default}</option>`;
    departments.forEach(dept => {
        deptSelect.innerHTML += `<option value="${dept}">${dept}</option>`;
    });
}

function renderUsers() {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    
    const allUsers = getUsersFromStorage(); 
    const searchInput = document.getElementById('searchInput');
    const keyword = searchInput ? searchInput.value.toLowerCase() : ''; 
    const lang = localStorage.getItem('my_app_lang') || 'th'; 
    
    if (allUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 60px 20px;">
                    <i class="fa-solid fa-user-group" style="font-size: 48px; color: #e2e8f0; margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 15px; font-weight: 500;">${translations[lang].empty_users}</p>
                </td>
            </tr>`;
        updateDashboardUsers(0);
        return;
    }
    
    const filteredUsers = allUsers.filter(user => {
        return user.name.toLowerCase().includes(keyword) || 
               user.id.toLowerCase().includes(keyword) || 
               user.email.toLowerCase().includes(keyword) ||
               user.dept.toLowerCase().includes(keyword);
    });

    if (filteredUsers.length === 0) {
        const notFoundText = translations[lang].not_found.replace('{keyword}', keyword);
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 60px 20px;">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 40px; color: #e2e8f0; margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 15px; font-weight: 500;">${notFoundText}</p>
                </td>
            </tr>`;
        return;
    }
    
    tbody.innerHTML = '';
    filteredUsers.forEach((user) => {
        const originalIndex = allUsers.findIndex(u => u.id === user.id);
        const statusBadge = user.status === 'Active' 
            ? `<span class="status-badge success">Active</span>` 
            : `<span class="status-badge" style="background: #f1f5f9; color: #64748b;">Inactive</span>`;
            
        tbody.innerHTML += `
            <tr>
                <td>
                    <strong style="color: var(--text-main); font-weight: 500; font-size: 15px;">${user.name}</strong><br>
                    <span style="font-size: 12px; color: var(--text-muted);">${user.id} | ${user.email}</span>
                </td>
                <td style="color: var(--text-main);">${user.dept}</td>
                <td style="color: var(--text-main);">${user.role}</td>
                <td>${statusBadge}</td>
                <td style="text-align: center;">
                    <button class="icon-btn edit" onclick="editUser(${originalIndex})"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete" onclick="openDeleteModal('user', ${originalIndex})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
    });
    updateDashboardUsers(allUsers.length); 
}

function openAddUserModal() {
    populateDeptDropdown(); 
    const lang = localStorage.getItem('my_app_lang') || 'th';
    
    const titleEl = document.getElementById('userModalTitle');
    titleEl.setAttribute('data-i18n', 'modal_add_user_title'); 
    titleEl.innerText = translations[lang].modal_add_user_title; 
    
    document.getElementById('editUserIndex').value = ''; 
    document.getElementById('addUserModal').style.display = 'flex';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
    const inputs = document.querySelectorAll('#addUserModal input');
    inputs.forEach(input => input.value = ''); 
    document.getElementById('empDept').value = '';
    document.getElementById('empRole').value = 'User';
    document.getElementById('empStatus').value = 'Active';
}

function saveUser() {
    const id = document.getElementById('empId').value.trim();
    const dept = document.getElementById('empDept').value;
    const name = document.getElementById('empName').value.trim();
    const email = document.getElementById('empEmail').value.trim();
    const role = document.getElementById('empRole').value;
    const status = document.getElementById('empStatus').value;
    const password = document.getElementById('empPassword').value;
    const editIndex = document.getElementById('editUserIndex').value;
    const lang = localStorage.getItem('my_app_lang') || 'th';

    if (!id || !dept || !name || !email) {
        showToast(translations[lang].toast_warning, translations[lang].alert_empty_user, 'warning');
        return;
    }

    const users = getUsersFromStorage();

    // 🛑 ตรวจสอบรหัสพนักงานซ้ำ (ยกเว้นตอนที่เรากำลัง "แก้ไข" คนเดิมอยู่)
    const isDuplicate = users.some((u, index) => u.id === id && index.toString() !== editIndex);
    if (isDuplicate) {
        const dupMsg = lang === 'th' ? 'รหัสพนักงานนี้มีในระบบแล้ว!' : 
                       lang === 'en' ? 'This Employee ID already exists!' : 
                       'この社員IDは既に存在します！';
        showToast(translations[lang].toast_error, dupMsg, 'error');
        return;
    }

    const userData = { id, dept, name, email, role, status, password };

    if (editIndex === '') users.push(userData); 
    else users[editIndex] = userData; 

    localStorage.setItem('my_users', JSON.stringify(users));
    renderUsers();
    closeAddUserModal();
}

function editUser(index) {
    populateDeptDropdown(); 
    const users = getUsersFromStorage();
    const user = users[index];
    const lang = localStorage.getItem('my_app_lang') || 'th';

    document.getElementById('editUserIndex').value = index;
    
    const titleEl = document.getElementById('userModalTitle');
    titleEl.setAttribute('data-i18n', 'modal_edit_user_title');
    titleEl.innerText = translations[lang].modal_edit_user_title;
    
    document.getElementById('empId').value = user.id;
    document.getElementById('empDept').value = user.dept;
    document.getElementById('empName').value = user.name;
    document.getElementById('empEmail').value = user.email;
    document.getElementById('empRole').value = user.role;
    document.getElementById('empStatus').value = user.status;
    document.getElementById('empPassword').value = ''; 

    document.getElementById('addUserModal').style.display = 'flex';
}

// ==========================================================================
// 🗑️ 6. ระบบลบข้อมูลรวม (Delete Confirmation)
// ==========================================================================
let deleteTarget = { type: null, index: null };

function openDeleteModal(type, index) {
    deleteTarget = { type: type, index: index };
    const lang = localStorage.getItem('my_app_lang') || 'th';
    const msg = type === 'dept' ? translations[lang].confirm_del_dept : translations[lang].confirm_del_user;
        
    document.getElementById('deleteConfirmText').innerHTML = msg + '<br>' + translations[lang].cannot_recover;
    document.getElementById('deleteConfirmModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteConfirmModal').style.display = 'none';
    deleteTarget = { type: null, index: null };
}

function confirmDelete() {
    const lang = localStorage.getItem('my_app_lang') || 'th'; // 📌 ดึงภาษาปัจจุบันมาเตรียมไว้

    if (deleteTarget.type === 'dept') {
        const departments = getDepartmentsFromStorage();
        const deletedDeptName = departments[deleteTarget.index]; 
        
        departments.splice(deleteTarget.index, 1);
        localStorage.setItem('my_departments', JSON.stringify(departments));

        const users = getUsersFromStorage();
        let isUserUpdated = false;
        users.forEach(user => {
            if (user.dept === deletedDeptName) {
                user.dept = ''; 
                isUserUpdated = true;
            }
        });
        
        if (isUserUpdated) {
            localStorage.setItem('my_users', JSON.stringify(users));
            renderUsers(); 
        }

        renderDepartments();
        
        // 🟢 เรียก Toast แจ้งเตือนว่าลบแผนกสำเร็จ
        showToast(translations[lang].toast_success, translations[lang].alert_delete_dept_success, 'success');

    } else if (deleteTarget.type === 'user') {
        const users = getUsersFromStorage();
        users.splice(deleteTarget.index, 1);
        localStorage.setItem('my_users', JSON.stringify(users));
        renderUsers();
        
        // 🟢 เรียก Toast แจ้งเตือนว่าลบพนักงานสำเร็จ
        showToast(translations[lang].toast_success, translations[lang].alert_delete_user_success, 'success');
    }
    
    closeDeleteModal();
}

// ==========================================================================
// 📂 7. ระบบ CSV Import
// ==========================================================================
let selectedCSVFile = null;

function openCsvModal() {
    document.getElementById('csvImportModal').style.display = 'flex';
    resetCsvUI();
}

function closeCsvModal() {
    document.getElementById('csvImportModal').style.display = 'none';
    resetCsvUI();
}

function resetCsvUI() {
    selectedCSVFile = null;
    document.getElementById('csvFileInput').value = '';
    const lang = localStorage.getItem('my_app_lang') || 'th';
    document.getElementById('csvFileName').innerText = translations[lang].csv_drop_text;
    document.getElementById('csvDropZone').style.borderColor = '#cbd5e1';
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    const lang = localStorage.getItem('my_app_lang') || 'th';
    if (file) {
        if (!file.name.endsWith('.csv')) {
            showToast(translations[lang].toast_error, translations[lang].alert_csv_wrong_type, 'error');
            resetCsvUI();
            return;
        }
        selectedCSVFile = file;
        document.getElementById('csvFileName').innerText = `📄 ${file.name}`;
        document.getElementById('csvDropZone').style.borderColor = '#22c55e'; 
    }
}

function processCSV() {
    const lang = localStorage.getItem('my_app_lang') || 'th';
    if (!selectedCSVFile) {
        showToast(translations[lang].toast_warning, translations[lang].alert_csv_no_file, 'warning');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        parseAndSaveCSV(e.target.result);
    };
    reader.readAsText(selectedCSVFile); 
}

function parseAndSaveCSV(csvText) {
    const lang = localStorage.getItem('my_app_lang') || 'th';
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
        showToast(translations[lang].toast_error, translations[lang].alert_csv_empty, 'error');
        return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const idIdx = headers.findIndex(h => h === 'employeeid');
    const nameIdx = headers.findIndex(h => h === 'fullname');
    const emailIdx = headers.findIndex(h => h === 'email');
    const deptIdx = headers.findIndex(h => h === 'deptname');

    if (idIdx === -1 || nameIdx === -1 || emailIdx === -1 || deptIdx === -1) {
        showToast(translations[lang].toast_error, translations[lang].alert_csv_columns, 'error');
        return;
    }

    const users = getUsersFromStorage();
    let importedCount = 0;
    let skippedCount = 0; // ตัวนับว่าข้ามคนซ้ำไปกี่คน

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(val => val.trim());
        if (row.length >= 4) {
            const newId = row[idIdx];

            // 🛑 เช็คว่ารหัสพนักงานนี้ มีอยู่ในระบบแล้วหรือยัง?
            const isDuplicate = users.some(u => u.id === newId);
            
            if (isDuplicate) {
                skippedCount++; // ถ้ารหัสซ้ำ ให้นับไว้แล้วข้ามคนนี้ไปเลย!
                continue; 
            }

            users.push({
                id: newId, name: row[nameIdx], email: row[emailIdx], dept: row[deptIdx],
                role: 'User', status: 'Active', password: ''       
            });
            importedCount++;
            
            const departments = getDepartmentsFromStorage();
            if (!departments.includes(row[deptIdx])) {
                departments.push(row[deptIdx]);
                localStorage.setItem('my_departments', JSON.stringify(departments));
            }
        }
    }

    localStorage.setItem('my_users', JSON.stringify(users));
    renderUsers(); 
    renderDepartments(); 
    closeCsvModal();
    
    // สร้างข้อความแจ้งเตือน (สรุปผลว่าเข้ากี่คน ข้ามซ้ำกี่คน)
    let msg = translations[lang].alert_csv_success.replace('{count}', importedCount);
    if (skippedCount > 0) {
        const skipMsg = lang === 'th' ? ` (ข้ามข้อมูลซ้ำ ${skippedCount} รายการ)` : 
                        lang === 'en' ? ` (Skipped ${skippedCount} duplicates)` : 
                        ` (${skippedCount}件の重複をスキップしました)`;
        msg += skipMsg;
    }
    
    showToast(translations[lang].toast_success, msg, 'success');
}