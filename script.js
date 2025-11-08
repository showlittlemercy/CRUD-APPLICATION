const apiBase = 'https://crud-application-1-e5w8.onrender.com/api/records';

const createForm = document.getElementById('createForm');
const recordsTableBody = document.querySelector('#recordsTable tbody');

const LOCAL_STORAGE_KEY = 'records_app_data';

function loadLocalRecords() {
  const json = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error parsing local data', e);
    return [];
  }
}
function saveLocalRecords(records) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving local data', e);
  }
}

function renderRecords(records = []) {
  recordsTableBody.innerHTML = '';
  records.forEach(rec => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${rec.name}</td>
      <td>${rec.email}</td>
      <td>${rec.age}</td>
      <td>
        <button class="edit-btn" data-id="${rec.id}">Edit</button>
        <button class="delete-btn" data-id="${rec.id}">Delete</button>
      </td>
    `;
    recordsTableBody.appendChild(tr);
  });
}

// when page loads, load local first (so you see something immediately)
document.addEventListener('DOMContentLoaded', () => {
  const local = loadLocalRecords();
  renderRecords(local);
  // then fetch from API and overwrite local & UI
  fetchRecordsFromServer();
});

async function fetchRecordsFromServer() {
  try {
    const res = await fetch(apiBase + '?_=' + new Date().getTime(), {
      cache: 'no-store'
    });
    if (res.ok) {
      const result = await res.json();
      const records = Array.isArray(result) ? result : (result.data || result.records || []);
      saveLocalRecords(records);
      renderRecords(records);
    } else {
      console.error('Server fetch error', res.status, res.statusText);
    }
  } catch (err) {
    console.error('Error fetching server records', err);
  }
}

createForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const age = this.age.value.trim();

  if (name && email && age) {
    const newRec = { name, email, age };

    // send to backend
    try {
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRec)
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Created server record:', data);
        // assume returned `data` is the new record with `id`
        const created = data;

        // update local storage
        const local = loadLocalRecords();
        local.push(created);
        saveLocalRecords(local);

        // update UI
        renderRecords(local);

        createForm.reset();
      } else {
        console.error('Server create failed', res.status, res.statusText);
      }
    } catch (err) {
      console.error('Error creating on server', err);
    }
  }
});

recordsTableBody.addEventListener('click', async function(event) {
  const target = event.target;
  if (target.matches('.delete-btn')) {
    const id = target.getAttribute('data-id');
    if (!id) return;
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          console.log('Deleted on server');
        } else {
          console.error('Server delete failed', res.status, res.statusText);
        }
      } catch (err) {
        console.error('Error deleting on server', err);
      }
      // Also delete in local
      let local = loadLocalRecords();
      local = local.filter(r => String(r.id) !== String(id));
      saveLocalRecords(local);
      renderRecords(local);
    }
  } else if (target.matches('.edit-btn')) {
    const id = target.getAttribute('data-id');
    if (!id) return;
    const newName = prompt('Edit name:');
    const newEmail = prompt('Edit email:');
    const newAge = prompt('Edit age:');
    if (newName != null && newEmail != null && newAge != null) {
      // send to backend
      try {
        const res = await fetch(`${apiBase}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName, email: newEmail, age: newAge })
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Updated on server', data);
        } else {
          console.error('Server update failed', res.status, res.statusText);
        }
      } catch (err) {
        console.error('Error updating on server', err);
      }
      // update local
      const local = loadLocalRecords();
      const idx = local.findIndex(r => String(r.id) === String(id));
      if (idx !== -1) {
        local[idx].name = newName;
        local[idx].email = newEmail;
        local[idx].age = newAge;
        saveLocalRecords(local);
        renderRecords(local);
      }
    }
  }
});
