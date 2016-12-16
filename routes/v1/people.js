module.exports = function(req, res, next){
  months = {
//    "2016-03": 2.2,
    "2016-04": 2.2,
    "2016-05": 2.2,
    "2016-06": 2.2,
    "2016-07": 0,
    "2016-08": 2,
    "2016-09": 2.1,
    "2016-10": 2.2,
    "2016-11": 2.2,
    "2016-12": 2,
/*    "2017-01": 2.2,
    "2017-02": 3,
    "2017-03": 3,
    "2017-04": 3,
    "2017-05": 3,
    "2017-06": 3,*/
  }
  output = []
  Object.keys(months).forEach(function(key){
    output.push({
      label: key,
      value: months[key]
    })
  })
  res.end(JSON.stringify(output.reverse()))
}

