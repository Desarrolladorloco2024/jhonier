// Clase para gestionar los productos
class ProductManager {
    constructor() {
        this.products = [
            // Categoría Picante
            {
                id: 1,
                name: 'Ají Picante Clásico',
                price: 12000,
                category: 'picante',
                image: './img/incurtido.jpeg',
                description: 'Nuestro ají picante tradicional, perfecto para cualquier comida'
            },
            {
                id: 2,
                name: 'Ají Picante Jalapeño',
                price: 13500,
                category: 'picante',
                image: './img/incurtido.jpeg',
                description: 'Delicioso ají elaborado con jalapeños frescos'
            },
            {
                id: 3,
                name: 'Ají Picante Chipotle',
                price: 14000,
                category: 'picante',
                image: './img/incurtido.jpeg',
                description: 'Sabor ahumado con un toque de picante'
            },
            {
                id: 4,
                name: 'Ají Picante Tabasco',
                price: 16000,
                category: 'picante',
                image: './img/incurtido.jpeg',
                description: 'Inspirado en la receta original de Tabasco'
            },
            {
                id: 5,
                name: 'Ají Picante Cayena',
                price: 15000,
                category: 'picante',
                image: './img/incurtido.jpeg',
                description: 'Elaborado con pimiento cayena para un picante intenso'
            },
            {
                id: 6,
                name: 'Ají Picante Sriracha',
                price: 17000,
                category: 'picante',
                image: './img/incurtido.jpeg',
                description: 'Versión casera del famoso ají tailandés'
            },

            // Categoría Dulce
            {
                id: 7,
                name: 'Ají Dulce Tradicional',
                price: 15000,
                category: 'dulce',
                image: './img/incurtido.jpeg',
                description: 'El balance perfecto entre dulce y picante'
            },
            {
                id: 8,
                name: 'Ají Dulce con Mango',
                price: 15500,
                category: 'dulce',
                image: './img/Aji de mango.jpeg',
                description: 'Deliciosa combinación de mango maduro y ají'
            },
            {
                id: 10,
                name: 'Ají Dulce Maracuyá',
                price: 15800,
                category: 'dulce',
                image: './img/aji de maracuya.jpeg',
                description: 'La acidez del maracuyá con un toque de picante'
            },

            {
                id: 12,
                name: 'Ají Dulce Tamarindo',
                price: 16000,
                category: 'dulce',
                image: './img/producto2.jpg',
                description: 'Sabor agridulce del tamarindo con picante suave'
            },

            // Categoría Especial
            {
                id: 13,
                name: 'Ají Extra Picante Habanero',
                price: 18000,
                category: 'especial',
                image: './img/producto3.jpg',
                description: 'Nuestro ají más picante, solo para valientes'
            },
           
            {
                id: 15,
                name: 'Ají Especial Thai',
                price: 20000,
                category: 'especial',
                image: './img/producto3.jpg',
                description: 'Receta tradicional tailandesa'
            },
        ];

        this.cart = new ShoppingCart();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts(this.products);
    }

    setupEventListeners() {
        // Búsqueda de productos
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }

        // Filtro por categoría
        const filterSelect = document.querySelector('.filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterProducts(searchInput ? searchInput.value : '', e.target.value);
            });
        }

        // Agregar al carrito
        document.querySelector('.products-grid').addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const productCard = e.target.closest('.product-card');
                const productId = parseInt(productCard.dataset.id);
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    this.cart.addItem(product);
                }
            }
        });
    }

    filterProducts(searchTerm = '', category = 'todos') {
        let filteredProducts = this.products;

        // Filtrar por búsqueda
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower)
            );
        }

        // Filtrar por categoría
        if (category !== 'todos') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === category
            );
        }

        this.renderProducts(filteredProducts);
    }

    renderProducts(products) {
        const grid = document.querySelector('.products-grid');
        
        if (products.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class='bx bx-search-alt'></i>
                    <p>No se encontraron productos</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-overlay">
                        <button class="add-to-cart">
                            <i class='bx bx-cart-add'></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <span class="price">$${product.price.toLocaleString()}</span>
                </div>
            </div>
        `).join('');
    }
}

// Inicializar el gestor de productos
document.addEventListener('DOMContentLoaded', () => {
    new ProductManager();
}); 