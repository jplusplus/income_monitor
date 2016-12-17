var pug = require('pug')
var async = require('async')
var restify = require('restify')

var makeChartData = function (data){
  var chartData = []
  data.forEach(function(point){
    chartData.push([
      Date.parse(point.label),
      point.value
    ])
  })
  return chartData
}
var callEndpoint = function(client, endpoint, callback){
  var cb = callback
  client.get(
    '/'+endpoint+'?jpp='+process.env.JPP_CODE,
    function(err, req, res, obj) {
      cb(err, obj)
    }
  )
}

module.exports = function(req, res, next){
  var res_ = res
  // get data
  var client = restify.createJsonClient({
    url: 'http://localhost:'+ (process.env.PORT || 8080),
    version: '*'
  })
  async.parallel(
    {
      incomes: function(callback) {
        callEndpoint(client, "incomes", callback)
      },
      people: function(callback) {
        callEndpoint(client, "people", callback)
      }
    },
    function(err, results) {
      res_.end(pug.renderFile('views/chart.jade', {
        income_series: makeChartData(results.incomes),
        people_series: makeChartData(results.people)
      }))
    }
  ) // async
}
