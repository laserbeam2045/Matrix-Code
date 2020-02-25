import { PREDICTION, COMPARISON, NORMAL, DOWN } from './app-flag-types'

export default {
  debugMode: false,     // デバッグモードかどうか
  authenticated: false, // ユーザーが認証済みかどうか
  sound: true,          // 効果音のON・OFF状態

  appMode: PREDICTION,  // 選択中のアプリケーションモード
  appInfo: '',          // インフォメーションテキスト
  appInfoType: NORMAL,  // アプリケーションの状態

  [PREDICTION]: {
    serverStatus: DOWN, // APIサーバーの状態
    serverAddress: 'https://gpt2predictionapi.ml',
    //serverAddress: 'http://127.0.0.1:5000/',
  },

  [COMPARISON]: {
  },
}