'use strict'
var restify = require('restify')
var pug = require('pug')
var async = require('async')
var Logger = require('bunyan')

// Routes
var incomes = require(__dirname + '/routes/v1/incomes.js')
var people = require(__dirname + '/routes/v1/people.js')
var index = function(req, res, next){
  res.end(pug.renderFile('views/index.jade',
                         {version: process.env.DEFAULT_API_VERSION})
  )
}
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
var chart = function(req, res, next){
  var res_ = res
  // get data
  var client = restify.createJsonClient({
    url: 'http://jpp-inkomstkollen.herokuapp.com',
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

// Logger
// http://stackoverflow.com/questions/20626470/is-there-a-way-to-log-every-request-in-the-console-with-restify
var log = new Logger.createLogger({
  name: 'inkomstkollen',
  serializers: {
      req: Logger.stdSerializers.req
  }
})

// Setup server
var server = restify.createServer({
  log: log
})

server.use(restify.queryParser())

server.use(function(req, res, next){
  res.charSet('utf-8')
  return next()
})

server.pre(function (req, res, next) {
  // Enable request logging:
  req.log.info({ req: req }, 'REQUEST')
  return next()
})

// GET
server.get('/', index)
server.get(/\/public\/?.*/, restify.serveStatic({
  directory: __dirname
}))
server.use(function(req, res, next){
  if (decodeURIComponent(req.query.jpp) !== process.env.JPP_CODE){res.end(null)}
  return next()
})
server.get('/incomes', incomes)
server.get('/people', people)
server.get('/chart', chart)

// Start server
server.listen(process.env.PORT || 8080, function() {
  console.log('%s listening at %s', server.name, server.url)
})
