// ==========================================================================
// 🚀 INIT: โหลดคำสั่งเมื่อเปิดหน้าเว็บ
// ==========================================================================

// โหลดข้อมูลแผนกขึ้นมาแสดงทันทีที่เปิดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    renderDepartments();
});

// คลิกที่ว่างๆ บนหน้าเว็บ เพื่อปิด Dropdown อัตโนมัติ
window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('profileDropdown');
    const container = document.querySelector('.user-profile-container');
    
    if (container && !container.contains(e.target) && dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});


// ==========================================================================
// 🧭 1. ระบบนำทางและ UI (Navigation & Dropdown)
// ==========================================================================

// ฟังก์ชันสำหรับสลับหน้าจอ (Tab)
function switchTab(tabId, element) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');

    // ดึงภาษาปัจจุบันมาใช้
    const currentLang = localStorage.getItem('my_app_lang') || 'th';
    const pageTitle = document.getElementById('page-title');
    
    if (translations[currentLang] && translations[currentLang]['page_' + tabId]) {
        pageTitle.innerText = translations[currentLang]['page_' + tabId];
    }
}


// ==========================================================================
// 📊 2. ภาพรวมระบบ (Dashboard Stats)
// ==========================================================================

// ฟังก์ชันอัปเดตตัวเลขหน้า Dashboard
// อัปเดตหน้า Dashboard แผนก
function updateDashboardStats() {
    const departments = getDepartmentsFromStorage(); 
    const count = departments.length;
    const lang = localStorage.getItem('my_app_lang') || 'th'; // ดึงภาษาที่ใช้อยู่
    
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

// อัปเดตหน้า Dashboard ผู้ใช้งาน
function updateDashboardUsers(count) {
    const lang = localStorage.getItem('my_app_lang') || 'th'; // ดึงภาษาที่ใช้อยู่
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
// 🏢 3. ระบบจัดการแผนก (Departments - LocalStorage)
// ==========================================================================

// ดึงข้อมูลแผนกจากเบราว์เซอร์
function getDepartmentsFromStorage() {
    const depts = localStorage.getItem('my_departments');
    return depts ? JSON.parse(depts) : []; 
}

// วาดตารางแผนก
function renderDepartments() {
    const tbody = document.getElementById('deptTableBody');
    if (!tbody) return; 
    
    const departments = getDepartmentsFromStorage();
    
    // กรณีไม่มีข้อมูล (Empty State)
    if (departments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 60px 20px;">
                    <i class="fa-regular fa-building" style="font-size: 48px; color: #e2e8f0; margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 15px; font-weight: 500;">ยังไม่มีข้อมูลแผนกในระบบ</p>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">คลิกที่ปุ่ม "เพิ่มแผนกใหม่" ด้านบนมุมขวาเพื่อเริ่มต้น</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // กรณีมีข้อมูล สร้างแถวตาราง
    tbody.innerHTML = ''; 
    departments.forEach((deptName, index) => {
        tbody.innerHTML += `
            <tr>
                <td style="color: var(--text-muted);">${index + 1}</td>
                <td style="font-weight: 500; color: var(--text-main);">${deptName}</td>
                <td style="text-align: center;">
                    <button class="icon-btn edit" title="แก้ไข" onclick="editDepartment(${index})"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete" title="ลบ" onclick="deleteDepartment(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    
    // อัปเดตตัวเลขหน้า Dashboard ทุกครั้งที่มีการวาดตารางใหม่
    updateDashboardStats();
}

// บันทึกแผนกใหม่
function saveDepartment() {
    const input = document.getElementById('deptNameInput');
    const deptName = input.value.trim();
    
    if (deptName === '') {
        alert('กรุณาระบุชื่อแผนกด้วยครับ!');
        return; 
    }
    
    const departments = getDepartmentsFromStorage(); 
    departments.push(deptName); 
    
    localStorage.setItem('my_departments', JSON.stringify(departments)); 
    
    renderDepartments(); 
    closeAddDeptModal(); 
}

// ==========================================
// ระบบลบข้อมูลแบบมี Pop-up ยืนยันสวยงาม
// ==========================================

let deleteTargetIndex = null; // ตัวแปรสำหรับจำว่าเรากำลังจะลบแถวไหน

// 1. กดปุ่มถังขยะ ให้เปิดป๊อปอัปแทน
function deleteDepartment(index) {
    deleteTargetIndex = index; // จำเลขแถวไว้
    document.getElementById('deleteConfirmModal').style.display = 'flex'; // โชว์ป๊อปอัป
}

// 2. ปิดป๊อปอัป (กดยกเลิก)
function closeDeleteModal() {
    document.getElementById('deleteConfirmModal').style.display = 'none';
    deleteTargetIndex = null; // เคลียร์ความจำ
}

// 3. กดยืนยันการลบจริงๆ (ปุ่มสีแดงในป๊อปอัป)
function confirmDelete() {
    if (deleteTargetIndex !== null) {
        const departments = getDepartmentsFromStorage();
        departments.splice(deleteTargetIndex, 1); // สั่งลบข้อมูล
        
        localStorage.setItem('my_departments', JSON.stringify(departments)); // เซฟทับ
        renderDepartments(); // วาดตารางใหม่
        
        closeDeleteModal(); // ปิดป๊อปอัป
    }
}

// ==========================================
// ระบบแก้ไขข้อมูลแบบ Pop-up สวยงาม
// ==========================================

let editTargetIndex = null; // ตัวแปรสำหรับจำว่ากำลังแก้แถวไหน

// 1. กดปุ่มดินสอ ให้เปิดป๊อปอัปและดึงชื่อเดิมมาแสดง
function editDepartment(index) {
    const departments = getDepartmentsFromStorage();
    const currentName = departments[index];
    
    editTargetIndex = index; // จำเลขแถวไว้
    document.getElementById('editDeptNameInput').value = currentName; // เอาชื่อเดิมไปใส่รอไว้ในช่อง
    
    document.getElementById('editDeptModal').style.display = 'flex'; // โชว์ป๊อปอัป
    document.getElementById('editDeptNameInput').focus(); // ให้เคอร์เซอร์กระพริบรอพิมพ์เลย
}

// 2. ปิดป๊อปอัป (กดยกเลิก)
function closeEditModal() {
    document.getElementById('editDeptModal').style.display = 'none';
    editTargetIndex = null; // เคลียร์ความจำ
}

// 3. กดยืนยันการแก้ไข
function confirmEdit() {
    if (editTargetIndex !== null) {
        const input = document.getElementById('editDeptNameInput');
        const newName = input.value.trim();
        
        if (newName === '') {
            alert('กรุณาระบุชื่อแผนกด้วยครับ!');
            return;
        }
        
        const departments = getDepartmentsFromStorage();
        departments[editTargetIndex] = newName; // อัปเดตชื่อใหม่ลงไปในตำแหน่งเดิม
        
        localStorage.setItem('my_departments', JSON.stringify(departments)); // เซฟทับลงเครื่อง
        renderDepartments(); // วาดตารางใหม่
        
        closeEditModal(); // ปิดป๊อปอัป
    }
}

// เปิดป๊อปอัปเพิ่มแผนก
function openAddDeptModal() {
    document.getElementById('addDeptModal').style.display = 'flex';
    document.getElementById('deptNameInput').focus(); 
}

// ปิดป๊อปอัปเพิ่มแผนก
function closeAddDeptModal() {
    document.getElementById('addDeptModal').style.display = 'none';
    document.getElementById('deptNameInput').value = ''; 
}


// ==========================================================================
// 👥 4. ระบบจัดการผู้ใช้งาน (Users)
// ==========================================================================

// ==========================================================================
// 🚨 อัปเดต: ระบบลบข้อมูลแบบครอบจักรวาล (ลบได้ทั้งแผนกและพนักงาน)
// ==========================================================================
let deleteTarget = { type: null, index: null };

function openDeleteModal(type, index) {
    deleteTarget = { type: type, index: index };
    const msg = type === 'dept' ? 'คุณแน่ใจหรือไม่ว่าต้องการลบแผนกนี้?' : 'คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานคนนี้?';
    document.getElementById('deleteConfirmText').innerHTML = msg + '<br>ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้';
    document.getElementById('deleteConfirmModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteConfirmModal').style.display = 'none';
    deleteTarget = { type: null, index: null };
}

function confirmDelete() {
    if (deleteTarget.type === 'dept') {
        const departments = getDepartmentsFromStorage();
        departments.splice(deleteTarget.index, 1);
        localStorage.setItem('my_departments', JSON.stringify(departments));
        renderDepartments();
    } else if (deleteTarget.type === 'user') {
        const users = getUsersFromStorage();
        users.splice(deleteTarget.index, 1);
        localStorage.setItem('my_users', JSON.stringify(users));
        renderUsers();
    }
    closeDeleteModal();
}

// อัปเดตปุ่มลบแผนกให้ใช้ระบบใหม่ (เขียนทับฟังก์ชันเดิม)
function deleteDepartment(index) {
    openDeleteModal('dept', index);
}

// อัปเดตฟังก์ชัน INIT ด้านบนสุดให้โหลดพนักงานด้วย
document.addEventListener('DOMContentLoaded', function() {
    renderDepartments();
    renderUsers(); // สั่งให้โหลดพนักงานตอนเปิดเว็บ
});


// ==========================================================================
// 👥 4. ระบบจัดการผู้ใช้งาน (Users - LocalStorage)
// ==========================================================================

function getUsersFromStorage() {
    const users = localStorage.getItem('my_users');
    return users ? JSON.parse(users) : [];
}

// โหลดรายชื่อแผนกมาใส่ใน Dropdown อัตโนมัติ
function populateDeptDropdown() {
    const deptSelect = document.getElementById('empDept');
    const departments = getDepartmentsFromStorage();
    
    deptSelect.innerHTML = '<option value="">-- เลือกแผนก --</option>';
    departments.forEach(dept => {
        deptSelect.innerHTML += `<option value="${dept}">${dept}</option>`;
    });
}

// วาดตารางผู้ใช้งาน (เวอร์ชันอัปเกรด: รองรับการค้นหาแบบ Real-time)
function renderUsers() {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    
    const allUsers = getUsersFromStorage(); // ดึงข้อมูลพนักงานทั้งหมด
    const searchInput = document.getElementById('searchInput');
    const keyword = searchInput ? searchInput.value.toLowerCase() : ''; // อ่านคำที่พิมพ์มาค้นหา
    
    // 1. กรณีที่ระบบยังไม่มีข้อมูลเลย
    if (allUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 60px 20px;">
                    <i class="fa-solid fa-user-group" style="font-size: 48px; color: #e2e8f0; margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 15px; font-weight: 500;">ยังไม่มีข้อมูลพนักงานในระบบ</p>
                </td>
            </tr>`;
        updateDashboardUsers(0);
        return;
    }
    
    // 🔍 กรองข้อมูลตามคำค้นหา (ชื่อ, รหัส, อีเมล, แผนก)
    const filteredUsers = allUsers.filter(user => {
        return user.name.toLowerCase().includes(keyword) || 
               user.id.toLowerCase().includes(keyword) || 
               user.email.toLowerCase().includes(keyword) ||
               user.dept.toLowerCase().includes(keyword);
    });

    // 2. กรณีค้นหาแล้วไม่เจอใครเลย
    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 60px 20px;">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 40px; color: #e2e8f0; margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 15px; font-weight: 500;">ไม่พบข้อมูลพนักงานที่ตรงกับ "${keyword}"</p>
                </td>
            </tr>`;
        return;
    }
    
    // 3. กรณีค้นหาเจอ ให้วาดตารางเฉพาะคนที่กรองมาได้
    tbody.innerHTML = '';
    filteredUsers.forEach((user) => {
        // หาตำแหน่ง (Index) จริงๆ ของคนๆ นี้ เผื่อเวลากดแก้ไข/ลบ จะได้ทำถูกคน
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
            </tr>
        `;
    });
    
    updateDashboardUsers(allUsers.length); // อัปเดตตัวเลขหน้า Dashboard ให้เป็นจำนวนทั้งหมดเสมอ
}

function updateDashboardUsers(count) {
    const countDisplay = document.getElementById('dashboardUserCount');
    const textDisplay = document.getElementById('dashboardUserText');
    if (countDisplay) countDisplay.innerText = count;
    if (textDisplay) {
        if (count > 0) {
            textDisplay.innerText = `มีข้อมูล ${count} คน เดือนนี้`;
            textDisplay.className = 'text-green fw-bold';
        } else {
            textDisplay.innerText = `ยังไม่มีพนักงานในระบบ`;
            textDisplay.className = 'text-gray';
        }
    }
}

function openAddUserModal() {
    populateDeptDropdown(); // โหลดแผนกก่อนเปิดป๊อปอัป
    document.getElementById('userModalTitle').innerText = 'เพิ่มพนักงานใหม่';
    document.getElementById('editUserIndex').value = ''; // เคลียร์สถานะการแก้
    document.getElementById('addUserModal').style.display = 'flex';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
    const inputs = document.querySelectorAll('#addUserModal input');
    inputs.forEach(input => input.value = ''); // ล้างช่องกรอกทั้งหมด
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

    // เช็คว่ากรอกข้อมูลสำคัญครบไหม
    if (!id || !dept || !name || !email) {
        alert('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วนครับ!');
        return;
    }

    const users = getUsersFromStorage();
    const userData = { id, dept, name, email, role, status, password };

    if (editIndex === '') {
        users.push(userData); // เพิ่มคนใหม่
    } else {
        users[editIndex] = userData; // เซฟทับคนเดิมที่กำลังแก้
    }

    localStorage.setItem('my_users', JSON.stringify(users));
    renderUsers();
    closeAddUserModal();
}

function editUser(index) {
    populateDeptDropdown(); // โหลดแผนก
    const users = getUsersFromStorage();
    const user = users[index];

    // โยนข้อมูลเดิมกลับเข้าไปในช่องให้แก้
    document.getElementById('editUserIndex').value = index;
    document.getElementById('userModalTitle').innerText = 'แก้ไขข้อมูลพนักงาน';
    
    document.getElementById('empId').value = user.id;
    document.getElementById('empDept').value = user.dept;
    document.getElementById('empName').value = user.name;
    document.getElementById('empEmail').value = user.email;
    document.getElementById('empRole').value = user.role;
    document.getElementById('empStatus').value = user.status;
    document.getElementById('empPassword').value = ''; // รหัสผ่านปล่อยว่างไว้เผื่อเปลี่ยน

    document.getElementById('addUserModal').style.display = 'flex';
}
// ==========================================================================
// 📂 ระบบ Import CSV (อ่านไฟล์และบันทึกลงระบบอัตโนมัติ)
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

// รีเซ็ตหน้าจอทุกครั้งที่เปิด/ปิดป๊อปอัป
function resetCsvUI() {
    selectedCSVFile = null;
    document.getElementById('csvFileInput').value = '';
    document.getElementById('csvFileName').innerText = 'คลิกเพื่อเลือกไฟล์ .csv';
    document.getElementById('csvDropZone').style.borderColor = '#cbd5e1';
}

// เมื่อผู้ใช้เลือกไฟล์
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        if (!file.name.endsWith('.csv')) {
            alert('ระบบรองรับเฉพาะไฟล์นามสกุล .csv เท่านั้นครับ!');
            resetCsvUI();
            return;
        }
        selectedCSVFile = file;
        document.getElementById('csvFileName').innerText = `📄 ${file.name}`;
        document.getElementById('csvDropZone').style.borderColor = '#22c55e'; // เปลี่ยนกรอบเป็นสีเขียว
    }
}

