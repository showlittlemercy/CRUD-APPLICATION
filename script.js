const apiBase = 'https://crud-application-1-e5w8.onrender.com/api/records';

const createForm = document.getElementById('createForm');
const recordsTableBody = document.querySelector('#recordsTable tbody');

async function fetchRecords() {
    try {
        const res = await fetch(apiBase + '?_=' + new Date().getTime(), {
            cache: 'no-store'
        });
        if (!res.ok) {
            console.error('Network response not ok:', res.status, res.statusText);
        }
        const result = await res.json();
        console.log("API response:", result);
        const records = Array.isArray(result) ? result : (result.data || result.records || []);
        renderRecords(records);
    } catch (err) {
        console.error('Error fetching records:', err);
    }
}

function renderRecords(records = []) {
    recordsTableBody.innerHTML = '';
    if (!Array.isArray(records)) {
        console.error('renderRecords expects an array but got:', records);
        return;
    }
    records.forEach((rec) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${rec.name}</td>
          <td>${rec.email}</td>
          <td>${rec.age}</td>
          <td>
            <button onclick="onEdit(${rec.id})">Edit</button>
            <button onclick="onDelete(${rec.id})">Delete</button>
          </td>
        `;
        recordsTableBody.appendChild(tr);
    });
}

createForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = createForm.name.value.trim();
    const email = createForm.email.value.trim();
    const age = createForm.age.value.trim();

    if (name && email && age) {
        try {
            const res = await fetch(apiBase, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, age })
            });
            if (!res.ok) {
                console.error('Create record failed:', res.status, res.statusText);
            }
            const data = await res.json();
            console.log('Created:', data);
            createForm.reset();
            fetchRecords();
        } catch (err) {
            console.error('Error creating record:', err);
        }
    }
});

window.onEdit = async function (id) {
    const newName = prompt("Edit name:");
    const newEmail = prompt("Edit email:");
    const newAge = prompt("Edit age:");
    if (newName != null && newEmail != null && newAge != null) {
        try {
            const res = await fetch(`${apiBase}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, email: newEmail, age: newAge })
            });
            if (!res.ok) {
                console.error('Update record failed:', res.status, res.statusText);
            }
            const data = await res.json();
            console.log('Updated:', data);
            fetchRecords();
        } catch (err) {
            console.error('Error updating record:', err);
        }
    }
};

window.onDelete = async function (id) {
    if (confirm("Are you sure you want to delete this record?")) {
        try {
            const res = await fetch(`${apiBase}/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                console.error('Delete record failed:', res.status, res.statusText);
            }
            const data = await res.json();
            console.log('Deleted:', data);
            fetchRecords();
        } catch (err) {
            console.error('Error deleting record:', err);
        }
    }
};

// Initial load
fetchRecords();
