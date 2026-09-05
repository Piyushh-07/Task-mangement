document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Save user to localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred during login.');
  }
});