// กดปุ่มอัปโหลด
function processCSV() {
    if (!selectedCSVFile) {
        alert('กรุณาคลิกเลือกไฟล์ CSV ก่อนกดอัปโหลดครับ!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        parseAndSaveCSV(text);
    };
    reader.readAsText(selectedCSVFile); // สั่งอ่านไฟล์เป็นข้อความ
}

// แปลงข้อความ CSV เป็นข้อมูลพนักงาน
function parseAndSaveCSV(csvText) {
    // แยกบรรทัด
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');

    if (lines.length < 2) {
        alert('ไฟล์ CSV ไม่มีข้อมูล หรือรูปแบบไม่ถูกต้องครับ!');
        return;
    }

    // อ่านหัวคอลัมน์เพื่อหาตำแหน่ง (เผื่อสลับคอลัมน์กันมา)
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const idIdx = headers.findIndex(h => h === 'employeeid');
    const nameIdx = headers.findIndex(h => h === 'fullname');
    const emailIdx = headers.findIndex(h => h === 'email');
    const deptIdx = headers.findIndex(h => h === 'deptname');

    if (idIdx === -1 || nameIdx === -1 || emailIdx === -1 || deptIdx === -1) {
        alert('คอลัมน์ไม่ถูกต้อง! ไฟล์ต้องมีคอลัมน์: EmployeeID, FullName, Email, DeptName\n(สะกดให้ตรงตัวพิมพ์เล็ก-ใหญ่ตามนี้นะครับ)');
        return;
    }

    const users = getUsersFromStorage();
    let importedCount = 0;

    // อ่านข้อมูลตั้งแต่บรรทัดที่ 2 เป็นต้นไป
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(val => val.trim());

        if (row.length >= 4) {
            const newUser = {
                id: row[idIdx],
                name: row[nameIdx],
                email: row[emailIdx],
                dept: row[deptIdx],
                role: 'User',      // กำหนดสิทธิ์เริ่มต้นเป็น User
                status: 'Active',  // กำหนดสถานะเริ่มต้นเป็น Active
                password: ''       
            };
            users.push(newUser);
            importedCount++;

            // ตรวจสอบแผนก ถ้าเป็นแผนกใหม่ที่ไม่มีในระบบ ให้เพิ่มให้เลย!
            addDeptIfNotExists(row[deptIdx]);
        }
    }

    // เซฟลงระบบและวาดตารางใหม่
    localStorage.setItem('my_users', JSON.stringify(users));
    renderUsers(); 
    renderDepartments(); // อัปเดตแผนกเผื่อมีแผนกใหม่หลุดเข้ามา
    closeCsvModal();
    
    // ทิ้งท้ายด้วยการแจ้งเตือนสวยๆ (ใช้ alert ธรรมดาไปก่อน)
    setTimeout(() => {
        alert(`🎉 อัปโหลดสำเร็จ! นำเข้าข้อมูลพนักงานจำนวน ${importedCount} คน เรียบร้อยแล้ว`);
    }, 300);
}

