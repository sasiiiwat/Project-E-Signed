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
// 5. ระบบประมวลผล PDF และกระดาษจำลอง
// ==========================================================================
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let routingQueue = []; // 🟢 ตัวแปรสำคัญสำหรับเก็บคิวคนเซ็น

function handlePdfSelect(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('pdfFileName').innerText = file.name;
        document.getElementById('pdfFileName').style.color = 'var(--text-main)';
        document.getElementById('pdfFileName').style.fontWeight = '500';
        document.getElementById('removePdfBtn').style.display = 'flex';
        
        // 🟢 เปลี่ยนมาใช้ URL.createObjectURL() ซึ่งเสถียรและเบากว่า
        const fileUrl = URL.createObjectURL(file);
        
        pdfjsLib.getDocument(fileUrl).promise.then(doc => {
            pdfDoc = doc;
            document.getElementById('page_count').textContent = doc.numPages;
            
            document.getElementById('pdfPlaceholderText').style.display = 'none';
            document.getElementById('pdfPagination').style.display = 'flex';
            document.getElementById('pdfRenderWrapper').style.display = 'block';
            
            pageNum = 1; 
            renderPage(pageNum);
        }).catch(err => {
            console.error("PDF Load Error: ", err);
            alert("ไฟล์ PDF มีปัญหา หรือขนาดใหญ่เกินกว่าที่เบราว์เซอร์จะอ่านได้ครับ");
        });
    }
}

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(page => {
        const canvas = document.getElementById('pdfRenderCanvas');
        const ctx = canvas.getContext('2d');
        
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = { canvasContext: ctx, viewport: viewport };
        page.render(renderContext).promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            document.getElementById('pdfRenderWrapper').style.width = '100%';
        });
    });
    
    document.getElementById('page_num').textContent = num;
    removePlacedSignature(); 
}

function queueRenderPage(num) {
    if (pageRendering) { pageNumPending = num; } 
    else { renderPage(num); }
}

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

function removePdfFile() {
    document.getElementById('pdfFileInput').value = '';
    document.getElementById('pdfFileName').innerText = 'คลิกเพื่อเลือกไฟล์ .pdf';
    document.getElementById('pdfFileName').style.color = 'var(--text-muted)';
    document.getElementById('pdfFileName').style.fontWeight = 'normal';
    document.getElementById('removePdfBtn').style.display = 'none';
    
    pdfDoc = null;
    document.getElementById('pdfRenderWrapper').style.display = 'none';
    document.getElementById('pdfPagination').style.display = 'none';
    document.getElementById('pdfPlaceholderText').style.display = 'block';
    
    removePlacedSignature();
}

// 🟢 ลบกล่องทั้งหมดออกจากหน้ากระดาษ (ใช้ตอนเปลี่ยนหน้า หรือลบไฟล์)
function clearAllPaperItems() {
    document.querySelectorAll('.draggable-item').forEach(el => el.remove());
}

// อัปเดตใน renderPage และ removePdfFile ให้เรียก clearAllPaperItems ทันที
// (ระบบจะล้างของเก่าออกเมื่อเปลี่ยนหน้า PDF อัตโนมัติ)

// 🟢 เครื่องมือ: วางลายเซ็น (เพิ่มจุดลากขยาย)
function placeSignatureOnPaper() {
    const savedSig = localStorage.getItem('signature_EMP001');
    if (!savedSig) {
        alert('คุณยังไม่ได้ตั้งค่าลายเซ็นครับ กรุณาไปที่เมนู "ข้อมูลส่วนตัว" ก่อน');
        return;
    }
    createDraggableItem(`
        <div class="sig-wrapper">
            <img src="${savedSig}" alt="ลายเซ็น">
            <div class="resize-handle"></div> </div>
    `);
}

// 🟢 เครื่องมือ: วางวันที่ (เปลี่ยนเป็น Date Picker ปฏิทิน)
function addDateToPaper() {
    const today = new Date();
    // จัดฟอร์แมต YYYY-MM-DD เพื่อให้ปฏิทินเบราว์เซอร์รู้จัก
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateValue = `${yyyy}-${mm}-${dd}`;
    
    createDraggableItem(`<input type="date" class="editable-input" value="${dateValue}">`);
}

