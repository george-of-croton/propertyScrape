const crypto = require('crypto')
const fs = require('fs')
const request = require('request')



const apikey = '<apikey>'


//Returns formatted UTC date stamp
function formatDate() {
	var date = new Date(Date.now())
	var month = date.getMonth() + 1
	var day = date.getUTCDate().toString()
	var hours = date.getUTCHours()
	var minutes = date.getUTCMinutes().toString()

	function pad(date) {
		return (date < 10) ? "0" + date : date
	}
	// round minutes to previous multiple of 5
	var Oldminutes = parseInt(minutes)
	minutes = 5 * Math.round(Oldminutes / 5)
	if (Oldminutes < minutes) {
		minutes = minutes - 5
	}
	//return formatted date
	return date.getFullYear().toString() + pad(month) + pad(day) + pad(hours) + pad(minutes)
}
//join username and date
function joinNameAndDate(username, dateFunction) {
	return Buffer.from(username + dateFunction(), 'ascii')
}
//create hash from joined username and date with secretKey
function hashstring(something, secretKey) {
	return crypto.createHmac('md5', (Buffer.from(secretKey, 'ascii')))
		.update(something)
		.digest('base64')
		.replace('/', ',')
		.replace('+', '-')
}

//wrapper function to call other functions
function getSignature(username, secretKey) {
	return hashstring(joinNameAndDate(username, formatDate), secretKey)
}


module.exports = function scrape(postcode, cb) {
	const baseurl = 'https://members.propertydata.com.au/API/propertydataapi.svc/GetPropertyRecords?apikey='
	const endurl = '&numberOfRecords=100&postcode='+ postcode +'&state=VIC&searchSurroundingArea=true&surroundingAreaRadius=10000&saleType=1,3,4,15,16,17,18'
	request.get(baseurl + apikey + '&sig=' + getSignature('101601', 'a40252b6bc8a40feccb612cb9eff9ef9') + endurl, function(err, response, body) {
	if (err) {
		console.log(err)

	}
	console.log(body)
	var parsedBody = JSON.parse(body).SalesRecords
	var groupofCoords = [];
	var inc = 0;
	parsedBody.forEach(function(x) {
		inc++
		groupofCoords.push({latitude: x.Latitude, longitude: x.Longitude})
		if(inc === parsedBody.length) {
			console.log(
				'returning coords'
			)
			cb(groupofCoords)
		}
	})
})
}
