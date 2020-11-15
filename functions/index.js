const functions = require('firebase-functions');
const admin = require('firebase-admin')

const { configureApplication } = require('./lib/app')
const { createAppLogger } = require('../lib/log-utils')
const {
  createRouteLogger,
  createErrorLogger,
} = require('../lib/middlewares')

admin.initializeApp()

const isDevelopment = process.env.NODE_ENV === 'development'

const appLogger = createAppLogger({ dev: isDevelopment })
const errorLogger = createErrorLogger({ dev: isDevelopment })
const routeLogger = isDevelopment ? createRouteLogger({ dev: isDevelopment }) : null
const corsOptions = isDevelopment ? {
  origin: 'http://localhost:5000',
} : null

const app = configureApplication({
  rateLimitEnabled: false,
  corsOptions,
})

exports.app = functions.https.onRequest(app)