// 🟢 เครื่องมือ: วางข้อความ
function addTextToPaper() {
    createDraggableItem(`<input type="text" class="editable-input" placeholder="พิมพ์ข้อความที่นี่...">`);
}

// ==========================================================================
// 🔥 CORE ENGINE: ระบบลากวาง และย่อขยายจากหมุด (Drag, Drop, Resize)
// ==========================================================================
let activeDragItem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// ตัวแปรสำหรับระบบย่อ-ขยาย
let isResizing = false;
let originalWidth = 0;
let originalMouseX = 0;

function createDraggableItem(contentHTML) {
    const wrapper = document.getElementById('pdfRenderWrapper');
    if(wrapper.style.display === 'none' || !wrapper.style.display) {
        alert('กรุณาอัปโหลดไฟล์ PDF ก่อนครับ!');
        return;
    }

    const el = document.createElement('div');
    el.className = 'draggable-item';
    
    el.style.left = (wrapper.offsetWidth / 2 - 75) + 'px';
    el.style.top = '100px'; 

    el.innerHTML = `
        <button class="item-delete-btn" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
        ${contentHTML}
    `;

    el.addEventListener('mousedown', startDrag);
    wrapper.appendChild(el);
}

function startDrag(e) {
    if (e.target.classList.contains('item-delete-btn') || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

    activeDragItem = e.currentTarget;

    // 🟢 ตรวจสอบว่ากำลังจับ "หมุดแดงขยายขนาด" อยู่หรือไม่
    if (e.target.classList.contains('resize-handle')) {
        isResizing = true;
        const sigWrapper = activeDragItem.querySelector('.sig-wrapper');
        originalWidth = sigWrapper.offsetWidth;
        originalMouseX = e.clientX;
    } else {
        // ลากย้ายตำแหน่งปกติ
        isResizing = false;
        activeDragItem.classList.add('active');
        dragOffsetX = e.clientX - activeDragItem.getBoundingClientRect().left;
        dragOffsetY = e.clientY - activeDragItem.getBoundingClientRect().top;
    }

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);
}

function onDrag(e) {
    if (!activeDragItem) return;
    e.preventDefault(); 

    // 🟢 โหมด: ยืดขยายขนาดรูปลายเซ็น
    if (isResizing) {
        const sigWrapper = activeDragItem.querySelector('.sig-wrapper');
        // คำนวณความกว้างใหม่ตามการลากเมาส์
        let newWidth = originalWidth + (e.clientX - originalMouseX);
        
        // ล็อกไม่ให้เล็กหรือใหญ่จนเกินไป (ขั้นต่ำ 50px สูงสุด 500px)
        if (newWidth > 50 && newWidth < 500) { 
            sigWrapper.style.width = newWidth + 'px';
        }
        return; 
    }

    // 🟢 โหมด: ลากย้ายตำแหน่ง
    const wrapper = document.getElementById('pdfRenderWrapper').getBoundingClientRect();
    let x = e.clientX - wrapper.left - dragOffsetX;
    let y = e.clientY - wrapper.top - dragOffsetY;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + activeDragItem.offsetWidth > wrapper.width) x = wrapper.width - activeDragItem.offsetWidth;
    if (y + activeDragItem.offsetHeight > wrapper.height) y = wrapper.height - activeDragItem.offsetHeight;

    activeDragItem.style.left = `${x}px`;
    activeDragItem.style.top = `${y}px`;
}

function endDrag() {
    if (activeDragItem) {
        activeDragItem.classList.remove('active');
        activeDragItem = null;
        isResizing = false; // เคลียร์โหมดเมื่อปล่อยเมาส์
    }
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', endDrag);
}
// ==========================================================================
// 6. ระบบคิวผู้รับช่วงต่อ และค้นหา (Routing & Search)
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
    document.getElementById('deptDropdownSelected').querySelector('span').innerText = '-- แสดงพนักงานทุกแผนก --';
    document.getElementById('signerDeptSelect').value = '';
}

