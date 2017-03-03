var $ = require('cheerio')
var request = require('request')
var inc = 0;
var mastercoords = []




function scrape() {
	while (inc < 30) {
		var container = []
		var url = 'http://www.realcommercial.com.au/for-sale/in-melbourne/list-' + inc + '?nearbySuburb=false&autoSuggest=true'
		request.get(url, function(req, res, body) {
			container.push($('script', body))
			container.forEach(function(x) {
				var keys = Object.keys(x)
				var ele = x[12].children[0].data.split(x[12].children[0].data.indexOf('['), x[12].children[0].data.length - 1)
				var data = ele[ele.length - 1].split(',')

				var coords = []
				data.forEach(function(y) {
					if (coords.length == 2) {
						mastercoords.push(coords)
						coords = []
					}
					var item = y.split(":")
					if (item[0] == "latitude" || item[0] == "longitude") {

						coords.push(item[1])
					}

				})
				console.log(mastercoords)
			})
		})

		inc++
		scrape()
	}
}


scrape()
