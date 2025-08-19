// Authentication check
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
        window.location.href = '../formulario login.html';
    }
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', checkAuth);

class AdminPanel {
    constructor() {
        this.products = [];
        this.users = [];
        this.init();
    }

    init() {
        // Cargar datos iniciales
        this.loadProducts();
        this.loadUsers();
        
        // Configurar event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listeners para productos
        document.getElementById('add-product').addEventListener('click', () => this.showProductModal());
        document.getElementById('product-form').addEventListener('submit', (e) => this.handleProductSubmit(e));
        document.getElementById('inventory-search').addEventListener('input', (e) => this.filterProducts(e.target.value));

        // Event listeners para usuarios
        document.getElementById('add-user').addEventListener('click', () => this.showUserModal());
        document.getElementById('user-form').addEventListener('submit', (e) => this.handleUserSubmit(e));
        document.getElementById('users-search').addEventListener('input', (e) => this.filterUsers(e.target.value));

        // Event listeners para cerrar modales
        document.querySelectorAll('.close-modal, .cancel-button').forEach(element => {
            element.addEventListener('click', () => this.closeModals());
        });
    }

    // Funciones donde cargamos productos 
    loadProducts() {
        // simulacion de como lo podemos cargar a la base de datos 
        this.products = [
            {
                id: 1,
                name: 'Ají Picante Clásico',
                category: 'picante',
                price: 12000,
                stock: 50,
                description: 'Nuestro ají picante tradicional'
            },
            {
                id: 2,
                name: 'Ají Dulce Mango',
                category: 'dulce',
                price: 15000,
                stock: 30,
                description: 'Deliciosa combinación de mango y ají'
            }
        ];
        this.renderProducts();
    }

    renderProducts() {
        const tbody = document.getElementById('inventory-body');
        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toLocaleString()}</td>
                <td>${product.stock}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-button" onclick="adminPanel.editProduct(${product.id})">
                            <i class='bx bx-edit-alt'></i>
                        </button>
                        <button class="delete-button" onclick="adminPanel.deleteProduct(${product.id})">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterProducts(searchTerm) {
        const filtered = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderFilteredProducts(filtered);
    }

    renderFilteredProducts(products) {
        const tbody = document.getElementById('inventory-body');
        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">No se encontraron productos</td>
                </tr>
            `;
            return;
        }
        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toLocaleString()}</td>
                <td>${product.stock}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-button" onclick="adminPanel.editProduct(${product.id})">
                            <i class='bx bx-edit-alt'></i>
                        </button>
                        <button class="delete-button" onclick="adminPanel.deleteProduct(${product.id})">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showProductModal(product = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        const form = document.getElementById('product-form');

        title.textContent = product ? 'Editar Producto' : 'Agregar Producto';
        if (product) {
            form.elements['product-name'].value = product.name;
            form.elements['product-category'].value = product.category;
            form.elements['product-price'].value = product.price;
            form.elements['product-stock'].value = product.stock;
            form.elements['product-description'].value = product.description;
            form.dataset.editId = product.id;
        } else {
            form.reset();
            delete form.dataset.editId;
        }

        modal.style.display = 'block';
    }

    handleProductSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const productData = {
            name: form.elements['product-name'].value,
            category: form.elements['product-category'].value,
            price: parseInt(form.elements['product-price'].value),
            stock: parseInt(form.elements['product-stock'].value),
            description: form.elements['product-description'].value
        };

        if (form.dataset.editId) {
            // Actualizar producto existente
            const id = parseInt(form.dataset.editId);
            this.updateProduct(id, productData);
        } else {
            // Agregar nuevo producto
            productData.id = this.products.length + 1;
            this.products.push(productData);
        }

        this.renderProducts();
        this.closeModals();
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.showProductModal(product);
        }
    }

    updateProduct(id, newData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...newData };
        }
    }

    deleteProduct(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.renderProducts();
        }
    }

    // Funciones para usuarios
    loadUsers() {
        // Simulación de carga de usuarios desde el servidor
        this.users = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@ajidonjose.com',
                role: 'admin',
                status: 'active'
            },
            {
                id: 2,
                username: 'usuario1',
                email: 'usuario1@gmail.com',
                role: 'user',
                status: 'active'
            }
        ];
        this.renderUsers();
    }

    renderUsers() {
        const tbody = document.getElementById('users-body');
        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="status-${user.status}">${user.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-button" onclick="adminPanel.editUser(${user.id})">
                            <i class='bx bx-edit-alt'></i>
                        </button>
                        <button class="delete-button" onclick="adminPanel.deleteUser(${user.id})">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterUsers(searchTerm) {
        const filtered = this.users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderFilteredUsers(filtered);
    }

    renderFilteredUsers(users) {
        const tbody = document.getElementById('users-body');
        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">No se encontraron usuarios</td>
                </tr>
            `;
            return;
        }
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="status-${user.status}">${user.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-button" onclick="adminPanel.editUser(${user.id})">
                            <i class='bx bx-edit-alt'></i>
                        </button>
                        <button class="delete-button" onclick="adminPanel.deleteUser(${user.id})">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showUserModal(user = null) {
        const modal = document.getElementById('user-modal');
        const title = document.getElementById('user-modal-title');
        const form = document.getElementById('user-form');

        title.textContent = user ? 'Editar Usuario' : 'Agregar Usuario';
        if (user) {
            form.elements['user-name'].value = user.username;
            form.elements['user-email'].value = user.email;
            form.elements['user-role'].value = user.role;
            form.dataset.editId = user.id;
        } else {
            form.reset();
            delete form.dataset.editId;
        }

        modal.style.display = 'block';
    }

    handleUserSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const userData = {
            username: form.elements['user-name'].value,
            email: form.elements['user-email'].value,
            role: form.elements['user-role'].value,
            status: 'active'
        };

        if (form.dataset.editId) {
            // Actualizar usuario existente
            const id = parseInt(form.dataset.editId);
            this.updateUser(id, userData);
        } else {
            // Agregar nuevo usuario
            userData.id = this.users.length + 1;
            this.users.push(userData);
        }

        this.renderUsers();
        this.closeModals();
    }

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            this.showUserModal(user);
        }
    }

    updateUser(id, newData) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...newData };
        }
    }

    deleteUser(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            this.users = this.users.filter(u => u.id !== id);
            this.renderUsers();
        }
    }

    // Funciones generales
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Inicializar el panel de administración
const adminPanel = new AdminPanel(); 