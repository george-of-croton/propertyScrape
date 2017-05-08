'use strict';

const Hapi = require('hapi');
const scrape = require('./index.js')
const promise = require('promise')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
	host: 'localhost',
	port: 8000
});

// Add the route
server.register(require('inert'), (err) => {

	if (err) {
		throw err;
	}

	server.route({
		method: 'GET',
		path: '/hello',
		handler: function(request, reply) {
			reply.file('./home.html');
		}
	});

	server.route({
		method: 'GET',
		path: '/{file*}',
		handler: {
			directory: {
				path: './',
				listing: true
			}
		}
	});
});

server.route({
	method: 'GET',
	path: '/scrape',
	handler: function(request, reply) {
		var postcode = request.query.postcode
		scrape(postcode, function(data) {
			console.log(data)
			reply(JSON.stringify({
				"data": data
			}))
		})
	}
})

// Start the server
server.start((err) => {
	if (err) {
		throw err;
	}
	console.log('Server running at:', server.info.uri);
});
