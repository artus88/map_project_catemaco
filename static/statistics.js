// 1. Extraer el ID del municipio de la URL
const pathParts = window.location.pathname.split('/');
const mun_id = pathParts[pathParts.length - 1];
console.log("mun_id extraído:", mun_id);

/**
 * Función reutilizable para crear un gráfico ECharts.
 * @param {string} elementId - El ID del elemento del DOM donde se renderizará el gráfico.
 * @param {string} year - El año de los datos (ej. "2025").
 * @param {object} statsData - El objeto con los datos de las estadísticas.
 */
const createChart = (elementId, year, statsData) => {
  const chartDom = document.getElementById(elementId);
  if (!chartDom) {
    console.error(`El contenedor del gráfico #${elementId} no se encontró.`);
    return;
  }
  const myChart = echarts.init(chartDom);

  if (!statsData || Object.keys(statsData).length === 0) {
    chartDom.innerHTML = `No hay datos disponibles para ${year}.`;
    return;
  }
  console.log('')
  // Procesar los datos para el formato que necesita el gráfico
  const excludedKeys = ['MUNICIPIO','ID_MUNICIPIO', 'TOTAL_VOTOS', 'NOMINAL'];
  const chartData = Object.entries(statsData)
    .filter(([key, value]) => !excludedKeys.includes(key) && typeof value === 'number')
    .sort(([, a], [, b]) => b - a);

  const categories = chartData.map(([key]) => key);
  const seriesData = chartData.map(([, value]) => value);
  console.log(chartData)
  // Paleta de colores para las barras
  const colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];

  // Configurar las opciones del gráfico
  const option = {
    title: {
      text: `Resultados Electorales ${year} - Municipio ${statsData.MUNICIPIO}`,
      subtext: `Votos Totales: ${statsData.TOTAL_VOTOS || 'N/A'} | Nominal: ${statsData.NOMINAL || 'N/A'} | Participacion: ${(statsData.TOTAL_VOTOS/statsData.NOMINAL*100).toFixed(1) || 'N/A'}%`,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: 'Votos',
      data: seriesData.map((value, index) => ({
        value: value,
        itemStyle: {
          color: colors[index % colors.length]
        }
      })),
      coordinateSystem: 'cartesian2d',
      type: 'bar'
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '20%',
      containLabel: true
    }
  };

  myChart.setOption(option);
};

/**
 * Función principal para cargar los datos y renderizar los gráficos.
 */
const initializeCharts = () => {
  // Realizar la petición fetch para obtener los datos del backend
  fetch(`/statistic/${mun_id}`)
    .then(res => {
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (data.error) {
        document.getElementById("details_2025").innerHTML = `Error: ${data.error}`;
        document.getElementById("details_2021").innerHTML = ""; // Limpiar el otro por si acaso
        document.getElementById("details_2017").innerHTML = ""; // Limpiar el otro por si acaso
        return;
      }

      // Crear gráfico para 2025
      createChart('details_2025', '2025', data['2025']);
      
      // Crear gráfico para 2021
      createChart('details_2021', '2021', data['2021']);

      createChart('details_2017', '2017', data['2017']);
    })
    .catch(error => {
      console.error('Error en el fetch:', error);
      const errorMsg = "No se pudieron cargar los datos del gráfico. Revisa la consola para más detalles.";
      document.getElementById("details_2025").innerHTML = errorMsg;
      document.getElementById("details_2021").innerHTML = errorMsg;
      document.getElementById("details_2017").innerHTML = errorMsg;
    });
};

// Añadir el event listener para ejecutar el código cuando la página cargue
window.addEventListener("load", () => {
  console.log('La página ha cargado. Inicializando gráficos...');
  initializeCharts();
});
