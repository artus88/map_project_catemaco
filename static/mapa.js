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
         const contenido = data.error ? data.error : `
           <strong>Sección:</strong> ${seccion.id}<br>
           <strong> </strong><br>
           <strong> </strong><br>
           <strong>MC:</strong> ${data.MC}   -   ${ ( (data.MC / data.TOTAL_VOTOS) *100).toFixed(1) } % <br> 
           <strong>MORENA:</strong> ${data.MORENA} -   ${ ( (data.MORENA / data.TOTAL_VOTOS) *100).toFixed(1) } %<br>
           <strong>PT:</strong> ${data.PT}  -   ${ ( (data.PT / data.TOTAL_VOTOS) *100).toFixed(1) } %<br>
           <strong>PAN :</strong> ${data.PAN}   -   ${ (( data.PAN / data.TOTAL_VOTOS) *100).toFixed(1) } %<br>
           <strong>PRI:</strong> ${data.PRI}   -   ${ (( data.PRI / data.TOTAL_VOTOS) *100).toFixed(1) } %<br>
           <strong>TOTAL_VOTOS :</strong> ${data.TOTAL_VOTOS}   -   ${ (( data.TOTAL_VOTOS / data.NOMINAL) *100).toFixed(1) } %<br>
           <strong>NOMINAL:</strong> ${data.NOMINAL}
         `;
         document.getElementById("details").innerHTML = contenido;
       });
   });
 });

