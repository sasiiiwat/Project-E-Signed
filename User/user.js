function switchTab(tabId, element) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
    
    document.getElementById('page-title').innerText = element.querySelector('span').innerText;

    if (tabId === 'signature') {
        resizeCanvas();
    }
    
    // 🔥 เพิ่มคำสั่งนี้เข้าไป: ถ้ากดมาหน้าส่งเอกสารใหม่ ให้รีโหลดข้อมูลรายชื่อพนักงานทันที 🔥
    if (tabId === 'send-doc') {
        initSignerSelection();
    }
}

// 2. ระบบกระดานวาดลายเซ็น (Canvas Logic)
const canvas = document.getElementById('sigCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// ปรับขนาด Canvas ให้ชัดแจ๋ว ไม่เบลอ
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a'; // สีปากกา (กรมท่าเข้ม)
}

// เมื่อกดเมาส์ลง (เริ่มวาด)
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});

// เมื่อลากเมาส์
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
});

// เมื่อปล่อยเมาส์ (หยุดวาด)
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mouseout', () => { isDrawing = false; });

// ฟังก์ชันล้างกระดาน
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ฟังก์ชันเซฟลายเซ็น
function saveSignature() {
    // แปลงรูปวาดให้กลายเป็นข้อมูลภาพ (Base64)
    const dataURL = canvas.toDataURL('image/png');
    
    // บันทึกลง LocalStorage (สมมติว่าเป็นลายเซ็นของ EMP001)
    localStorage.setItem('signature_EMP001', dataURL);
    
    alert('บันทึกลายเซ็นเรียบร้อยแล้วครับ!');
    loadSignatureToDashboard(); // สั่งให้อัปเดตหน้า Dashboard ทันที
    
    // สลับกลับไปหน้า Dashboard เพื่อดูผลงาน
    document.querySelectorAll('.sidebar-menu li')[0].click();
}

// ดึงลายเซ็นไปโชว์ที่หน้า Dashboard และหน้าตั้งค่าฝั่งซ้าย
function loadSignatureToDashboard() {
    const savedSig = localStorage.getItem('signature_EMP001');
    
    // จุดที่ 1: กล่องในหน้า Dashboard
    const previewImg = document.getElementById('previewSignature');
    const noSigText = document.getElementById('noSignatureText');
    
    // จุดที่ 2: กล่องในหน้าตั้งค่าลายเซ็น (ฝั่งซ้าย)
    const currentSigImg = document.getElementById('currentSigImg');
    const noCurrentSigText = document.getElementById('noCurrentSigText');
    const sigStatusBadge = document.getElementById('sigStatusBadge');

    if (savedSig) {
        if(previewImg) { previewImg.src = savedSig; previewImg.style.display = 'block'; noSigText.style.display = 'none'; }
        if(currentSigImg) { 
            currentSigImg.src = savedSig; 
            currentSigImg.style.display = 'block'; 
            noCurrentSigText.style.display = 'none'; 
            sigStatusBadge.style.display = 'inline-block';
        }
    } else {
        if(previewImg) { previewImg.style.display = 'none'; noSigText.style.display = 'block'; }
        if(currentSigImg) { 
            currentSigImg.style.display = 'none'; 
            noCurrentSigText.style.display = 'block'; 
            sigStatusBadge.style.display = 'none';
        }
    }
}
// ==========================================================================
// 4. ระบบตั้งค่าลายเซ็น (สลับแท็บ, อัปโหลด, ลบรูป)
// ==========================================================================

function switchSigTab(tabType) {
    document.querySelectorAll('.sig-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.sig-tab-btn').forEach(b => b.classList.remove('active'));

    if (tabType === 'draw') {
        document.getElementById('tab-draw').classList.add('active');
        document.querySelectorAll('.sig-tab-btn')[0].classList.add('active');
        resizeCanvas(); 
    } else {
        document.getElementById('tab-upload').classList.add('active');
        document.querySelectorAll('.sig-tab-btn')[1].classList.add('active');
    }
}