// ฟังก์ชันเสริม: แอดแผนกให้อัตโนมัติถ้าไม่มี
function addDeptIfNotExists(deptName) {
    if (!deptName) return;
    const departments = getDepartmentsFromStorage();
    if (!departments.includes(deptName)) {
        departments.push(deptName);
        localStorage.setItem('my_departments', JSON.stringify(departments));
    }
}
// ==========================================================================
// 🌍 ระบบเปลี่ยนภาษา (Multi-language Engine)
// ==========================================================================

// 1. พจนานุกรมเก็บคำแปล
// 1. พจนานุกรมเก็บคำแปล (อัปเดตเพิ่มคำในหน้าเว็บ)
// 1. พจนานุกรมเก็บคำแปล (อัปเดตแบบ Full)
const translations = {
    th: {
        menu_dashboard: "ภาพรวมระบบ", menu_departments: "จัดการแผนก", menu_users: "จัดการผู้ใช้งาน", menu_smtp: "ตั้งค่า SMTP",
        page_dashboard: "Admin Dashboard", page_departments: "จัดการแผนก", page_users: "จัดการผู้ใช้งาน", page_smtp: "ตั้งค่า SMTP",
        card_users: "พนักงานทั้งหมด", card_depts: "แผนกทั้งหมด", card_docs_today: "เอกสารวันนี้", card_docs_pending: "เอกสารรออนุมัติ",
        card_desc_today: "อัปโหลดใหม่วันนี้", card_desc_pending: "ที่ยังไม่เสร็จสิ้น", recent_docs: "เอกสารล่าสุดในระบบ", btn_view_all: "ดูทั้งหมด",
        title_dept: "จัดการแผนก", desc_dept: "เพิ่มลบแก้ไขรายชื่อแผนกในองค์กร", btn_add_dept: "เพิ่มแผนกใหม่", th_dept_name: "ชื่อแผนก", th_manage: "จัดการ",
        title_user: "จัดการผู้ใช้งาน", desc_user: "รายชื่อพนักงาน จัดการบัญชีผู้ใช้งาน สิทธิ์ และสถานะ", btn_add_user: "เพิ่มพนักงาน", th_employee: "พนักงาน", th_role: "สิทธิ์ (ROLE)", th_status: "สถานะ",
        title_smtp: "ตั้งค่าการส่งเมล (SMTP)", desc_smtp: "กำหนดค่า Email Server สำหรับระบบแจ้งเตือนอัตโนมัติ",
        
        // --- คำศัพท์ใหม่ที่เพิ่มเข้ามา ---
        th_time: "เวลา", th_creator: "ผู้สร้างเอกสาร", th_doc_title: "หัวข้อเอกสาร", th_status_doc: "สถานะ",
        empty_docs: "ยังไม่มีข้อมูลเอกสารในระบบ",
        stat_users_has: "มีข้อมูล {count} คน เดือนนี้", stat_users_empty: "ยังไม่มีพนักงานในระบบ",
        stat_depts_has: "มีข้อมูล {count} แผนกในระบบ", stat_depts_empty: "ยังไม่ได้ตั้งค่าแผนก",
        empty_users: "ยังไม่มีข้อมูลพนักงานในระบบ", empty_depts: "ยังไม่มีข้อมูลแผนกในระบบ",
        not_found: 'ไม่พบข้อมูลที่ตรงกับ "{keyword}"'
    },
    en: {
        menu_dashboard: "Dashboard", menu_departments: "Departments", menu_users: "Users", menu_smtp: "SMTP Settings",
        page_dashboard: "Admin Dashboard", page_departments: "Manage Departments", page_users: "Manage Users", page_smtp: "SMTP Settings",
        card_users: "Total Employees", card_depts: "Total Departments", card_docs_today: "Today's Docs", card_docs_pending: "Pending Docs",
        card_desc_today: "New uploads today", card_desc_pending: "Unfinished processes", recent_docs: "Recent Documents", btn_view_all: "View All",
        title_dept: "Manage Departments", desc_dept: "Add, edit, or remove company departments", btn_add_dept: "Add Department", th_dept_name: "Department Name", th_manage: "Action",
        title_user: "Manage Users", desc_user: "Employee list, account management, roles, and status", btn_add_user: "Add Employee", th_employee: "Employee", th_role: "Role", th_status: "Status",
        title_smtp: "SMTP Configuration", desc_smtp: "Configure Email Server for automatic notifications",
        
        // --- คำศัพท์ใหม่ที่เพิ่มเข้ามา ---
        th_time: "Time", th_creator: "Creator", th_doc_title: "Document Title", th_status_doc: "Status",
        empty_docs: "No documents in the system yet",
        stat_users_has: "{count} employees this month", stat_users_empty: "No employees in the system",
        stat_depts_has: "{count} departments configured", stat_depts_empty: "No departments configured",
        empty_users: "No employees in the system", empty_depts: "No departments in the system",
        not_found: 'No results found for "{keyword}"'
    },
    jp: {
        menu_dashboard: "ダッシュボード", menu_departments: "部署管理", menu_users: "ユーザー管理", menu_smtp: "SMTP設定",
        page_dashboard: "管理ダッシュボード", page_departments: "部署管理", page_users: "ユーザー管理", page_smtp: "SMTP設定",
        card_users: "全従業員", card_depts: "全部署", card_docs_today: "今日の書類", card_docs_pending: "保留中の書類",
        card_desc_today: "今日の新規アップロード", card_desc_pending: "未完了のプロセス", recent_docs: "最近のドキュメント", btn_view_all: "すべて見る",
        title_dept: "部署管理", desc_dept: "社内部署の追加、編集、削除", btn_add_dept: "部署を追加", th_dept_name: "部署名", th_manage: "操作",
        title_user: "ユーザー管理", desc_user: "従業員リスト、アカウント管理、権限、ステータス", btn_add_user: "従業員を追加", th_employee: "従業員", th_role: "権限 (ROLE)", th_status: "ステータス",
        title_smtp: "SMTP設定", desc_smtp: "自動通知用のメールサーバーを設定",
        
        // --- คำศัพท์ใหม่ที่เพิ่มเข้ามา ---
        th_time: "時間", th_creator: "作成者", th_doc_title: "ドキュメント名", th_status_doc: "ステータス",
        empty_docs: "システムにドキュメントがありません",
        stat_users_has: "今月は {count} 人のデータがあります", stat_users_empty: "システムに従業員がいません",
        stat_depts_has: "システムに {count} の部署があります", stat_depts_empty: "部署が設定されていません",
        empty_users: "システムに従業員がいません", empty_depts: "システムに部署がありません",
        not_found: '"{keyword}" に一致する結果が見つかりません'
    }
};