function toggleDeptDropdown(event) {
    event.stopPropagation(); 
    const list = document.getElementById('deptDropdownList');
    const arrow = document.getElementById('deptDropdownArrow');
    document.getElementById('customSignerDropdown').style.display = 'none';

    if (list.style.display === 'flex') {
        list.style.display = 'none';
        arrow.classList.remove('custom-dropdown-arrow-rotate');
    } else {
        list.style.display = 'flex';
        arrow.classList.add('custom-dropdown-arrow-rotate');
    }
}

function selectDeptOption(value, label) {
    document.getElementById('signerDeptSelect').value = value;
    document.getElementById('deptDropdownSelected').querySelector('span').innerText = label;
    document.getElementById('deptDropdownList').style.display = 'none';
    document.getElementById('deptDropdownArrow').classList.remove('custom-dropdown-arrow-rotate');
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
    
    document.getElementById('deptDropdownList').style.display = 'none';
    const deptArrow = document.getElementById('deptDropdownArrow');
    if(deptArrow) deptArrow.classList.remove('custom-dropdown-arrow-rotate');

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

// 🟢 ฟังก์ชันเกี่ยวกับการเพิ่มคนลงคิวกลับมาใช้งานได้ปกติแล้ว
function addSignerFromSearch() {
    const input = document.getElementById('signerSearchInput');
    if (!input) return;
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

function removeSigner(index) {
    routingQueue.splice(index, 1);
    renderRoutingList();
}

function renderRoutingList() {
    const container = document.getElementById('routingList');
    if (!container) return;
    
    if (routingQueue.length === 0) {
        container.innerHTML = `
            <div class="empty-routing" id="emptyRouting">
                <i class="fa-solid fa-users"></i>
                <p>ยังไม่มีรายชื่อผู้รับช่วงต่อ</p>
            </div>`;
        container.style.border = '2px dashed var(--border-color)';
        container.style.background = 'var(--bg-color)';
        return;
    }
    
    container.style.border = '1px solid var(--border-color)';
    container.style.background = '#f8fafc';
    container.innerHTML = '';
    
    routingQueue.forEach((signer, index) => {
        container.innerHTML += `
            <div class="routing-item">
                <div class="routing-num">${index + 1}</div>
                <div class="routing-name">${signer}</div>
                <button class="routing-del" onclick="removeSigner(${index})" title="ลบผู้ลงนาม"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    });
}

function sendDocument() {
    const docName = document.getElementById('docName').value;
    const pdfFile = document.getElementById('pdfFileInput').files[0];
    const isSigPlaced = document.getElementById('placedSignature').style.display === 'block';

    if (!docName || !pdfFile) {
        alert('กรุณากรอก "ชื่อเอกสาร" และ "อัปโหลดไฟล์ PDF" ให้ครบถ้วนครับ');
        return;
    }
    if (!isSigPlaced) {
        alert('อย่าลืมกดปุ่ม "วางลายเซ็นของฉัน" ลงในเอกสารด้วยครับ!');
        return;
    }
    if (routingQueue.length === 0) {
        alert('กรุณาเพิ่ม "รายชื่อผู้รับช่วงต่อ" อย่างน้อย 1 คนครับ');
        return;
    }

    document.getElementById('successDocName').innerText = docName;
    document.getElementById('successModal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    
    if(document.getElementById('signerDeptSelect')) document.getElementById('signerDeptSelect').value = '';
    if(document.getElementById('deptDropdownSelected')) document.getElementById('deptDropdownSelected').querySelector('span').innerText = '-- แสดงพนักงานทุกแผนก --';
    if(document.getElementById('signerSearchInput')) document.getElementById('signerSearchInput').value = '';
    
    document.getElementById('docName').value = '';
    removePdfFile(); 
    routingQueue = [];
    renderRoutingList();
    
    document.querySelectorAll('.sidebar-menu li')[0].click();
}