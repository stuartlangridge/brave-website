'use strict';

const Hapi = require('hapi')
var assets = require('./assets.js')
var mailchimp = require('./mailchimp.js')

const server = new Hapi.Server()
server.connection({ port: process.env.PORT || 3000 })

server.register({ register: require('crumb'), options: { cookieOptions: { isSecure: false } } }, (err) => {
  if (err) {
    console.log('Failed to load crumb.')
  }
  
  // API endpoint
  server.route({
      method: 'POST',
      path: '/api/mailchimp',
      config: {
        state: {
          parse: false, // parse and store in request.state
          failAction: 'ignore' // may also be 'ignore' or 'log'
        }
      },
      handler: function (request, reply) {
        mailchimp.api(request, reply)
      }
  })

})

server.register(require('inert'), (err) => {
  if (err) {
    console.log('Failed to load inert.')
  }
  
  // Serves static files out of public/
  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: './public'
      }
    }
  })

})

server.start(() => {
    console.log('Brave server running at:', server.info.uri);
});