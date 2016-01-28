'use strict'

const Hapi = require('hapi')
var assets = require('./assets.js')
var mailchimp = require('./mailchimp.js')

const server = new Hapi.Server()
server.connection({ port: process.env.PORT || 3000 })

server.register({ register: require('crumb'), options: 
  { 
    cookieOptions: { 
      clearInvalid: true,
      isSecure: true
   } 
  }
 }, (err) => {
  if (err) {
    console.log('Failed to load crumb.')
  }
  
  /* API endpoints */

  // mailchimp methods
  server.route({
      method: 'POST',
      path: '/api/mailchimp',
      config: {
        state: {
          parse: true,
          failAction: 'log' 
        },
        security: {
          hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
          }
          , xframe: true
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
  
  // A server redirect to our favorite band, Brave Combo.
  server.route({
    method: 'GET',
    path: '/bo/{path*}',
    handler: function (request, reply) {
      reply.redirect('http://bravecombo.com/' + (request.params.path ? request.params.path : ''))
    }
  })

  // Serves static files out of public/
  server.route({
    method: 'GET',
    path: '/{path*}',
    config: {
      state: {
        parse: true, 
        failAction: 'log' 
      }, 
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true
        }, 
        xframe: true
      }
    },
    handler: {
      directory: {
        path: './public'
      }
    }
  })

})

server.ext('onRequest', function (request, reply) {
    if (request.headers['x-forwarded-proto'] != 'https') {
      return reply()
        .redirect('https://' + request.headers.host + request.url.path)
        .code(301);
    }
    reply.continue()      
})

server.start(() => {
    console.log('Brave server running at:', server.info.uri);
});