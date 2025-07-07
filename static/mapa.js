 
// 1. Extraer el ID del municipio de la URL
const pathParts = window.location.pathname.split('/');
const mun_id = pathParts[pathParts.length - 1];
console.log("mun_id extraído:", mun_id);

// Variable global para el mapa, se inicializará después
let map;

/**
 * Carga las secciones desde el GeoJSON, calcula el centro geográfico del municipio
 * y devuelve tanto las secciones como el centro.
 * @param {string} mun_id - El ID del municipio a cargar.
 * @returns {Promise<object>} Un objeto con {secciones, centro}.
 */
async function cargarDatosGeograficos(mun_id) {
  const secciones = [];
  let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;

  const response = await fetch("/static/SECCION_V2.geojson");
  const geojson = await response.json();

  geojson.features.forEach(feature => {
    if (feature.properties.MUNICIPIO === parseInt(mun_id)) {
      const seccionId = feature.properties.SECCION.toString();
      const coords = feature.geometry.coordinates[0];
      
      secciones.push({ id: seccionId, coords: coords });

      // Calcular el bounding box para encontrar el centro
      coords.forEach(([lon, lat]) => {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
      });
    }
  });

  // Calcular el centro geográfico
  const centro = [(minLat + maxLat) / 2, (minLon + maxLon) / 2];

  // Si no se encontraron secciones, devolver un centro por defecto (ej. centro de Veracruz)
  if (secciones.length === 0) {
    console.warn(`No se encontraron secciones para el municipio ${mun_id}. Usando centro por defecto.`);
    return { secciones: [], centro: [19.1738, -96.1342] };
  }

  return { secciones, centro };
}

/**
 * Dibuja los polígonos de las secciones en el mapa y les añade los eventos.
 * @param {Array} secciones - La lista de secciones a dibujar.
 */
function dibujarSecciones(secciones) {
  secciones.forEach(seccion => {
    const poligono = L.polygon(seccion.coords.map(([lon, lat]) => [lat, lon]), { color: 'blue' }).addTo(map);

    poligono.on('mouseover', () => {
      poligono.setStyle({ color: 'red' });
      fetch(`/map/${mun_id}/${seccion.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            document.getElementById("details_2025").innerHTML = data.error;
            document.getElementById("details_2021").innerHTML = data.error;
            document.getElementById("details_2017").innerHTML = data.error;
            return;
          }
          
          // Lógica para mostrar los detalles de 2025
          let contenido_2025 = `<strong>Sección:</strong> ${seccion.id}<br>`;
          console.log(data)
          if (data["2025"]) {
            contenido_2025 += `<strong>POBLACIONES:</strong> ${data["2025"].POBLACION || 'N/A'}<br>`;
            contenido_2025 += `<strong>VOTOS NOMINALES:</strong> ${data["2025"].NOMINAL || 'N/A'}<br><br>`;
            const datos_2025 = data["2025"];
            const clavesExcluidas = ["SECCION", "POBLACION", "NOMINAL", "TOTAL_VOTOS", "error"];
            const camposOrdenados = Object.entries(datos_2025)
              .filter(([key, value]) => typeof value === "number" && !clavesExcluidas.includes(key))
              .sort((a, b) => b[1] - a[1]);
            camposOrdenados.forEach(([key, value]) => { 
              const porcentaje = datos_2025.TOTAL_VOTOS ? ` - ${(value / datos_2025.TOTAL_VOTOS * 100).toFixed(1)}%` : '';
              contenido_2025 += `<strong>${key}:</strong> ${value}${porcentaje}<br>`;
            });
            contenido_2025 += `<br><strong>VOTOS TOTALES:</strong> ${datos_2025.TOTAL_VOTOS} (${(datos_2025.TOTAL_VOTOS / datos_2025.NOMINAL * 100).toFixed(1)}%)<br>`;
          } else {
            contenido_2025 += 'No hay datos para 2025.';
          }
          document.getElementById("details_2025").innerHTML = contenido_2025;

          // Lógica para mostrar los detalles de 2021
          let contenido_2021 = `<strong>Sección:</strong> ${seccion.id}<br>`;
           if (data["2021"]) {
            contenido_2021 += `<strong>VOTOS NOMINALES:</strong> ${data["2021"].NOMINAL || 'N/A'}<br><br>`;
            const datos_2021 = data["2021"];
            const clavesExcluidas = ["SECCION", "POBLACION", "NOMINAL", "TOTAL_VOTOS", "error"];
            const camposOrdenados_2021 = Object.entries(datos_2021)
              .filter(([key, value]) => typeof value === "number" && !clavesExcluidas.includes(key))
              .sort((a, b) => b[1] - a[1]);
            camposOrdenados_2021.forEach(([key, value]) => {
              const porcentaje = datos_2021.TOTAL_VOTOS ? ` - ${(value / datos_2021.TOTAL_VOTOS * 100).toFixed(1)}%` : '';
              contenido_2021 += `<strong>${key}:</strong> ${value}${porcentaje}<br>`;
            });
            contenido_2021 += `<br><strong>VOTOS TOTALES:</strong> ${datos_2021.TOTAL_VOTOS} (${(datos_2021.TOTAL_VOTOS / datos_2021.NOMINAL * 100).toFixed(1)}%)<br>`;
          } else {
            contenido_2021 += 'No hay datos para 2021.';
          }
          document.getElementById("details_2021").innerHTML = contenido_2021;

                    // Lógica para mostrar los detalles de 2017
          let contenido_2017 = `<strong>Sección:</strong> ${seccion.id}<br>`;
           if (data["2017"]) {
            contenido_2017 += `<strong>VOTOS NOMINALES:</strong> ${data["2017"].NOMINAL || 'N/A'}<br><br>`;
            const datos_2017 = data["2017"];
            const clavesExcluidas = ["SECCION", "POBLACION", "NOMINAL", "TOTAL_VOTOS", "error"];
            const camposOrdenados_2017 = Object.entries(datos_2017)
              .filter(([key, value]) => typeof value === "number" && !clavesExcluidas.includes(key))
              .sort((a, b) => b[1] - a[1]);
            camposOrdenados_2017.forEach(([key, value]) => {
              const porcentaje = datos_2017.TOTAL_VOTOS ? ` - ${(value / datos_2017.TOTAL_VOTOS * 100).toFixed(1)}%` : '';
              contenido_2017 += `<strong>${key}:</strong> ${value}${porcentaje}<br>`;
            });
            contenido_2017 += `<br><strong>VOTOS TOTALES:</strong> ${datos_2017.TOTAL_VOTOS} (${(datos_2017.TOTAL_VOTOS / datos_2017.NOMINAL * 100).toFixed(1)}%)<br>`;
          } else {
            contenido_2017 += 'No hay datos para 2017.';
          }
          document.getElementById("details_2017").innerHTML = contenido_2017;
        });
    });

    poligono.on('mouseout', () => {
      poligono.setStyle({ color: 'blue' });
    });
  });
}

// --- Flujo Principal ---
// Se ejecuta cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  cargarDatosGeograficos(mun_id).then(datos => {
    // 2. Inicializar el mapa con el centro calculado
    map = L.map('map').setView(datos.centro, 11); // Usamos un nivel de zoom fijo, se puede ajustar

    // 3. Cargar los tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // 4. Dibujar las secciones en el mapa
    dibujarSecciones(datos.secciones);
  }).catch(error => {
    console.error("Error al cargar los datos geográficos:", error);
    document.getElementById('map').innerHTML = "No se pudo cargar el mapa. Revise la consola para más detalles.";
  });
});

 

