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
    // optionally mark a record as “pending” or “failed” if you want
    const statusText = rec._sync === false ? ' (sync failed)' : '';
    tr.innerHTML = `
      <td>${rec.name}${statusText}</td>
      <td>${rec.email}${statusText}</td>
      <td>${rec.age}${statusText}</td>
      <td>
        <button class="edit-btn" data-id="${rec.id}">Edit</button>
        <button class="delete-btn" data-id="${rec.id}">Delete</button>
      </td>
    `;
    recordsTableBody.appendChild(tr);
  });
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  const local = loadLocalRecords();
  renderRecords(local);
  // you can also trigger a retry/sync for failed items here if you want
});

createForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const age = this.age.value.trim();

  if (name && email && age) {
    // 1. Create the record locally (UI + localStorage) immediately
    const localArr = loadLocalRecords();
    const tempId = 'temp_' + Date.now();
    const newRec = {
      id: tempId,
      name,
      email,
      age,
      _sync: false  // mark as not yet synced
    };
    localArr.push(newRec);
    saveLocalRecords(localArr);
    renderRecords(localArr);
    this.reset();

    // 2. Now send to backend
    try {
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content‑Type': 'application/json' },
        body: JSON.stringify({ name, email, age })
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Created on server:', data);
        // replace the temp record with the server record
        const updatedArr = loadLocalRecords().map(rec => {
          if (rec.id === tempId) {
            return { ...data, _sync: true };
          }
          return rec;
        });
        saveLocalRecords(updatedArr);
        renderRecords(updatedArr);
      } else {
        console.error('Server create failed', res.status, res.statusText);
        // you might want to leave the _sync:false and show a message
      }
    } catch (err) {
      console.error('Error creating on server', err);
      // leave as _sync:false so user knows it wasn’t synced
    }
  }
});
