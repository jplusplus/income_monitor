$(function () {
  var container = $('#container')
  var income_series = container.data("income_series")
  var people_series = container.data("people_series")

  Highcharts.chart('container', {
    title: {
      text: 'Intäkter och anställda'
    },
    subtitle: {
      text: 'Fakturerat i snitt per månad (rullande kvartal)'
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Månad'
      },
      min: income_series[income_series.length - 1][0]-1e9,
      max: income_series[0][0]+1e9,
//      startOnTick: true
    },
    yAxis: [
      {
        title: {
          text: 'SEK'
        },
        min: 0
      }, {
        title: {
          text: 'tjänster'
        },
        min: 0,
        opposite: true
      }
    ],
    tooltip: {
        shared: true,
    },

    plotOptions: {
        spline: {
            marker: {
                enabled: true
            }
        }
    },

    series: [{
          name: 'Tjänster',
          type: 'column',
          yAxis: 1,
          data: people_series
        }, {
          name: 'Fakturerat',
          type: 'spline',
          data: income_series
        }]
  });
});