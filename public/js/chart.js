$(function () {
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
            }
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

        series: series
    });
});