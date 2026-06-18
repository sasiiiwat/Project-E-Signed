// ฟังก์ชันสำหรับสลับหน้าจอ (Tab)
function switchTab(tabId, element) {
    // 1. ซ่อนทุก Section ก่อน
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // 2. ลบคลาส active ออกจากเมนูทุกอัน
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
    });

    // 3. แสดง Section ที่เลือก
    document.getElementById(tabId).classList.add('active');

    // 4. ไฮไลต์เมนูที่ถูกคลิก
    element.classList.add('active');

    // 5. อัปเดตหัวข้อ Header ด้านบนให้ตรงกับเมนูที่เลือก
    const pageTitle = document.getElementById('page-title');
    if(tabId === 'dashboard') pageTitle.innerText = 'Admin Dashboard';
    if(tabId === 'departments') pageTitle.innerText = 'จัดการแผนก';
    if(tabId === 'users') pageTitle.innerText = 'จัดการผู้ใช้งาน';
    if(tabId === 'smtp') pageTitle.innerText = 'ตั้งค่า SMTP';
}

// ฟังก์ชันเปิด-ปิด หน้าต่าง Modal เพิ่มพนักงาน
function openModal() {
    document.getElementById('addUserModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addUserModal').style.display = 'none';
}
// ==========================================
// ระบบ Dropdown โปรไฟล์ผู้ใช้งาน
// ==========================================

// ฟังก์ชันเปิด/ปิด Dropdown
function toggleDropdown(e) {
    e.stopPropagation(); // ป้องกันการส่งคำสั่งคลิกทะลุไปที่อื่น
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

// คลิกที่ว่างๆ บนหน้าเว็บ เพื่อปิด Dropdown อัตโนมัติ
window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('profileDropdown');
    const container = document.querySelector('.user-profile-container');
    
    // ถ้าคลิกนอกกรอบโปรไฟล์ และ Dropdown เปิดอยู่ ให้ปิดซะ
    if (container && !container.contains(e.target) && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});