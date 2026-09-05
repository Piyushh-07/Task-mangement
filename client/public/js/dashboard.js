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

// Textarea word counter
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("description");
  const counter = document.getElementById("wordCount");
  const maxLength = 100;

  if (textarea && counter) {
    textarea.addEventListener("input", () => {
      const words = textarea.value.trim().split(/\s+/).filter(Boolean);
      counter.textContent = `${words.length}/${maxLength}`;
      if (words.length > maxLength) {
        counter.classList.add("text-danger");
      } else {
        counter.classList.remove("text-danger");
      }
    });
  }
});

// Main dashboard logic
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

  // Set today's date as min for deadline
  const todayDateStr = new Date().toISOString().split("T")[0];
  const deadlineInput = document.getElementById("deadline");
  if (deadlineInput) {
    deadlineInput.setAttribute("min", todayDateStr);
  }

  // Initialize Select2 placeholder
  $('#employee').select2({
    placeholder: "Select Employee",
    allowClear: true
  });

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

  // Fetch metrics stats
  async function fetchStats() {
    try {
      const res = await fetch('/api/tasks/stats');
      if (res.ok) {
        const data = await res.json();
        const { totalThisMonth, completed, pending } = data.data;
        document.getElementById('totalTasksCount').textContent = totalThisMonth;
        document.getElementById('completedTasksCount').textContent = completed;
        document.getElementById('pendingTasksCount').textContent = pending;
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }

  // Fetch employees and populate select dropdown
  async function fetchEmployees() {
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        const employees = data.data;
        const employeeSelect = $('#employee');
        
        employeeSelect.empty();
        employeeSelect.append(new Option("Select Employee", "", true, true));
        employeeSelect.find('option:first').attr('disabled', 'disabled');

        employees.forEach(emp => {
          const optionText = `${emp.name} (${emp.designation})`;
          employeeSelect.append(new Option(optionText, emp._id));
        });

        employeeSelect.trigger('change');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  }

  // Fetch recent tasks table
  async function fetchRecentTasks() {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const result = await res.json();
        const tasks = result.data;
        const recentTasks = tasks.slice(0, 4); // Show only first 4 recent tasks
        const tbody = document.getElementById('recentTasksTableBody');
        
        if (tbody) {
          tbody.innerHTML = '';
          if (recentTasks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No tasks assigned yet.</td></tr>`;
            return;
          }

          recentTasks.forEach(task => {
            const formattedDate = new Date(task.dueDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            }).replace(/\//g, '-');

            const badgeClass = task.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark';
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${task.assignedTo ? task.assignedTo.name : 'Unknown'}</td>
              <td>${task.title}</td>
              <td>${formattedDate}</td>
              <td>${task.assignedBy}</td>
              <td><span class="badge ${badgeClass}">${task.status}</span></td>
            `;
            tbody.appendChild(tr);
          });
        }
      }
    } catch (err) {
      console.error('Error fetching recent tasks:', err);
    }
  }

  // Handle Assign Task form submit
  const assignForm = document.getElementById('assignTaskForm');
  if (assignForm) {
    assignForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('taskName').value.trim();
      const assignedTo = $('#employee').val();
      const dueDate = document.getElementById('deadline').value;
      const description = document.getElementById('description').value.trim();
      // Creator's designation string (simplified)
      const assignedBy = currentUser.designation;

      if (!assignedTo) {
        alert('Please select an employee.');
        return;
      }

      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, description, assignedTo, assignedBy, dueDate })
        });

        const data = await res.json();

        if (res.ok) {
          alert('Task assigned successfully!');
          assignForm.reset();
          $('#employee').val(null).trigger('change');
          const counter = document.getElementById("wordCount");
          if (counter) counter.textContent = '0/100';

          fetchStats();
          fetchRecentTasks();
        } else {
          alert(data.message || 'Failed to assign task.');
        }
      } catch (err) {
        console.error('Error assigning task:', err);
        alert('An error occurred.');
      }
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

  // Load everything
  fetchStats();
  fetchEmployees();
  fetchRecentTasks();
});
