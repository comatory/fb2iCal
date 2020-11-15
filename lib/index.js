const { configureApplication } = require('./app')
const { createAppLogger } = require('./log-utils')
const {
  createRouteLogger,
  createErrorLogger,
} = require('./middlewares')

const isDevelopment = process.env.NODE_ENV === 'development'
const port = process.env.PORT

const appLogger = createAppLogger({ dev: isDevelopment })
const errorLogger = createErrorLogger({ dev: isDevelopment })
const routeLogger = isDevelopment ? createRouteLogger({ dev: isDevelopment }) : null

const app = configureApplication({
  appLogger,
  errorLogger,
  routeLogger,
  rateLimitEnabled: true
})

app.listen(port)
