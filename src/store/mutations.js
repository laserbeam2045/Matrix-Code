/* eslint-disable */
import {
  SET_AUTHENTICATED,
  SET_APP_MODE,
  SET_APP_INFO,
  SET_SOUND,
  SET_SERVER_STATUS,
} from './mutation-types'
import { PREDICTION } from './app-flag-types'


export default {
  [SET_AUTHENTICATED] (state, payload) {
    state.authenticated = payload
  },
  
  [SET_APP_MODE] (state, payload) {
    state.appMode = payload
  },
  
  [SET_APP_INFO] (state, payload) {
    state.appInfo = payload.info
    state.appInfoType = payload.infoType
  },
  
  [SET_SOUND] (state, payload) {
    state.sound = payload
  },

  [SET_SERVER_STATUS] (state, payload) {
    state[PREDICTION]['serverStatus'] = payload.serverStatus
  },
}