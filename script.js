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
    const local = loadLocalRecords();
    console.log('Falling back to local records:', local);
    renderRecords(local);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // load local first
  const local = loadLocalRecords();
  renderRecords(local);
  // then fetch from server
  fetchRecordsFromServer();
});

createForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const age = this.age.value.trim();

  if (name && email && age) {
    const newRec = { name, email, age };

    try {
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRec)
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Created server record:', data);
        // use the returned record (with id) or fallback to newRec with a temp id
        const created = data.id ? data : { ...newRec, id: Date.now() };

        const localArr = loadLocalRecords();
        localArr.push(created);
        saveLocalRecords(localArr);
        renderRecords(localArr);
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
      let localArr = loadLocalRecords();
      localArr = localArr.filter(r => String(r.id) !== String(id));
      saveLocalRecords(localArr);
      renderRecords(localArr);
    }
  } else if (target.matches('.edit-btn')) {
    const id = target.getAttribute('data-id');
    if (!id) return;
    const newName = prompt('Edit name:', '');
    const newEmail = prompt('Edit email:', '');
    const newAge = prompt('Edit age:', '');

    if (newName != null && newEmail != null && newAge != null) {
      try {
        const res = await fetch(`${apiBase}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName.trim(), email: newEmail.trim(), age: newAge.trim() })
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
      const localArr = loadLocalRecords();
      const idx = localArr.findIndex(r => String(r.id) === String(id));
      if (idx !== -1) {
        localArr[idx].name = newName.trim();
        localArr[idx].email = newEmail.trim();
        localArr[idx].age = newAge.trim();
        saveLocalRecords(localArr);
        renderRecords(localArr);
      }
    }
  }
});
