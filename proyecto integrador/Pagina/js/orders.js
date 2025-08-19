// Función para crear un nuevo pedido
function createOrder(orderData) {
    // Obtener pedidos existentes
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    
    // Crear nuevo pedido
    const newOrder = {
        id: generateOrderId(),
        userEmail: sessionStorage.getItem('userEmail'),
        date: new Date().toISOString(),
        status: 'Pendiente',
        ...orderData
    };
    
    // Agregar el nuevo pedido
    orders.push(newOrder);
    
    // Guardar en localStorage
    localStorage.setItem('userOrders', JSON.stringify(orders));
    
    return newOrder;
}

// Generar ID único para el pedido
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Ejemplo de uso:
/*
createOrder({
    items: [
        {
            id: 1,
            name: "Ají Picante",
            price: 12000,
            quantity: 2,
            image: "./img/productos/aji-picante.jpg"
        }
    ],
    total: 24000,
    shippingAddress: "Calle 123 #45-67",
    paymentMethod: "Efectivo"
});
*/

// Función para actualizar el estado de un pedido
function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('userOrders', JSON.stringify(orders));
        return true;
    }
    return false;
}

// Función para obtener un pedido específico
function getOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    return orders.find(order => order.id === orderId);
}

// Función para obtener todos los pedidos de un usuario
function getUserOrders(userEmail) {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    return orders.filter(order => order.userEmail === userEmail)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Función para cancelar un pedido
function cancelOrder(orderId) {
    return updateOrderStatus(orderId, 'Cancelado');
}

// Función para marcar un pedido como completado
function completeOrder(orderId) {
    return updateOrderStatus(orderId, 'Completado');
}

// Función para marcar un pedido como enviado
function shipOrder(orderId) {
    return updateOrderStatus(orderId, 'Enviado');
} 