let tempUploadedSig = null;
function handleSigUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            alert('ระบบรองรับเฉพาะไฟล์ .png, .jpeg และ .svg เท่านั้นครับ!');
            event.target.value = ''; 
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('ขนาดไฟล์เกิน 2MB กรุณาเลือกไฟล์ที่เล็กลงครับ!');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            tempUploadedSig = e.target.result; 
            
            // ซ่อนข้อความ โชว์รูปพรีวิวและปุ่มยกเลิก
            document.getElementById('uploadPlaceholder').style.display = 'none';
            document.getElementById('uploadSigPreview').src = tempUploadedSig;
            document.getElementById('previewContainer').style.display = 'flex'; // แสดงกล่องพรีวิว

            document.getElementById('sigDropZone').style.borderColor = '#dc2626'; 
            document.getElementById('sigDropZone').style.background = '#fef2f2';
        };
        reader.readAsDataURL(file); 
    }
}

// 🟢 ฟังก์ชันใหม่: ลบรูปพรีวิวที่เพิ่งอัปโหลด
function removeUploadPreview() {
    tempUploadedSig = null;
    document.getElementById('sigUploadInput').value = '';
    
    // ซ่อนกล่องพรีวิว โชว์ข้อความกลับมา
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('uploadSigPreview').src = '';
    document.getElementById('uploadPlaceholder').style.display = 'block';
    
    // รีเซ็ตสีกล่องอัปโหลด
    document.getElementById('sigDropZone').style.borderColor = '#cbd5e1';
    document.getElementById('sigDropZone').style.background = '#f8fafc';
}

function saveUploadedSignature() {
    if (!tempUploadedSig) {
        alert('กรุณาคลิกเพื่อเลือกไฟล์รูปภาพก่อนกดบันทึกครับ!');
        return;
    }
    
    localStorage.setItem('signature_EMP001', tempUploadedSig);
    alert('บันทึกลายเซ็นจากรูปภาพเรียบร้อยแล้วครับ!');
    
    loadSignatureToDashboard();
    removeUploadPreview(); // ใช้ฟังก์ชันเคลียร์ค่าที่เขียนไว้ด้านบนได้เลย
}

// 🟢 ฟังก์ชันใหม่: ลบลายเซ็นปัจจุบันที่ถูกเซฟไว้
function deleteCurrentSignature() {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบลายเซ็นปัจจุบัน?')) {
        localStorage.removeItem('signature_EMP001'); // ลบข้อมูลในสมุด
        alert('ลบลายเซ็นออกจากระบบเรียบร้อยแล้วครับ!');
        loadSignatureToDashboard(); // สั่งอัปเดตหน้าจอทันที
    }
}

// อัปเกรด loadSignatureToDashboard ให้เปิด-ปิด ปุ่มลบลายเซ็นได้
function loadSignatureToDashboard() {
    const savedSig = localStorage.getItem('signature_EMP001');
    
    const previewImg = document.getElementById('previewSignature');
    const noSigText = document.getElementById('noSignatureText');
    
    const currentSigImg = document.getElementById('currentSigImg');
    const noCurrentSigText = document.getElementById('noCurrentSigText');
    const sigStatusBadge = document.getElementById('sigStatusBadge');
    const btnDeleteCurrentSig = document.getElementById('btnDeleteCurrentSig');

    if (savedSig) {
        if(previewImg) { previewImg.src = savedSig; previewImg.style.display = 'block'; noSigText.style.display = 'none'; }
        if(currentSigImg) { 
            currentSigImg.src = savedSig; 
            currentSigImg.style.display = 'block'; 
            noCurrentSigText.style.display = 'none'; 
            sigStatusBadge.style.display = 'inline-block';
            if(btnDeleteCurrentSig) btnDeleteCurrentSig.style.display = 'inline-flex'; // โชว์ปุ่มลบ
        }
    } else {
        if(previewImg) { previewImg.style.display = 'none'; noSigText.style.display = 'block'; }
        if(currentSigImg) { 
            currentSigImg.style.display = 'none'; 
            noCurrentSigText.style.display = 'block'; 
            sigStatusBadge.style.display = 'none';
            if(btnDeleteCurrentSig) btnDeleteCurrentSig.style.display = 'none'; // ซ่อนปุ่มลบ
        }
    }
}

