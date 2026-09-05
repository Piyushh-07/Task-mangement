// Format today's date in sidebar
document.addEventListener("DOMContentLoaded", () => {
  const todaySpan = document.getElementById("today-date");
  if (todaySpan) {
    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    todaySpan.textContent = today;
  }
});

$(document).ready(function() {
  // Check auth
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) {
    window.location.href = 'login.html';
    return;
  }
  const currentUser = JSON.parse(userJson);

  // Set user name
  const userNameEl = document.getElementById('userName');
  if (userNameEl) {
    userNameEl.textContent = currentUser.name;
  }

  // Responsive Sidebar Toggle
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== sidebarToggle) {
        sidebar.classList.remove('active');
      }
    });
  }

  // Fetch and render tasks
  async function fetchAndRenderTasks() {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const result = await res.json();
        const tasks = result.data;
        const tbody = document.getElementById('taskTableBody');
        
        if (tbody) {
          tbody.innerHTML = '';
          
          tasks.forEach(task => {
            const formattedDate = new Date(task.dueDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            }).replace(/\//g, '-');

            const isCompleted = task.status === 'Completed';
            const badgeClass = isCompleted ? 'bg-success' : 'bg-warning text-dark';
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
              <td>${task.assignedTo ? task.assignedTo.name : 'Unknown'}</td>
              <td>${task.title}</td>
              <td>${formattedDate}</td>
              <td>${task.assignedBy}</td>
              <td><span class="badge ${badgeClass}">${task.status}</span></td>
              <td>
                <div class="form-check form-switch">
                  <input class="form-check-input status-switch" type="checkbox" id="switch-${task._id}" data-id="${task._id}" ${isCompleted ? 'checked' : ''}>
                  <label class="form-check-label" for="switch-${task._id}">Done</label>
                </div>
              </td>
            `;
            tbody.appendChild(tr);
          });

          // Attach event listeners to all switches
          document.querySelectorAll('.status-switch').forEach(switchEl => {
            switchEl.addEventListener('change', async () => {
              const taskId = switchEl.getAttribute('data-id');
              const isChecked = switchEl.checked;
              const newStatus = isChecked ? 'Completed' : 'Pending';

              const row = switchEl.closest('tr');
              const badge = row.querySelector('.badge');

              try {
                const patchRes = await fetch(`/api/tasks/${taskId}/status`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ status: newStatus })
                });

                if (patchRes.ok) {
                  if (isChecked) {
                    badge.className = "badge bg-success";
                    badge.textContent = "Completed";
                  } else {
                    badge.className = "badge bg-warning text-dark";
                    badge.textContent = "Pending";
                  }
                } else {
                  switchEl.checked = !isChecked;
                  alert('Failed to update task status.');
                }
              } catch (err) {
                console.error('Error updating task status:', err);
                switchEl.checked = !isChecked;
                alert('An error occurred.');
              }
            });
          });

          // Initialize DataTables
          initializeDataTable();
        }
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  }

  function initializeDataTable() {
    $('#employeeTable').DataTable({
      pageLength: 15,
      lengthMenu: [
        [10, 15, 25, 50, -1],
        [10, 15, 25, 50, "All"]
      ],
      language: {
        lengthMenu: 'Page _MENU_  '
      },
      layout: {
        topStart: ['pageLength', 'buttons']
      },
      buttons: [
        {
          extend: 'csv',
          text: '<i class="bi bi-file-earmark-spreadsheet"></i> CSV',
          className: 'btn-sm',
          exportOptions: {
            columns: ':not(:last-child)'
          }
        },
        {
          extend: 'excel',
          text: '<i class="bi bi-file-earmark-excel"></i> Excel',
          className: 'btn-sm',
          exportOptions: {
            columns: ':not(:last-child)'
          }
        },
        {
          extend: 'pdf',
          text: '<i class="bi bi-file-earmark-pdf"></i> PDF',
          className: 'btn-sm',
          exportOptions: {
            columns: ':not(:last-child)'
          }
        },
        {
          extend: 'print',
          text: '<i class="bi bi-printer"></i> Print',
          className: 'btn-sm',
          exportOptions: {
            columns: ':not(:last-child)'
          }
        }
      ]
    });
  }

  // Handle Logout click
  const logoutLink = document.querySelector('a[href*="login.html"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = '../views/login.html';
    });
  }

  // Start initialization
  fetchAndRenderTasks();
});