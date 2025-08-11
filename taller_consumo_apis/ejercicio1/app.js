async function cargarGaleria() {
  try {
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=10');
    const fotos = await respuesta.json();
    const contenedor = document.getElementById('gallery');
    fotos.forEach(foto => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'photo-card';
      tarjeta.innerHTML = `<img src="${foto.thumbnailUrl}" alt="${foto.title}"><p>${foto.title}</p>`;
      contenedor.appendChild(tarjeta);
    });
  } catch (error) {
    console.error('Error al cargar las imágenes:', error);
  }
}
cargarGaleria();