// ==========================================================================
// 5. ระบบส่งเอกสารใหม่ (Upload, อ่าน PDF ของจริง, แปะลายเซ็น, กำหนดคิว)
// ==========================================================================

// ==========================================================================
// 5. ระบบส่งเอกสารใหม่ (Upload, อ่าน PDF ของจริง, แปะลายเซ็น, กำหนดคิว)
// ==========================================================================

// 🟢 1. เติมบรรทัดนี้เข้าไปเพื่อให้ PDF.js มีตัวช่วยประมวลผลไฟล์หนักๆ
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// ตัวแปรสำหรับคุม PDF.js
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;

// ฟังก์ชันดึงไฟล์ PDF มาโชว์
function handlePdfSelect(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('pdfFileName').innerText = file.name;
        document.getElementById('pdfFileName').style.color = 'var(--text-main)';
        document.getElementById('pdfFileName').style.fontWeight = '500';
        
        // โชว์ปุ่มลบ
        document.getElementById('removePdfBtn').style.display = 'flex';
        
        // ใช้ FileReader อ่านไฟล์ไปให้ PDF.js
        const reader = new FileReader();
        reader.onload = function(e) {
            const typedarray = new Uint8Array(e.target.result);
            
            // 🟢 2. ปรับวิธีการส่งไฟล์ให้ PDF.js ({ data: typedarray }) เพื่อลดข้อผิดพลาด
            pdfjsLib.getDocument({ data: typedarray }).promise.then(doc => {
                pdfDoc = doc;
                document.getElementById('page_count').textContent = doc.numPages;
                
                // สลับ UI
                document.getElementById('pdfPlaceholderText').style.display = 'none';
                document.getElementById('pdfPagination').style.display = 'flex';
                document.getElementById('pdfRenderWrapper').style.display = 'block';
                
                pageNum = 1; // เริ่มที่หน้า 1
                renderPage(pageNum);
            }).catch(err => {
                console.error("PDF Load Error: ", err); // พิมพ์สาเหตุที่แท้จริงลง Console
                alert("ไฟล์ PDF มีปัญหาหรือไม่สามารถอ่านได้ครับ");
            });
        };
        reader.readAsArrayBuffer(file);
    }
}


// 🟢 ฟังก์ชันวาดกระดาษ PDF ลงจอ
function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(page => {
        const canvas = document.getElementById('pdfRenderCanvas');
        const ctx = canvas.getContext('2d');
        
        // ขยายภาพให้คมชัด (Scale 1.5)
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // วาดลง Canvas
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        const renderTask = page.render(renderContext);

        renderTask.promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            // ย่อขนาด Canvas ให้พอดีกล่อง Container (ให้มัน Scroll ได้ถ้ายาวไป)
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            document.getElementById('pdfRenderWrapper').style.width = '100%';
        });
    });
    
    // อัปเดตเลขหน้า
    document.getElementById('page_num').textContent = num;
    
    // ถ้าย้ายหน้า ให้ซ่อนลายเซ็นไปก่อนเพื่อไม่ให้มั่ว
    removePlacedSignature(); 
}

function queueRenderPage(num) {
    if (pageRendering) { pageNumPending = num; } 
    else { renderPage(num); }
}

// 🟢 ฟังก์ชันเปลี่ยนหน้า ถัดไป/ก่อนหน้า
function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}

