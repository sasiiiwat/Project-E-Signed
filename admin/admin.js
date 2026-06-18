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
    // ซ่อนทุก Section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // ลบคลาส active ออกจากเมนูทุกอัน
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
    });

    // แสดง Section ที่เลือก และไฮไลต์เมนู
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');

    // อัปเดตหัวข้อ Header ด้านบน
    const pageTitle = document.getElementById('page-title');
    if(tabId === 'dashboard') pageTitle.innerText = 'Admin Dashboard';
    if(tabId === 'departments') pageTitle.innerText = 'จัดการแผนก';
    if(tabId === 'users') pageTitle.innerText = 'จัดการผู้ใช้งาน';
    if(tabId === 'smtp') pageTitle.innerText = 'ตั้งค่า SMTP';
}

// ฟังก์ชันเปิด/ปิด Dropdown โปรไฟล์
function toggleDropdown(e) {
    e.stopPropagation(); // ป้องกันการคลิกทะลุ
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}


// ==========================================================================
// 📊 2. ภาพรวมระบบ (Dashboard Stats)
// ==========================================================================

// ฟังก์ชันอัปเดตตัวเลขหน้า Dashboard
function updateDashboardStats() {
    const departments = getDepartmentsFromStorage(); 
    const count = departments.length;
    
    const countDisplay = document.getElementById('dashboardDeptCount');
    const textDisplay = document.getElementById('dashboardDeptText');
    
    if (countDisplay) {
        countDisplay.innerText = count; 
    }
    
    if (textDisplay) {
        if (count > 0) {
            textDisplay.innerText = `มีข้อมูล ${count} แผนกในระบบ`;
            textDisplay.className = 'text-green fw-bold'; 
        } else {
            textDisplay.innerText = `ยังไม่ได้ตั้งค่าแผนก`;
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

// แก้ไขแผนก
function editDepartment(index) {
    const departments = getDepartmentsFromStorage();
    const currentName = departments[index];
    const newName = prompt('แก้ไขชื่อแผนก:', currentName);
    
    if (newName && newName.trim() !== '') {
        departments[index] = newName.trim();
        localStorage.setItem('my_departments', JSON.stringify(departments));
        renderDepartments();
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

// เปิดป๊อปอัปเพิ่มพนักงาน
function openAddUserModal() {
    document.getElementById('addUserModal').style.display = 'flex';
}

// ปิดป๊อปอัปเพิ่มพนักงาน
function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
    
    // ล้างข้อมูลในช่องกรอกเมื่อกดปิด
    const inputs = document.querySelectorAll('#addUserModal input');
    inputs.forEach(input => input.value = '');
}

// (ฟังก์ชันสำรองที่อาจถูกเรียกใช้จาก HTML ปุ่มเก่า)
function openModal() { openAddUserModal(); }
function closeModal() { closeAddUserModal(); }