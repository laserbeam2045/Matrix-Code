import { LF, regExpCRLF, regExpCR } from '../store/char-code-types'

export default {
  methods: {
    // LF(\n)以外の改行コードをLFに変換するメソッド
    convertToLF (text) {
      return text.replace(regExpCRLF, LF)
                 .replace(regExpCR,   LF)
    },
    // XSSのリスクがある記号をエスケープするメソッド
    escape (text) {
      return text.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#x27;')
    },
    // エスケープした文字列をデコードするメソッド
    unescape (text) {
      return text.replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .replace(/&quot;/g, '"')
                 .replace(/&#x27;/g, "'")
    },
  },
}