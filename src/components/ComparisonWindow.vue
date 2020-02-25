<template>
  <div class="contents">
    <EditableWindow
      :value="postProcessedText1"
      :scrollTop.sync="scrollTop"
      @input="onInput1"
    />
    <EditableWindow
      :value="postProcessedText2"
      :scrollTop.sync="scrollTop"
      @input="onInput2"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { SET_APP_INFO } from '../store/mutation-types'
import { COMPARISON, NORMAL } from '../store/app-flag-types'
import { LF, regExpLF } from '../store/char-code-types'
import EditableWindow from './EditableWindow'
import converter from '../mixins/converter'

export default {
  name: 'ComparisonWindow',
  mixins: [
    converter,
  ],
  components: {
    EditableWindow,
  },
  
  data () {
    return {
      findFlag: false,  // trueなら一致部分を、falseなら不一致部分を強調する
      text1: '',
      text2: '',
      scrollTop: 0,
    }
  },

  computed: {
    preProcessedText1 () {
      return this.convertToLF(this.text1)
    },
    preProcessedText2 () {
      return this.convertToLF(this.text2)
    },
    // 前提：textArray1、textArray2、matched、checked配列の各要素は対応関係にあり、要素数は常に等しい
    // 1: checked配列からfalseの要素を探し、対応するインデックスである、textArray1の要素と
    //    textArray2の要素同士を比較し、一致する部分文字列のうち、最も長いものを抽出する
    // 2: 一致した部分文字列の前後で、比較した文字列のそれぞれを3分割する
    // 3: 対応するmatched配列、及びchecked配列の要素をtrueとし、前後にfalseを追加する
    // 4: 一致する部分文字列が見つからなくなるまで、1から3を繰り返す
    matchTexts () {
			const textArray1 = [this.preProcessedText1]
			const textArray2 = [this.preProcessedText2]
      const matched	= [false]
      const checked = [false]
      let changeFlag = true

			while (changeFlag) {
				changeFlag = false
				for (let i = 0; i < matched.length; i++) {
          if (checked[i]) continue
          // 最長の一致する部分文字列
          const part = this.getCommonStr(textArray1[i], textArray2[i])
          checked[i] = true
          // 一致しなければcontinue
          if (part === void 0) continue
          // 一致の前後で文字列を３分割する
          this.divideArrays(textArray1, textArray2, matched, checked, i, part)
          changeFlag = true
				}
      }
      // 対象となる要素を、class属性を持つspanタグで囲む
      return this.surroundBySpan(textArray1, textArray2, matched)
    },
    postProcessedText1 () {
      return this.matchTexts[0]
    },
    postProcessedText2 () {
      return this.matchTexts[1]
    },
    isPerfectMatch () {
      return this.text1 !== '' && this.text1 === this.text2
    },
    appInfo () {
      return this.isPerfectMatch ? 'perfect match' : ''
    },
  },

  created () {
    this.text1 = localStorage['comparisonText1'] || ''
    this.text2 = localStorage['comparisonText2'] || ''
  },

  watch: {
    text1 (value) {
      localStorage['comparisonText1'] = value
    },
    text2 (value) {
      localStorage['comparisonText2'] = value
    },
    appInfo (value) {
      this.$store.commit({
        type: SET_APP_INFO,
        info: value,
        infoType: NORMAL,
      })
    },
  },

  methods: {
    onInput1 (value) {
      this.text1 = value
    },
    onInput2 (value) {
      this.text2 = value
    },
    // 引数の文字列が改行コードを含むかどうかを返すメソッド（真なら含む）
    isIncludeLF (text) {
      return !!text.match(regExpLF)
    },
    // 2つの文字列から、共通する部分文字列を探し、最長の文字列を返すメソッド
		getCommonStr (text1, text2) {
      const commonStrings = []

      for(let i = 0; i < text1.length; i++) {
        // text1に含まれる一文字が、text2に含まれているなら、候補として配列に追加する
        if (text2.includes(text1[i])) {
          commonStrings.push(text1[i])
        } else {
          continue
        }
        // 抽出する文字列を少しずつ長くして確認する
        for (let j = 2; (i + j) <= text1.length; j++) {
          const str = text1.slice(i, i + j)
          // 部分文字列が改行コードを含むか、または、text2に含まれなければ終了
          if (this.isIncludeLF(str) || !text2.includes(str)) {
            i += (j - 1)  // 計算の無駄を減らすためのショートカット(-1はインクリメントを考慮した調整)
            break
          } else {
            // 末尾の要素を、最新の文字列で更新する
            commonStrings.splice(-1, 1, str)
          }
        }
			}
			// 文字列の長さについて降順に並べ替え、先頭(＝最長)の要素を返す
			return commonStrings.sort((a, b) => (a.length > b.length) ? -1 : 1)[0]
    },
    // 文字列textを、partの前後で3分割して返すメソッド
		divideText (text, part) {
			const idx	= text.indexOf(part)
			return [text.substring(0, idx), part, text.substring(idx + part.length)]
    },
    // 配列の指定された要素について、3分割して再構成するメソッド
    divideArrays (text1, text2, matched, checked, idx, part) {
      text1.splice(idx, 1, ...this.divideText(text1[idx], part))
      text2.splice(idx, 1, ...this.divideText(text2[idx], part))
      matched.splice(idx, 1, false, true, false)
      checked.splice(idx, 1, false, true, false)
    },
    // 強調表示の対象となる文字列を、class属性を持つSPANタグで囲むメソッド
    surroundBySpan (textArray1, textArray2, matched) {
      const arr1 = [], arr2 = []
			for (let i = 0; i < matched.length; i++) {
        // XSS対策として文字列をエスケープする(重要)
        let text1 = this.escape(textArray1[i])
        let text2 = this.escape(textArray2[i])
        if (matched[i] === this.findFlag) {
          if (text1 !== '') text1 = this.surroundBySpan_(text1)
          if (text2 !== '') text2 = this.surroundBySpan_(text2)
        }
        arr1.push(text1)
        arr2.push(text2)
      }
      return [arr1.join(''), arr2.join('')]
    },
    surroundBySpan_ (text) {
      const classNames = (text[0] === LF) ? 'emp, lf' : 'emp'
      return `<span class="${classNames}">${text}</span>`
    }
  },
}
</script>

<style lang="scss">
.contents {
  position: relative;
  width: 100%;
  height: 100%;
  word-break: break-all;

  span.lf::before {
    content: "↵";
    color: white;
    background: rgba(0, 255, 150, 0.5);
  }
  span.emp {
    color: white;
    background: rgba(0, 255, 150, 0.5);
  }
}
</style>