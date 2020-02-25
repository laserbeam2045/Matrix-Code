// アプリケーションモード
export const PREDICTION = 0
export const COMPARISON = 1

// アプリケーションの状態
export const NORMAL = 0
export const WAITING = 1
export const WARNING = 2
export const ALERT = 3
export const ERROR = 4

// APIサーバーの状態
export const DOWN = 0     // 停止中
export const STARTING = 1 // 起動中
export const RUNNING = 2  // 稼働中