 // Crear el mapa centrado en Catemaco
 const map = L.map('map').setView([18.419, -95.122], 10.5);

 // Cargar tiles de OpenStreetMap
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19
 }).addTo(map);

 

 // Dibujar polígonos y agregar eventos
 secciones.forEach(seccion => {
   const poligono = L.polygon(seccion.coords.map(([lon, lat]) => [lat, lon]), { color: 'blue' }).addTo(map);
   const estiloOriginal = { color: 'blue' };
   // Cuando el mouse pasa sobre el polígono
   poligono.on('mouseover', () => {
    poligono.setStyle({ color: 'red' });
    fetch(`/2025/${seccion.id}`)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      document.getElementById("details_2025").innerHTML = data.error;
      document.getElementById("details_2021").innerHTML = data.error;
      return;
    }
    console.log(data)

    // 2025 
    let contenido_2025 = `<strong>Sección:</strong> ${seccion.id}<br><br>`;
    contenido_2025 +=  `<strong>POBLACIONES: </strong> ${data[2025].POBLACION}<br><br>`;
    contenido_2025 +=  `<strong>VOTOS NOMINALES : </strong> ${data[2025].NOMINAL}<br><br>`;

    const datos = data["2025"];
    const clavesExcluidas = ["SECCION", "POBLACION", "NOMINAL", "TOTAL_VOTOS", "error"];

    // Paso 1: Filtrar claves numéricas válidas
    const camposOrdenados = Object.entries(datos)
      .filter(([key, value]) => 
        typeof value === "number" && !clavesExcluidas.includes(key)
      )
      .sort((a, b) => b[1] - a[1]); // Paso 2: Ordenar de mayor a menor
    
    // Paso 3: Construir el contenido ordenado
    for (const [key, value] of camposOrdenados) {
      let extra = "";
    
      if (datos.TOTAL_VOTOS) {
        extra = ` - ${(value / datos.TOTAL_VOTOS * 100).toFixed(1)} %`;
      }
    
      contenido_2025 += `<strong>${key}:</strong> ${value}${extra}<br>`;
    }
    contenido_2025 +=  `<br><strong>VOTOS Totales : </strong> ${data[2025].TOTAL_VOTOS} == >>   ${(data[2025].TOTAL_VOTOS/data[2025].NOMINAL*100).toFixed(1)} %<br><br>`
// 2021
    let contenido_2021 = `<strong>Sección:</strong> ${seccion.id}<br><br>`;
    contenido_2021 +=  `<strong>VOTOS NOMINALES : </strong> ${data[2021].NOMINAL}<br><br>`;
    const datos_2021 = data["2021"];

    // Paso 1: Filtrar claves numéricas válidas
    const camposOrdenados_2021 = Object.entries(datos_2021)
      .filter(([key, value]) => 
        typeof value === "number" && !clavesExcluidas.includes(key)
      )
      .sort((a, b) => b[1] - a[1]); // Paso 2: Ordenar de mayor a menor
    
    // Paso 3: Construir el contenido ordenado
    for (const [key, value] of camposOrdenados_2021) {
      let extra = "";
    
      if (datos_2021.TOTAL_VOTOS) {
        extra = ` - ${(value / datos_2021.TOTAL_VOTOS * 100).toFixed(1)} %`;
      }
    
      contenido_2021 += `<strong>${key}:</strong> ${value}${extra}<br>`;
    }
    contenido_2021 +=  `<br><strong>VOTOS Totales : </strong> ${data[2021].TOTAL_VOTOS} == >>   ${(data[2021].TOTAL_VOTOS/data[2021].NOMINAL*100).toFixed(1)} %<br><br>`




    document.getElementById("details_2025").innerHTML = contenido_2025;
    document.getElementById("details_2021").innerHTML = contenido_2021;
  });

   });
   poligono.on('mouseout', () => {
    // Restaurar color original
    poligono.setStyle({ color: 'green' });
  });
 });

