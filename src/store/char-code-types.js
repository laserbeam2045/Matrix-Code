
// 改行コード（\記号を使えない処理系のために使用）
export const CR = String.fromCharCode(13)        // 古いMac OSでの改行コード
export const LF = String.fromCharCode(10)        // Unix系OS, Mac OSでの改行コード（全てこれに統一する）
export const CRLF = String.fromCharCode(13, 10)  // Windows系OSでの改行コード

// 置換用の正規表現オブジェクト
export const regExpCR = new RegExp(String.fromCharCode(13), 'g')
export const regExpLF = new RegExp(String.fromCharCode(10), 'g')
export const regExpCRLF = new RegExp(String.fromCharCode(13, 10), 'g')