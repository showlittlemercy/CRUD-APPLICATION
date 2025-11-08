const apiBase = 'https://crud-application-1-e5w8.onrender.com/api/records';

const createForm = document.getElementById('createForm');
const recordsTableBody = document.querySelector('#recordsTable tbody');

const LOCAL_STORAGE_KEY = 'myApp_records';

// Utility: load from localStorage
function loadLocalRecords() {
  const json = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    return json ? JSON.parse(json) : [];
  } catch(e) {
    console.error('Error parsing localStorage records:', e);
    return [];
  }
}

// Utility: save to localStorage
function saveLocalRecords(records) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch(e) {
    console.error('Error saving to localStorage:', e);
  }
}

async function fetchRecords() {
    try {
        const res = await fetch(apiBase + '?_=' + new Date().getTime(), {
            cache: 'no-store'
        });
        if (!res.ok) {
            console.error('Network response not ok:', res.status, res.statusText);
            // fallback to local maybe
        }
        const result = await res.json();
        console.log("API response:", result);
        const records = Array.isArray(result) ? result : (result.data || result.records || []);
        // Save locally
        saveLocalRecords(records);
        renderRecords(records);
    } catch (err) {
        console.error('Error fetching records:', err);
        // fallback: try local storage
        const local = loadLocalRecords();
        console.log('Using local records fallback:', local);
        renderRecords(local);
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

            // Update local storage
            const local = loadLocalRecords();
            local.push(data); // assuming backend returns the new record with id etc
            saveLocalRecords(local);

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

            // Update local storage
            const local = loadLocalRecords();
            const idx = local.findIndex(r => r.id === id);
            if (idx !== -1) {
              local[idx] = data;
            } else {
              // maybe push if not found
              local.push(data);
            }
            saveLocalRecords(local);

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

            // Update local storage
            const local = loadLocalRecords();
            const newLocal = local.filter(r => r.id !== id);
            saveLocalRecords(newLocal);

            fetchRecords();
        } catch (err) {
            console.error('Error deleting record:', err);
        }
    }
};

// Initial load
fetchRecords();
