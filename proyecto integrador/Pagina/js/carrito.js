// Clase para manejar el carrito de compras
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.shipping = 5000; // Costo fijo de envío
        this.init();
    }

    init() {
        this.renderCart();
        this.updateSummary();
        this.updateCartCount();
        this.setupEventListeners();
    }

    // Actualizar el contador del carrito
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Agregar un producto al carrito
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification(`Se aumentó la cantidad de ${product.name}`);
        } else {
            this.items.push({...product, quantity: 1});
            this.showNotification(`${product.name} agregado al carrito`);
        }
        
        this.saveCart();
        this.renderCart();
        this.updateSummary();
        this.updateCartCount();
    }

    // Remover un producto del carrito
    removeItem(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.showNotification(`${item.name} eliminado del carrito`);
            this.items = this.items.filter(item => item.id !== productId);
            this.saveCart();
            this.renderCart();
            this.updateSummary();
            this.updateCartCount();
        }
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            const newQuantity = Math.max(1, Math.min(99, parseInt(quantity) || 1));
            if (newQuantity !== item.quantity) {
                item.quantity = newQuantity;
                this.saveCart();
                this.renderCart();
                this.updateSummary();
                this.updateCartCount();
            }
        }
    }

    // Calcular subtotal
    calculateSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Calcular IVA
    calculateTax() {
        return this.calculateSubtotal() * 0.19;
    }

    // Calcular total
    calculateTotal() {
        return this.calculateSubtotal() + this.calculateTax() + this.shipping;
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    // Mostrar notificación
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Renderizar los items del carrito
    renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        const cartContainer = document.querySelector('.cart-container');

        if (!cartItemsContainer) return; // Si no estamos en la página del carrito

        if (this.items.length === 0) {
            if (cartContainer) cartContainer.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }

        if (cartContainer) cartContainer.style.display = 'grid';
        if (emptyCart) emptyCart.style.display = 'none';

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${item.price.toLocaleString()}</span>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class='bx bx-minus'></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               min="1" max="99"
                               onchange="cart.updateQuantity(${item.id}, this.value)"
                               onfocus="this.select()">
                        <button class="quantity-btn plus" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class='bx bx-plus'></i>
                        </button>
                    </div>
                </div>
                <i class='bx bx-x remove-item' onclick="cart.removeItem(${item.id})"></i>
            </div>
        `).join('');

        // Agregar event listeners para prevenir valores inválidos
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        });
    }

    // Actualizar el resumen de la compra
    updateSummary() {
        const subtotalElement = document.getElementById('subtotal');
        const ivaElement = document.getElementById('iva');
        const envioElement = document.getElementById('envio');
        const totalElement = document.getElementById('total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!subtotalElement) return; // Si no estamos en la página del carrito

        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax();
        const total = this.calculateTotal();

        subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        ivaElement.textContent = `$${tax.toLocaleString()}`;
        envioElement.textContent = `$${this.shipping.toLocaleString()}`;
        totalElement.textContent = `$${total.toLocaleString()}`;

        if (checkoutBtn) {
            checkoutBtn.disabled = this.items.length === 0;
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length > 0) {
                    window.location.href = 'checkout.html';
                }
            });
        }
    }
}

// Inicializar el carrito
const cart = new ShoppingCart(); 