async function buscarClima() {
  const ciudad = document.getElementById('ciudad').value;
  const apiKey = "your_api_key_here"; // Reemplaza con tu API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    if (datos.cod === 200) {
      document.getElementById('resultado').innerHTML = `Temperatura en ${datos.name}: ${datos.main.temp}°C`;
    } else {
      document.getElementById('resultado').innerHTML = `Ciudad no encontrada.`;
    }
  } catch (error) {
    console.error('Error al buscar el clima:', error);
  }
}