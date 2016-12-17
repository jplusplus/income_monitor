$(function () {
  var container = $('#container')
  var income_series = container.data("income_series")
  var people_series = container.data("people_series")

  Highcharts.setOptions({
    lang: {
      contextButtonTitle: "meny",
      exportButtonTitle: "ladda ner",
      decimalPoint: ",",
      downloadJPEG: "ladda ner som JPEG-bild",
      downloadPDF: "ladda ner som PDF",
      downloadPNG: "ladda ner som PNG-bild",
      downloadSVG: "ladda ner som SVG-bild",
      drillUpText: "tillbaka till {series.name}",
      loading: "laddar…",
      months: [ "januari" , "februari" , "mars" , "april" , "maj" , "juni" , "juli" , "augusti" , "september" , "oktober" , "november" , "december"],
      numericSymbols: [ " t." , " milj." , " mdr." , " bilj." , " biljarder" , " triljoner"],
      printChart: "skriv ut",
      resetZoom: "återställ",
      resetZoomTitle: "återställ zoomnivån",
      shortMonths: [ "jan" , "feb" , "mar" , "apr" , "maj" , "jun" , "jul" , "aug" , "sep" , "okt" , "nov" , "dec"],
      thousandsSep: " ",
      weekdays: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"]
    }
  });
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
      dateTimeLabelFormats:{
        month:"%b %Y",
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
        dateTimeLabelFormats:{
          day:"%B %Y", // only show month
        }
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
          data: income_series,
          tooltip: {
            valueSuffix: " kronor"
          }
        }]
  });
});