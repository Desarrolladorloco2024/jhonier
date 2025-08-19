// Store users in localStorage (in a real app, this would be in a database)
function getRegisteredUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
}

function saveUser(user) {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.form-register');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = registerForm.querySelector('input[name="userName"]').value;
        const email = registerForm.querySelector('input[name="userEmail"]').value;
        const password = registerForm.querySelector('input[name="userPassword"]').value;
        
        // Validaciones básicas
        if (!name || !email || !password) {
            showError('Todos los campos son obligatorios');
            return;
        }

        if (password.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Verificar si el email ya está registrado
        const users = getRegisteredUsers();
        if (users.some(user => user.email === email)) {
            showError('Este correo electrónico ya está registrado');
            return;
        }

        // Crear nuevo usuario
        const newUser = {
            name,
            email,
            password,
            role: 'client',
            registrationDate: new Date().toISOString()
        };

        // Guardar usuario
        saveUser(newUser);
        
        // Mostrar mensaje de éxito
        showSuccess('Registro exitoso. Ahora puedes iniciar sesión');
        
        // Limpiar el formulario
        registerForm.reset();
        
        // Cambiar a la vista de login después de 2 segundos
        setTimeout(() => {
            document.getElementById('sign-in').click();
        }, 2000);
    });
});

function showError(message) {
    const errorDiv = document.querySelector('.form-register .alerta-error');
    const successDiv = document.querySelector('.form-register .alerta-exito');
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
}

function showSuccess(message) {
    const errorDiv = document.querySelector('.form-register .alerta-error');
    const successDiv = document.querySelector('.form-register .alerta-exito');
    
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    errorDiv.style.display = 'none';
} 