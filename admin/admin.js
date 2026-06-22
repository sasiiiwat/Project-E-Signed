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

    setTimeout(() => {
        toast.style.animation = 'fadeOutRight 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

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
                    <i class="fa-regular fa-building" style="font-size: 48px; color: var(--border-color); margin-bottom: 15px; display: block;"></i>
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

let currentUserPage = 1;      
const usersPerPage = 5;       

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
                    <i class="fa-solid fa-user-group" style="font-size: 48px; color: var(--border-color); margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 15px; font-weight: 500;">${translations[lang].empty_users}</p>
                </td>
            </tr>`;
        document.getElementById('userPagination').innerHTML = ''; 
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
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 40px; color: var(--border-color); margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--text-muted); font-size: 15px; font-weight: 500;">${notFoundText}</p>
                </td>
            </tr>`;
        document.getElementById('userPagination').innerHTML = ''; 
        return;
    }
    
    // --- ระบบแบ่งหน้า ---
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentUserPage > totalPages) currentUserPage = totalPages;
    if (currentUserPage < 1) currentUserPage = 1;

    const startIndex = (currentUserPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    tbody.innerHTML = '';
    paginatedUsers.forEach((user) => {
        const originalIndex = allUsers.findIndex(u => u.id === user.id);
        const statusBadge = user.status === 'Active' 
            ? `<span class="status-badge success">Active</span>` 
            : `<span class="status-badge" style="background: rgba(255,255,255,0.05); color: var(--text-muted);">Inactive</span>`;
            
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
    renderUserPagination(filteredUsers.length, totalPages); 
}

function renderUserPagination(totalItems, totalPages) {
    const paginationContainer = document.getElementById('userPagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';
    if (totalItems <= usersPerPage) return; 

    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.disabled = currentUserPage === 1;
    prevBtn.onclick = () => { currentUserPage--; renderUsers(); };
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentUserPage ? 'active' : ''}`;
        pageBtn.innerText = i;
        pageBtn.onclick = () => { currentUserPage = i; renderUsers(); };
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.disabled = currentUserPage === totalPages;
    nextBtn.onclick = () => { currentUserPage++; renderUsers(); };
    paginationContainer.appendChild(nextBtn);
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
    const lang = localStorage.getItem('my_app_lang') || 'th'; 

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
        showToast(translations[lang].toast_success, translations[lang].alert_delete_dept_success, 'success');

    } else if (deleteTarget.type === 'user') {
        const users = getUsersFromStorage();
        users.splice(deleteTarget.index, 1);
        localStorage.setItem('my_users', JSON.stringify(users));
        renderUsers();
        showToast(translations[lang].toast_success, translations[lang].alert_delete_user_success, 'success');
    }
    
    closeDeleteModal();
}

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
    
    // Override Hardcoded color in reset
    const cssBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
    document.getElementById('csvDropZone').style.borderColor = cssBorderColor || '#334155';
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
        document.getElementById('csvDropZone').style.borderColor = '#4ade80'; 
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
    let skippedCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(val => val.trim());
        if (row.length >= 4) {
            const newId = row[idIdx];

            const isDuplicate = users.some(u => u.id === newId);
            
            if (isDuplicate) {
                skippedCount++; 
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
    
    let msg = translations[lang].alert_csv_success.replace('{count}', importedCount);
    if (skippedCount > 0) {
        const skipMsg = lang === 'th' ? ` (ข้ามข้อมูลซ้ำ ${skippedCount} รายการ)` : 
                        lang === 'en' ? ` (Skipped ${skippedCount} duplicates)` : 
                        ` (${skippedCount}件の重複をスキップしました)`;
        msg += skipMsg;
    }
    
    showToast(translations[lang].toast_success, msg, 'success');
}