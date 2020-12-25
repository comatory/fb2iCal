import logger from './services/logger'
import { configStore } from './stores'

export default () => {
  const enableTracking = configStore.track

  logger.setRemoteLogging(enableTracking)
}
