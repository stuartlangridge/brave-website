/* jshint asi: true */
/* jshint esversion: 6 */

'use strict'

const Hapi = require('hapi')
const fs = require('fs')
const mailchimp = require('./mailchimp.js')
var assets = require('./assets.js')

const server = new Hapi.Server()

// temporary workaround to allow localhost with HSTS
var connections = [
      // non-local host
      {
          port: process.env.PORT || 3000,
      },
      // localhost
      {
          host: 'localhost',
          port: 3000,
          tls: {
            key: fs.readFileSync('./localhostserver.key'),     // Path to key
            cert: fs.readFileSync('./localhostserver.crt'),      // Path to self-signed Certificate

            // This is necessary only if using the client certificate authentication.
            requestCert: true,

            // This is necessary only if the client uses the self-signed certificate.
            ca: []
        }
      }
  ]

// IMPORTANT : If you toggle Connections, toggle back to [0] if not localhost
server.connection(connections[1])

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
  var map = [
      { path: '/privacy_android', file: './public/android_privacy.html' },
      { path: '/privacy_ios', file: './public/ios_privacy.html' },
      { path: '/terms_of_use', file: './public/termsofuse.html' }
  ]

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

  map.forEach((entry) => {
    server.route({
      method: 'GET',
      path: entry.path,
      handler: function (request, reply) {
        reply.file(entry.file)
      }
    })
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
  let isLocalhost = ((request.headers.host.substring(0,request.headers.host.indexOf(':'))) == 'localhost')
    if (request.headers['x-forwarded-proto'] !== 'https' && !isLocalhost) {
      return reply()
        .redirect('https://' + request.headers.host + request.url.path)
        .code(301);
    }
    reply.continue()      
})

server.start(() => {
    console.log('Brave server running at:', server.info.uri);
})

