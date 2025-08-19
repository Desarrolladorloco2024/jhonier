//Variables globales
const d = document;
let nameInput = d.querySelector("#productos-select");
let priceInput = d.querySelector("#precio-pro");
let stockInput = d.querySelector("#stock-pro");
let descripcionInput = d.querySelector("#des-pro");
let imagen = d.querySelector("#imagen-pro");
let btnCreate = d.querySelector(".btn-create");
let productUpdate;
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

//Funcion para agregar el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    nameUser.textContent = user.nombre;
};

//Evento para el boton del logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("userLogin");
    location.href = "../login.html"
});

//Evento al botón del form
btnCreate.addEventListener("click", () => {
    // alert("Producto: "+nameInput.value);
    let dataProduct = getDataProduct();
    sendDataProduct(dataProduct);
});

//Evento al navegador para comprobar si recargo la pagina
d.addEventListener("DOMContentLoaded", () => {
    getUser();
    productUpdate = JSON.parse(localStorage.getItem("productEdit"));
    if (productUpdate != null) {
        updateDataProduct();
    }
});

//Función para válidar el formulario y obtener los datos del form
let getDataProduct = () => {
    //Validar form
    let product;
    if (nameInput.value && priceInput.value && stockInput.value && descripcionInput.value && imagen.src) {
        product = {
            nombre: nameInput.value,
            descripcion: descripcionInput.value,
            precio: precioInput.value,
            stock: stockInput.value,
            imagen: imagen.src
        }
        priceInput.value = "";
        descripcionInput.value = "";
        stockInput.value = "";
        imagen.src = "https://m.media-amazon.com/images/I/61XV8PihCwL._SY250_.jpg";
        console.log(product);
    } else {
        alert("Todos los campos son obligatorios");
    }
    return product;
};

//
let sendDataProduct = async (data) => {
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 406) {
            alert("El usuario y/o la contraseña es incorrecto");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
        }
    } catch (error) {
        console.log(error);
    }
};

//Función para editar el producto
let updateDataProduct = () => {
    // Agregar datos a editar en los campos del formulario
    nameInput.value = productUpdate.nombre;
    precioInput.value = productUpdate.precio;
    stockInput.value = productUpdate.stock;
    descripcionInput.value = productUpdate.descripcion;
    imagen.src = productUpdate.imagen;
    let product;
    // Alternar el botón de crear y editar
    let btnEdit = d.querySelector(".btn-update");
    btnCreate.classList.toggle("d-none");
    btnEdit.classList.toggle("d-none");

    // Agregar evento al boton editar
    btnEdit.addEventListener("click", () => {
        product = {
            id: productUpdate.id,
            nombre: nameInput.value,
            descripcion: descripcionInput.value,
            precio: precioInput.value,
            stock: stockInput.value,
            imagen: imagen.src
        }
        // Borrar información del localStorage
        localStorage.removeItem("productEdit");
        // Pasar los datos del producto a la función
        sendUpdateProduct(product);
    });

};

// Función para realizar la petición del servidor
let sendUpdateProduct = async (pro) => {
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(pro)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "../listado-pro.html";
        }
    } catch (error) {
        console.log(error);
    }
}

