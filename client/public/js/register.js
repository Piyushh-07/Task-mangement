document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const designation = document.getElementById('designation').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, designation, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Save user to localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('An error occurred during registration.');
  }
});
