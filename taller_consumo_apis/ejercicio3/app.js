async function buscarPokemon() {
  const nombre = document.getElementById('pokemon').value.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    const habilidades = datos.abilities.map(h => h.ability.name).join(', ');
    const poderes = datos.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join('<br>');
    document.getElementById('tarjeta').innerHTML = `
      <h2>${datos.name}</h2>
      <img src="${datos.sprites.front_default}" alt="${datos.name}">
      <p><strong>Habilidades:</strong> ${habilidades}</p>
      <p><strong>Poderes:</strong><br>${poderes}</p>
    `;
  } catch (error) {
    document.getElementById('tarjeta').innerHTML = 'Pokémon no encontrado.';
    console.error('Error al buscar el Pokémon:', error);
  }
}