var $ = require('cheerio')
var request = require('request')
var fs = require('fs')
var mastercoords = []



module.exports = function scrape(inc, callback) {
	var counter = 0
	var container = []
	var url = 'http://www.realcommercial.com.au/for-sale/in-melbourne/list-' + inc
	request.get(url, function(req, res, body) {


		container.push($('script', body))
		container.forEach(function(x) {
			if (inc > 4 && typeof callback == 'function') {
				return callback(mastercoords)
			}
			var keys = Object.keys(x)
			var ele = x[12].children[0].data.split(x[12].children[0].data.indexOf('['), x[12].children[0].data.length - 1)
			var data = ele[ele.length - 1].split(',')

			var coords = []

			data.forEach(function(y) {
				counter++
				if (counter === data.length && typeof callback == "function") {
					callback(null, mastercoords)
				}
				if (coords.length == 2) {
					mastercoords.push(coords)
					coords = []
				} else {
					var item = y.split(":")
					if (item[0] == "latitude" || item[0] == "longitude") {
						coords.push(item[1])
					}
				}
			})
		})
	})
}
