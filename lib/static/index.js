import { uuidv4, parseStartTimeFromiCalString } from './app/utils'
import {
  getConfigStorage,
  getStorageContents,
  saveRecord,
} from './app/storage'
import logger from './app/logger'
import { extractEventDataFromHTML } from '../../lib/services/ics-retriever'
import generateICS from '../../lib/services/ics-generator'

import boot from '../frontend'
import { requestStore } from '../frontend/stores'
import { Request } from '../frontend/records'

(() => {
  document.addEventListener('DOMContentLoaded', boot)
})()
