//Variables globales del form login
const d = document;
userInput = d.querySelector("#usuarioForm");
passInput = d.querySelector("#contraForm");
btnLogin = d.querySelector(".btnLogin");

//Evento al botón del form
btnLogin.addEventListener("click", () => {
    //alert("escribió:"+userInput.value);
    let dataForm = getData();
    sendData(dataForm);
});

//Función para validar form y obtener datos del form
let getData = () => {
    //Validar form
    let user;
    if (userInput.value && passInput.value) {
        user = {
            usuario: userInput.value,
            contrasena: passInput.value
        }
        userInput.value = "";
        passInput.value = "";
    } else {
        alert("El usuario y la contraseña es obligatorio");
    }
    console.log(user);
    return user;
};

//Función para recibir los datos y realizar petición al servidor
let sendData = async (data) => {
    let url = "http://localhost/backend-apiCrud/login";
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 401) {
            alert("El usuario y/o la contraseña es incorrecto");
        } else {
            let userLogin = await respuesta.json();
            alert(`Bienvenido ${userLogin.nombre}`);
            //guardar datos en el localStorage
            localStorage.setItem("userLogin", JSON.stringify(userLogin));
            location.href = "../index.html";
        }
    } catch (error) {
        console.log(error);
    }
};