// 2. ฟังก์ชันสั่งเปลี่ยนภาษา
function changeLanguage(lang) {
    localStorage.setItem('my_app_lang', lang); // เซฟค่าภาษาลงเครื่อง (รีเฟรชแล้วไม่หาย)
    document.getElementById('langSelect').value = lang; // เปลี่ยนตัวเลือกใน Dropdown
    
    // วิ่งหาแท็กที่มี data-i18n ทั้งหน้าเว็บ แล้วเปลี่ยนคำตามพจนานุกรม
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
    
    // อัปเดตข้อความหัวเว็บบนสุดให้ตรงกับภาษา
    const activeMenu = document.querySelector('.sidebar-menu li.active');
    if (activeMenu) {
        const tabId = activeMenu.getAttribute('onclick').match(/'([^']+)'/)[1];
        const pageTitle = document.getElementById('page-title');
        if (pageTitle && translations[lang]['page_' + tabId]) {
            pageTitle.innerText = translations[lang]['page_' + tabId];
        }
    }
    // สั่งให้อัปเดตตัวเลขหน้า Dashboard เป็นภาษาใหม่ทันที
    updateDashboardStats();
    renderUsers();
}

// 3. สั่งให้จำภาษาตอนเปิดหน้าเว็บครั้งแรก (วางแทรกใน DOMContentLoaded)
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('my_app_lang') || 'th';
    changeLanguage(savedLang); 
});