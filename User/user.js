// 1. ระบบเปลี่ยนหน้าต่าง (Tab Switcher)
function switchTab(tabId, element) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
    
    document.getElementById('page-title').innerText = element.querySelector('span').innerText;

    // ถ้ากดมาหน้าวาดลายเซ็น ให้ปรับขนาดกระดานวาดรูปให้พอดี
    if (tabId === 'signature') {
        resizeCanvas();
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
// 5. ระบบส่งเอกสารใหม่ (Upload, แปะลายเซ็น, กำหนดคิว)
// ==========================================================================

// โชว์ชื่อไฟล์ตอนเลือก PDF
function handlePdfSelect(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('pdfFileName').innerText = file.name;
        document.getElementById('pdfFileName').style.color = 'var(--text-main)';
        document.getElementById('pdfFileName').style.fontWeight = '500';
    }
}

// แปะลายเซ็นลงกระดาษจำลอง
function placeSignatureOnPaper() {
    const savedSig = localStorage.getItem('signature_EMP001');
    if (!savedSig) {
        alert('คุณยังไม่ได้ตั้งค่าลายเซ็นครับ กรุณาไปที่เมนู "ข้อมูลส่วนตัว" ก่อน');
        return;
    }
    
    const sigBox = document.getElementById('placedSignature');
    const imgEl = document.getElementById('placedSignatureImg');
    
    imgEl.src = savedSig;
    sigBox.style.display = 'block';
    
    // จำลองให้ลายเซ็นไปโผล่ตรงกลางกระดาษพอดี
    sigBox.style.top = '50%';
    sigBox.style.left = '50%';
    sigBox.style.transform = 'translate(-50%, -50%)';
}

// ลบลายเซ็นออกจากกระดาษ
function removePlacedSignature() {
    document.getElementById('placedSignature').style.display = 'none';
}

// ระบบคิวผู้รับช่วงต่อ (Routing List)
let routingQueue = [];

function addSigner() {
    const select = document.getElementById('signerSelect');
    const signerName = select.value;
    
    if (!signerName) {
        alert('กรุณาเลือกผู้ลงนามจากเมนูก่อนกดเพิ่มครับ');
        return;
    }
    
    routingQueue.push(signerName);
    renderRoutingList();
    select.value = ''; // รีเซ็ต Dropdown
}

function removeSigner(index) {
    routingQueue.splice(index, 1);
    renderRoutingList();
}

function renderRoutingList() {
    const container = document.getElementById('routingList');
    
    // ถ้าไม่มีใครเลย โชว์กล่องเปล่า
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
    
    // ถ้ามีคน โชว์รายการ
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

// เช็คข้อมูลก่อนกด ยืนยันและส่งเอกสาร
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

    // ผ่านทุกเงื่อนไข โชว์ป๊อปอัปสำเร็จ!
    document.getElementById('successDocName').innerText = docName;
    document.getElementById('successModal').style.display = 'flex';
}

// ปิดป๊อปอัป และล้างข้อมูลเตรียมส่งใบใหม่
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    
    // เคลียร์ฟอร์ม
    document.getElementById('docName').value = '';
    document.getElementById('pdfFileInput').value = '';
    document.getElementById('pdfFileName').innerText = 'คลิกเพื่อเลือกไฟล์ .pdf';
    document.getElementById('pdfFileName').style.color = 'var(--text-muted)';
    document.getElementById('pdfFileName').style.fontWeight = 'normal';
    
    removePlacedSignature();
    routingQueue = [];
    renderRoutingList();
    
    // เด้งกลับไปหน้า Dashboard หลัก
    document.querySelectorAll('.sidebar-menu li')[0].click();
}