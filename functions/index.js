const functions = require('firebase-functions');
const admin = require('firebase-admin')

const { configureApplication } = require('./lib/app')
const {
  createRouteLogger,
  createErrorLogger,
  createAppLogger,
} = require('./logger')

admin.initializeApp()

const isDevelopment = process.env.NODE_ENV === 'development'

const db = admin.database()

const appLogger = createAppLogger({ db })
const errorLogger = createErrorLogger({ db })
const routeLogger = createRouteLogger({ db })
const corsOptions = isDevelopment ? {
  origin: 'http://localhost:5000',
} : null

const app = configureApplication({
  rateLimitEnabled: false,
  corsOptions,
  appLogger,
  errorLogger,
  routeLogger,
})

exports.app = functions.https.onRequest(app)


