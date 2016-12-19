var Trello = require("trello");
var fetch = require('node-fetch')

var totalPattern = /\*\*\s?Summa:\s?\*\*(.*)/

module.exports = function(req, res, next){
  var uri = 'https://api.trello.com/1/boards/'+process.env.BOARD_ID+'/cards'
  var lastDate = null
  //FIXME paginate!

  var options = {
    limit: 1000,
    fields: "desc,dateLastActivity",
    before: lastDate,
    actions: "updateCard", // will get cards moves
    key: process.env.TRELLO_KEY,
    token: process.env.TRELLO_TOKEN
  }

  var tail = []
  Object.keys(options).forEach(function(key){
    tail.push(key + "=" + encodeURIComponent(options[key]))
  })
  fetch(uri + "?" + tail.join("&"), {method: 'GET'})
    .then((result, fail) => {
      if (result.status !== 200){
        res.end(result.statusText)
        return null
      } else {
        return result.json()
      }
    })
    .then((cards) => {
      if (!cards) return

      var months = {}

      cards.forEach(function(card){
        console.log(card)
        /* Loop through a batch of cards */
  
        // Get date the card was moved to the invoice list
        var date = null
        card.actions.forEach(function(action){
          if ("listAfter" in action.data
              && (action.data.listAfter.name === process.env.LIST_NAME)){
            lastDate = action.date
            date = lastDate.substring(0,7) // 2016-10
          }
        })
        if (date === null){
          lastDate = card.dateLastActivity
          date = lastDate.substring(0,7) // 2016-10
        }

        // Get sum of money, before VAT
        var totalRow = totalPattern.exec(card.desc) // **Summa:** 25 000 kr
        if (totalRow && totalRow.length > 1){
          var total = totalRow[1]
          var currency = "SEK"
          var currencies = {
            "$": "USD",
            "usd": "USD",
            "dollar": "USD",
            "eur": "EUR",
            "€": "EUR",
          }
          var xrates = {
            SEK: 1,
            USD: 9,
            EUR: 1,
          }
          Object.keys(currencies).forEach(function(key){
            var total_low = total.toLowerCase()
            if (total_low.indexOf(key) > -1) {
              currency = currencies[key]
            }
          })
          // Get only number and decimal point
          total = total.replace(/\s*/g, "")
                       .replace(",", ".")
                       .match(/[\d\.]+/)
          if (total !== null && total.length) {
            total = parseFloat(total[0]) * xrates[currency]
          } else {
            console.log("Hittade inget värde i ", card.desc)
            total = 0
          }
        } else {
          console.log("Hittade inget värde i ", card.desc)
          var total = 0
        }

        if (date in months){
          months[date].push("" + total)
        } else {
          months[date] = Array("" + total)
        }
      })
      var rollingQuarters = []
      var monthKeys = Object.keys(months).sort().reverse()
      var monthSums = {}
      monthKeys.forEach(function(key){
        monthSums[key] = parseFloat(months[key].reduce(function(a, b){return parseFloat(a) + parseFloat(b)}))
      })
      var numMonths = monthKeys.length
      for (var i = 0; i < numMonths-2; i++) {
        key1 = monthKeys[i]
        key2 = monthKeys[i+1]
        key3 = monthKeys[i+2]
        rollingQuarters.push({
          label: key1,
          value: parseInt((monthSums[key1] + monthSums[key2] + monthSums[key3]) / 3)
        })
      }
      res.end(JSON.stringify(rollingQuarters))
  })
}

