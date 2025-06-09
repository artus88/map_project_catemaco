 // Crear el mapa centrado en Catemaco
 const map = L.map('map').setView([18.419, -95.122], 14);

 // Cargar tiles de OpenStreetMap
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19
 }).addTo(map);

 

 // Dibujar polígonos y agregar eventos
 secciones.forEach(seccion => {
   const poligono = L.polygon(seccion.coords.map(([lon, lat]) => [lat, lon]), { color: 'blue' }).addTo(map);

   // Cuando el mouse pasa sobre el polígono
   poligono.on('mouseover', () => {
    fetch(`/map/${seccion.id}`)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      document.getElementById("details_2025").innerHTML = data.error;
      return;
    }
    console.log(data)
    let contenido = `<strong>Sección:</strong> ${seccion.id}<br><br>`;
    contenido +=  `<strong>POBLACIONES: </strong> ${data.POBLACION}<br><br>`;
    contenido +=  `<strong>NOMINAL : </strong> ${data.NOMINAL}<br><br>`;

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined || key === "error") continue;

      let extra = "";

      // Si es un partido, muestra porcentaje sobre TOTAL_VOTOS
      if (typeof value === "number" && data.TOTAL_VOTOS && key !== "TOTAL_VOTOS" && key !== "NOMINAL" ) {
        extra = ` - ${(value / data.TOTAL_VOTOS * 100).toFixed(1)} %`;
      }

      // Si es TOTAL_VOTOS, muestra % sobre NOMINAL
      if (key === "TOTAL_VOTOS" && data.NOMINAL) {
        extra = ` - ${(value / data.NOMINAL * 100).toFixed(1)} %`;
      }

      if( key !== "SECCION" && key !== "POBLACION" && key !== "NOMINAL")
      contenido += `<strong>${key}:</strong> ${value}${extra}<br>`;
    }



    document.getElementById("details_2025").innerHTML = contenido;
  });

   });
 });

