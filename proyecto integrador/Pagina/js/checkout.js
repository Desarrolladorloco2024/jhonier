class Checkout {
    constructor() {
        this.cart = new ShoppingCart();
        this.form = document.getElementById('checkout-form');
        this.paymentMethod = document.querySelector('input[name="metodo-pago"]:checked');
        this.cardFields = document.getElementById('tarjeta-fields');
        this.promoCodeButton = document.querySelector('.promo-code-button');
        this.confirmButton = document.querySelector('.confirm-button');
        
        this.init();
    }

    init() {
        this.renderOrderSummary();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Manejar cambio de método de pago
        document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.paymentMethod = e.target;
                this.toggleCardFields();
            });
        });

        // Manejar código promocional
        if (this.promoCodeButton) {
            this.promoCodeButton.addEventListener('click', () => {
                this.handlePromoCode();
            });
        }

        // Manejar envío del formulario
        if (this.confirmButton) {
            this.confirmButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }

        // Validación en tiempo real de los campos de tarjeta
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');

        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                e.target.value = this.formatCardNumber(e.target.value);
            });
        }

        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                e.target.value = this.formatCardExpiry(e.target.value);
            });
        }

        if (cardCvv) {
            cardCvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
            });
        }
    }

    renderOrderSummary() {
        const orderItems = document.querySelector('.order-items');
        const items = this.cart.items;

        if (items.length === 0) {
            window.location.href = 'carrito.html';
            return;
        }

        orderItems.innerHTML = items.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">$${item.price.toLocaleString()}</div>
                    <div class="item-quantity">Cantidad: ${item.quantity}</div>
                </div>
            </div>
        `).join('');

        // Actualizar totales
        const subtotal = this.cart.calculateSubtotal();
        const tax = this.cart.calculateTax();
        const total = this.cart.calculateTotal();

        document.getElementById('checkout-subtotal').textContent = `$${subtotal.toLocaleString()}`;
        document.getElementById('checkout-iva').textContent = `$${tax.toLocaleString()}`;
        document.getElementById('checkout-envio').textContent = 'Gratis';
        document.getElementById('checkout-total').textContent = `$${total.toLocaleString()}`;
    }

    toggleCardFields() {
        if (this.cardFields) {
            this.cardFields.style.display = this.paymentMethod.value === 'tarjeta' ? 'grid' : 'none';
        }
    }

    formatCardNumber(value) {
        const val = value.replace(/\D/g, '');
        const groups = val.match(/.{1,4}/g) || [];
        return groups.join(' ').substr(0, 19);
    }

    formatCardExpiry(value) {
        let val = value.replace(/\D/g, '');
        if (val.length >= 2) {
            return val.substr(0, 2) + (val.length > 2 ? '/' + val.substr(2, 2) : '');
        }
        return val;
    }

    handlePromoCode() {
        // Implementar lógica de código promocional aquí
        const code = prompt('Ingresa tu código promocional:');
        if (code) {
            this.showNotification('Código promocional aplicado', 'success');
        }
    }

    validateForm() {
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const direccion = document.getElementById('direccion').value.trim();

        if (!nombre || !correo || !telefono || !direccion) {
            throw new Error('Por favor, complete todos los campos obligatorios.');
        }

        if (!this.validateEmail(correo)) {
            throw new Error('Por favor, ingrese un correo electrónico válido.');
        }

        if (this.paymentMethod.value === 'tarjeta') {
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;

            if (!this.validateCardNumber(cardNumber)) {
                throw new Error('Número de tarjeta inválido.');
            }

            if (!this.validateCardExpiry(cardExpiry)) {
                throw new Error('Fecha de vencimiento inválida.');
            }

            if (!this.validateCardCvv(cardCvv)) {
                throw new Error('CVV inválido.');
            }
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validateCardNumber(number) {
        return /^\d{16}$/.test(number);
    }

    validateCardExpiry(expiry) {
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
        
        const [month, year] = expiry.split('/').map(num => parseInt(num));
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        return month >= 1 && month <= 12 && 
               year >= currentYear && 
               (year > currentYear || month >= currentMonth);
    }

    validateCardCvv(cvv) {
        return /^\d{3}$/.test(cvv);
    }

    async handleSubmit(e) {
        e.preventDefault();

        try {
            this.validateForm();

            // Mostrar indicador de carga
            this.showLoadingIndicator();

            // Simular procesamiento de pago
            await this.processPayment();

            // Limpiar carrito
            localStorage.removeItem('cartItems');

            // Mostrar confirmación
            this.showNotification('¡Pedido realizado con éxito!', 'success');

            // Redireccionar después de 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.hideLoadingIndicator();
        }
    }

    showLoadingIndicator() {
        const button = this.confirmButton;
        button.disabled = true;
        button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Procesando...';
    }

    hideLoadingIndicator() {
        const button = this.confirmButton;
        button.disabled = false;
        button.innerHTML = 'Confirmar Pedido <i class="bx bx-check"></i>';
    }

    async processPayment() {
        // Simular procesamiento de pago
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class='bx bx-${type === 'success' ? 'check-circle' : 'error-circle'}'></i>
            <p>${message}</p>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar checkout
document.addEventListener('DOMContentLoaded', () => {
    new Checkout();
}); 