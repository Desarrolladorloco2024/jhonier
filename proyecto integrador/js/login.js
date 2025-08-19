// Admin credentials (in a real application, these would be stored securely on a server)
const ADMIN_CREDENTIALS = {
    email: 'admin@ajidonjose.com',
    password: 'admin123'
};

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.form-login');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        
        if (!email || !password) {
            showError('Todos los campos son obligatorios');
            return;
        }
        
        // las credenciales del administrador 
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            // Set admin authentication in session storage
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('userRole', 'admin');
            
            // Show success message
            showSuccess('Inicio de sesión exitoso');
            
            // redireciona al panel del a
            setTimeout(() => {
                window.location.href = 'Pagina/admin.html';
            }, 1000);
            return;
        }

        // Check registered users
        const users = getRegisteredUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Set user authentication in session storage
            sessionStorage.setItem('userAuthenticated', 'true');
            sessionStorage.setItem('userRole', 'client');
            sessionStorage.setItem('userName', user.name);
            sessionStorage.setItem('userEmail', user.email);

            // Show success message
            showSuccess('Inicio de sesión exitoso');

            // Redirect to client dashboard
            setTimeout(() => {
                window.location.href = 'Pagina/dashboard.html';
            }, 1000);
        } else {
            showError('Credenciales incorrectas');
        }
    });
});

function getRegisteredUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
}

function showError(message) {
    const errorDiv = document.querySelector('.form-login .alerta-error');
    const successDiv = document.querySelector('.form-login .alerta-exito');
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
}

function showSuccess(message) {
    const errorDiv = document.querySelector('.form-login .alerta-error');
    const successDiv = document.querySelector('.form-login .alerta-exito');
    
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    errorDiv.style.display = 'none';
}
