document.addEventListener('DOMContentLoaded', () => {
    const adminForm = document.querySelector('form');
    const adminTableBody = document.querySelector('tbody');
    const editModalElement = document.getElementById('editModal');
    const editModal = new bootstrap.Modal(editModalElement);
    
    let admins = JSON.parse(localStorage.getItem('admins')) || [];
    let currentRowEditingId = null;

    // --- 1. استدعاء البيانات عند تحميل الصفحة ---
    renderTable();

    // --- 2. إضافة مسؤول جديد مع التحقق ---
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = adminForm.querySelectorAll('input');
        const fullName = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const password = inputs[2].value;

        // التحقق من تكرار البريد الإلكتروني
        if (admins.some(admin => admin.email === email)) {
            alert('هذا البريد الإلكتروني مسجل مسبقاً!');
            return;
        }

        if (fullName && email) {
            const newAdmin = {
                id: Date.now(),
                name: fullName,
                email: email,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            };

            admins.push(newAdmin);
            saveAndRefresh();
            adminForm.reset();
        }
    });

    // --- 3. وظائف الجدول (حذف وتعديل) ---
    adminTableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const adminId = parseInt(target.closest('tr').dataset.id);

        if (target.classList.contains('text-danger')) { // زر الحذف
            if (confirm('هل أنت متأكد من حذف هذا المسؤول؟')) {
                admins = admins.filter(admin => admin.id !== adminId);
                saveAndRefresh();
            }
        }

        if (target.classList.contains('text-muted')) { // زر التعديل
            const admin = admins.find(a => a.id === adminId);
            if (admin) {
                currentRowEditingId = adminId;
                editModalElement.querySelector('input[type="text"]').value = admin.name;
                editModalElement.querySelector('input[type="email"]').value = admin.email;
                editModal.show();
            }
        }
    });

    // --- 4. حفظ التعديلات في Local Storage ---
    editModalElement.querySelector('.btn-primary').addEventListener('click', () => {
        const newName = editModalElement.querySelector('input[type="text"]').value.trim();
        const newEmail = editModalElement.querySelector('input[type="email"]').value.trim();

        if (currentRowEditingId) {
            admins = admins.map(admin => {
                if (admin.id === currentRowEditingId) {
                    return { ...admin, name: newName, email: newEmail };
                }
                return admin;
            });
            saveAndRefresh();
            editModal.hide();
            currentRowEditingId = null;
        }
    });

    // --- وظائف مساعدة ---

    function saveAndRefresh() {
        localStorage.setItem('admins', JSON.stringify(admins));
        renderTable();
    }

    function renderTable() {
        adminTableBody.innerHTML = ''; // مسح الجدول الحالي
        
        admins.forEach(admin => {
            const firstLetter = admin.name.charAt(0).toUpperCase();
            const row = `
                <tr data-id="${admin.id}">
                    <td class="ps-4 py-3"><span class="admins-pic me-2">${firstLetter}</span> <b>${admin.name}</b></td>
                    <td>${admin.email}</td>
                    <td>${admin.date}</td>
                    <td class="text-center">
                        <button class="admins-btn-icon text-muted"><i class="bi bi-pencil-square"></i></button>
                        <button class="admins-btn-icon text-danger"><i class="bi bi-trash3"></i></button>
                    </td>
                </tr>
            `;
            adminTableBody.insertAdjacentHTML('beforeend', row);
        });
    }
});