// 🟢 ฟังก์ชันลบไฟล์ทิ้ง
function removePdfFile() {
    document.getElementById('pdfFileInput').value = '';
    document.getElementById('pdfFileName').innerText = 'คลิกเพื่อเลือกไฟล์ .pdf';
    document.getElementById('pdfFileName').style.color = 'var(--text-muted)';
    document.getElementById('pdfFileName').style.fontWeight = 'normal';
    document.getElementById('removePdfBtn').style.display = 'none';
    
    // ล้างจอ PDF
    pdfDoc = null;
    document.getElementById('pdfRenderWrapper').style.display = 'none';
    document.getElementById('pdfPagination').style.display = 'none';
    document.getElementById('pdfPlaceholderText').style.display = 'block';
    
    removePlacedSignature();
}
// ==========================================================================
// 6. ระบบค้นหาและกรองผู้ลงนามขั้นสูง (Custom Rounded Dropdown ทั้งหมด)
// ==========================================================================

const defaultCompanyUsers = [
    { name: "สมบูรณ์ (พี่เลี้ยงฝึกงาน)", dept: "Machine 1", status: "Active" },
    { name: "พิเชษฐ์ (หัวหน้าแผนก Machine 1)", dept: "Machine 1", status: "Active" },
    { name: "มานพ (วิศวกรอาวุโส)", dept: "Machine 1", status: "Active" },
    { name: "สุรชัย (ผู้จัดการโรงงาน)", dept: "Production", status: "Active" },
    { name: "นงลักษณ์ (ผู้จัดการ HR)", dept: "Office / HR", status: "Active" },
    { name: "ธนพล (IT Support)", dept: "IT", status: "Active" }
];

let currentFilteredUsers = []; 

function initSignerSelection() {
    const listContainer = document.getElementById('deptDropdownList');
    if (!listContainer) return;

    let allUsers = [];
    const storageUsers = localStorage.getItem('my_users');
    if (storageUsers) allUsers = JSON.parse(storageUsers);
    else allUsers = defaultCompanyUsers;

    let departments = [];
    const storageDepts = localStorage.getItem('my_departments');
    if (storageDepts) departments = JSON.parse(storageDepts);
    else departments = [...new Set(allUsers.map(u => u.dept))].filter(d => d);

    // วาดรายชื่อแผนกลงในกล่อง Custom Dropdown มนๆ
    listContainer.innerHTML = `
        <div class="custom-dropdown-item" onclick="selectDeptOption('', '-- แสดงพนักงานทุกแผนก --')">
            -- แสดงพนักงานทุกแผนก --
        </div>
    `;
    
    departments.forEach(dept => {
        listContainer.innerHTML += `
            <div class="custom-dropdown-item" onclick="selectDeptOption('${dept}', '${dept}')">
                ${dept}
            </div>
        `;
    });

    currentFilteredUsers = allUsers; 
    
    // ตั้งค่าเริ่มต้นของกล่องโชว์
    document.getElementById('deptDropdownSelected').querySelector('span').innerText = '-- แสดงพนักงานทุกแผนก --';
    document.getElementById('signerDeptSelect').value = '';
}

// 🟢 ฟังก์ชันใหม่: เปิด-ปิดกล่องแผนกแบบมน
function toggleDeptDropdown(event) {
    event.stopPropagation(); // กันบั๊กป๊อปอัปปิดตัวเองทันที
    const list = document.getElementById('deptDropdownList');
    const arrow = document.getElementById('deptDropdownArrow');
    
    // สั่งซ่อนกล่องค้นหาพนักงานไว้ก่อนเพื่อไม่ให้มันซ้อนกันจนบังตา
    document.getElementById('customSignerDropdown').style.display = 'none';

    if (list.style.display === 'flex') {
        list.style.display = 'none';
        arrow.classList.remove('custom-dropdown-arrow-rotate');
    } else {
        list.style.display = 'flex';
        arrow.classList.add('custom-dropdown-arrow-rotate');
    }
}

