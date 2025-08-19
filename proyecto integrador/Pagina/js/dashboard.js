document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    checkClientAuth();
    
    // Cargar información del usuario
    loadUserInfo();
    
    // Cargar pedidos del usuario
    loadUserOrders();
    
    // Event listeners
    setupEventListeners();
});

function checkClientAuth() {
    const isAuthenticated = sessionStorage.getItem('userAuthenticated');
    const userRole = sessionStorage.getItem('userRole');
    
    if (!isAuthenticated || userRole !== 'client') {
        window.location.href = '../formulario login.html';
    }
}

function loadUserInfo() {
    // Cargar información básica del usuario
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');
    
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-email').textContent = userEmail;
    
    // Obtener fecha de registro del localStorage
    const users = getRegisteredUsers();
    const currentUser = users.find(user => user.email === userEmail);
    if (currentUser) {
        const registrationDate = new Date(currentUser.registrationDate);
        document.getElementById('user-since').textContent = registrationDate.toLocaleDateString();
    }
}

function loadUserOrders() {
    const userEmail = sessionStorage.getItem('userEmail');
    const orders = getUserOrders(userEmail);
    const ordersList = document.querySelector('.orders-list');

    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders">No tienes pedidos recientes</p>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">Pedido #${order.id}</span>
                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>Cantidad: ${item.quantity}</p>
                            <p>Precio: $${item.price.toLocaleString()}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span class="order-total">Total: $${order.total.toLocaleString()}</span>
                ${order.status === 'Pendiente' ? `
                    <button class="cancel-order-btn" data-order-id="${order.id}">
                        <i class='bx bx-x'></i> Cancelar Pedido
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');

    // Agregar event listeners para los botones de cancelar
    document.querySelectorAll('.cancel-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            cancelOrder(orderId);
        });
    });
}

function getUserOrders(userEmail) {
    const orders = localStorage.getItem('userOrders');
    if (!orders) return [];
    
    const allOrders = JSON.parse(orders);
    return allOrders.filter(order => order.userEmail === userEmail)
                   .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function cancelOrder(orderId) {
    if (confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
        const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'Cancelado';
            localStorage.setItem('userOrders', JSON.stringify(orders));
            loadUserOrders(); // Recargar la lista de pedidos
        }
    }
}

function getRegisteredUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
}

function setupEventListeners() {
    // Botón de editar perfil
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', handleEditProfile);
    }

    // Botón de cerrar sesión
    const logoutBtn = document.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleEditProfile() {
    // Por implementar: Mostrar modal o formulario para editar perfil
    alert('Función de editar perfil en desarrollo');
}

function handleLogout() {
    // Limpiar datos de sesión
    sessionStorage.removeItem('userAuthenticated');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    
    // Redirigir al login
    window.location.href = '../formulario login.html';
} 