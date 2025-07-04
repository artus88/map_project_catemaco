const getOptionChart1=()=> {

     fetch(`/statistic/${mun_id}`)
  .then(res => res.json())
  .then(data1 => {
    if (data1.error) {
      document.getElementById("details_2025").innerHTML = data1.error;
      document.getElementById("details_2021").innerHTML = data1.error;
   
    }
    console.log(Object.keys(data1[2025]))
}

);

    return  {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [
        120,
        {
          value: 200,
          itemStyle: {
            color: '#a90000'
          }
        },
        150,
        80,
        70,
        110,
        130
      ],
      type: 'bar'
    }
  ]
}

};
const initCharts = () => {
    var chart1 = echarts.init(document.getElementById("details_2025"));
    const OptionChart1 =  getOptionChart1();
    chart1.setOption( OptionChart1);
};

const pathParts = window.location.pathname.split('/');
const mun_id = pathParts[pathParts.length - 1];
console.log("mun_id extraído:", mun_id);



window.addEventListener("load", ()=> {
    console.log('OK')
    initCharts();
});