// 🟢 ฟังก์ชันใหม่: เมื่อคลิกเลือกแผนกจากกล่องมน
function selectDeptOption(value, label) {
    document.getElementById('signerDeptSelect').value = value;
    document.getElementById('deptDropdownSelected').querySelector('span').innerText = label;
    document.getElementById('deptDropdownList').style.display = 'none';
    document.getElementById('deptDropdownArrow').classList.remove('custom-dropdown-arrow-rotate');
    
    // สั่งรันการคัดกรองพนักงานตามแผนกทันทีเหมือนของเดิม
    filterSignersByDept();
}

function filterSignersByDept() {
    const selectedDept = document.getElementById('signerDeptSelect').value;
    let allUsers = [];
    const storageUsers = localStorage.getItem('my_users');
    if (storageUsers) allUsers = JSON.parse(storageUsers);
    else allUsers = defaultCompanyUsers;

    currentFilteredUsers = selectedDept ? allUsers.filter(u => u.dept === selectedDept) : allUsers;

    document.getElementById('signerSearchInput').value = '';
    document.getElementById('customSignerDropdown').style.display = 'none';
}

function filterCustomDropdown() {
    const inputVal = document.getElementById('signerSearchInput').value.toLowerCase();
    const dropdown = document.getElementById('customSignerDropdown');
    
    // ซ่อนกล่องแผนกเผื่อเปิดค้างไว้
    document.getElementById('deptDropdownList').style.display = 'none';
    document.getElementById('deptDropdownArrow').classList.remove('custom-dropdown-arrow-rotate');

    const matched = currentFilteredUsers.filter(u =>
        u.status !== 'Inactive' &&
        (u.name.toLowerCase().includes(inputVal) || u.dept.toLowerCase().includes(inputVal))
    );

    if (matched.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    dropdown.innerHTML = '';
    matched.forEach(user => {
        const safeName = user.name.replace(/'/g, "\\'");
        dropdown.innerHTML += `
            <div class="custom-suggest-item" onclick="selectCustomSigner('${safeName}')">
                <span>${user.name}</span>
                <span style="font-size: 11px; color: var(--text-muted); background: var(--bg-color); padding: 2px 8px; border-radius: 10px;">${user.dept}</span>
            </div>
        `;
    });

    dropdown.style.display = 'flex';
}

function selectCustomSigner(name) {
    document.getElementById('signerSearchInput').value = name;
    document.getElementById('customSignerDropdown').style.display = 'none';
    document.getElementById('signerSearchInput').focus();
}

// 🟢 อัปเดตการดักคลิกพื้นที่ว่างนอกกล่อง: ให้ปิดทั้งกล่องแผนก และกล่องรายชื่อพนักงานอัตโนมัติ
document.addEventListener('click', function(e) {
    const deptList = document.getElementById('deptDropdownList');
    const deptSelect = document.getElementById('deptDropdownSelected');
    const deptArrow = document.getElementById('deptDropdownArrow');
    
    if (deptList && deptSelect && !deptSelect.contains(e.target) && !deptList.contains(e.target)) {
        deptList.style.display = 'none';
        if(deptArrow) deptArrow.classList.remove('custom-dropdown-arrow-rotate');
    }

    const dropdown = document.getElementById('customSignerDropdown');
    const input = document.getElementById('signerSearchInput');
    if (dropdown && input && !input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

function addSignerFromSearch() {
    const input = document.getElementById('signerSearchInput');
    let value = input.value.trim();

    if (!value) {
        alert('กรุณาพิมพ์ค้นหาหรือคลิกเลือกรายชื่อผู้ลงนามก่อนครับ');
        return;
    }

    if (value.includes(' (')) {
        value = value.split(' (')[0];
    }

    if (routingQueue.includes(value)) {
        alert('รายชื่อผู้ลงนามนี้ถูกเพิ่มเข้าไปในระบบคิวเรียบร้อยแล้วครับ');
        return;
    }

    routingQueue.push(value);
    renderRoutingList();
    input.value = '';
    document.getElementById('customSignerDropdown').style.display = 'none';
}