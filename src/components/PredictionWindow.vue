<template>
  <EditableWindow
    ref="EditableWindow"
    :value="text3"
    :scrollTop.sync="scrollTop"
    @keydown.tab.exact.prevent="onKeyTab"
    @keydown.enter.exact="onKeyEnter"
    @input-e="onInputE"
    @input="onInput"
  ></EditableWindow>
</template>

<script>
/* eslint-disable */
import _ from "lodash"
import { PREDICTION, NORMAL, WAITING, WARNING, DOWN, STARTING, RUNNING } from '../store/app-flag-types'
import { SET_APP_INFO, SET_SERVER_STATUS } from '../store/mutation-types'
import EditableWindow from './EditableWindow'
import converter from '../mixins/converter'
import { mapState, mapMutations } from 'vuex'
import { CR, LF, CRLF, regExpCR, regExpCRLF } from '../store/char-code-types'

export default {
  name: 'TextWindow',
  mixins: [
    converter,
  ],
  components: {
    EditableWindow,
  },

  data () {
    return {
      text: '',             // 入力された文字列
      predictedWords: [],   // 予測した単語と確率を含む3次元配列
      tabFlag: false,       // 最後に入力したキーがTabキーかどうか
      requestNumber: 0,     // レスポンスを管理するための値
      delayOfRequest: 0,    // リクエストまでの待機時間
      command: {
        startServer: 'start server',
      },
      joinCharList1: [',', '.', '\'', '"', ')', ']', '}', '!', '?'],
      scrollTop: 0,
    }
  },

  computed: {
    ...mapState({
      serverStatus : state => state[PREDICTION].serverStatus,
      serverAddress: state => state[PREDICTION].serverAddress,
    }),
    span () {
      if (this.predictedText) {
        const predictedText = this.escape(this.predictedText)
        return `<span class="private">${predictedText}</span>`
      } else {
        return ''
      }
    },
    text2 () {
      let text = this.text
      if (text.slice(-1) === '\n' && this.span !== '') {
        return this.escape(text.slice(0, -1))
      } else {
        return this.escape(this.text)
      }
    },
    text3 () {
      return this.text2 + this.span
    },
    // 文章を空白文字により分割した配列
    textsArray () {
      return this.text.split(/\s/).filter(piece => piece)
    },
    // 全ての空白文字を半角スペースに変換した文章
    preProcessedText () {
      return this.textsArray.join(' ')
    },
    // 文章の末尾の単語
    lastWord () {
      return this.textsArray.slice(-1)[0] || ''
    },
    // 文章の末尾の文字
    lastCharactor () {
      return this.text.slice(-1)
    },
    // 文章が未入力かどうか
    isTextEmpty () {
      return this.text === ''
    },
    // 文章が空白文字のみであるかどうか
    isTextOnlyBlank () {
      const exp = this.text.match(/\s+/)
      return !!(exp && exp[0].length === this.text.length)
    },
    // 文章の末尾の文字が、空白文字かどうか
    isLastCharactorBlank () {
      return !!this.lastCharactor.match(/\s/)
    },
    // 予測された次の単語
    nextWord () {
      if (this.predictedWords.length) {
        return this.predictedWords[0][0][1]
      } else {
        return ''
      }
    },
    // 予測された次の単語が、入力途中という前提で予測されたかどうか
    includeFlag () {
      if (this.predictedWords.length)
        return this.predictedWords[0][0][2]
      else
        return false
    },
    // 次の単語の前にスペースが必要かどうか
    nextWordNeedsBlank () {
      if (
        this.includeFlag ||
        this.isNextWordPartialMatch ||
        this.isLastCharactorBlank ||
        this.nextWord[0] !== ' '
        //this.joinCharList1.some(c => c === this.nextWord[0]) ||
        //this.joinCharList2.some(c => c === this.lastCharactor)
      ) {
        return false
      } else {
        return true
      }
    },
    // 結合用に前処理を施した次の単語
    preProcessedNextWord () {
      let nextWord = this.nextWord.trim()
      if (this.isNextWordPartialMatch || this.isNextWordPerfectMatch) {
        nextWord = nextWord.slice(this.lastWord.length)
      }
      if (this.nextWordNeedsBlank)
        return ' ' + nextWord
      else
        return nextWord
    },
    afterText () {
      if (!this.nextWord) return ''
      const after = this.predictedWords[0].slice(1)
      if (after.length)
        return after.reduce((acc, cur) => acc + cur[1], '')
      else
        return ''
    },
    // 予測された単語から成る句
    predictedText () {
      if (!this.nextWord) return ''
      return this.preProcessedNextWord + this.afterText
    },
    // 予測された次の単語が、末尾の文字列と完全一致するかどうか
    isNextWordPerfectMatch () {
      return this.nextWord && this.lastWord === this.nextWord.trim()
    },
    // 予測された次の単語が、末尾の文字列と前方一致するかどうか
    isNextWordPartialMatch () {
      const nextWord = this.nextWord.trim()
      return (
        this.lastWord.length &&
        this.lastWord.length < nextWord.length &&
        this.lastWord === nextWord.slice(0, this.lastWord.length)
      )
    },
    // APIにリクエストを送信してはいけないかどうか
    notAllowRequest () {
      return (
        this.isTextEmpty ||
        this.isTextOnlyBlank ||
        this.nextWord && !this.tabFlag ||
        this.appInfoType !== NORMAL
      )
    },
    // APIに渡すデータとオプション
    apiOptions () {
      return {
        method: 'POST',
        body: JSON.stringify({
          "text": this.preProcessedText,
          "lastWord": this.lastWord,
          "blankFlag": this.isLastCharactorBlank,
          "tabFlag": this.tabFlag,
          "requestNumber": this.requestNumber,
        }),
      }
    },
    appInfo () {
      switch (this.serverStatus) {
        case DOWN     : return 'OFF LINE'
        case STARTING : return 'STARTING SERVER'
        case RUNNING  : return 'ON LINE'
      }
    },
    appInfoType () {
      switch (this.serverStatus) {
        case DOWN     : return WARNING
        case STARTING : return WAITING
        case RUNNING  : return NORMAL
      }
    },
  },

  watch: {
    appInfo () {
      this.setAppInfo({
        info: this.appInfo,
        infoType: this.appInfoType,
      })
    },
  },

  created () {
    this.setAppInfo({
      info: this.appInfo,
      infoType: this.appInfoType,
    })

    this.debouncedGetNextWords = _.debounce(this.getNextWords, this.delayOfRequest)
  },

  methods: {
    ...mapMutations({
      setAppInfo: SET_APP_INFO,
      setServerStatus: SET_SERVER_STATUS,
    }),
    // 多次元配列をディープコピーするメソッド
    copyArray (arr) {
      return JSON.parse(JSON.stringify(arr))
    },
    // 予測単語の配列を確率順に並べ替えるメソッド
    sortWords () {
      this.predictedWords.sort(this.compareFunc)
    },
    // 確率順（降順）に並べ替えるためにsortメソッドに渡す比較関数
    compareFunc (a, b, n = 0) {
      const diff = Number(b[n][0]) - Number(a[n][0])
      if (diff) {
        return diff
      } else {
        const n1 = n + 1
        if (a[n1] && b[n1]) return this.compareFunc(a, b, n1)
        else if (a[n1])     return -1
        else if (b[n1])     return 1
        else                return 0
      }
    },
    // APIにリクエストを送信する処理
    getNextWords () {
      if (this.notAllowRequest) return
      const requestNumber = ++this.requestNumber

      fetch(this.serverAddress, this.apiOptions)
        .then(response => response.json())
        .then(jsonData => {
          this.setServerStatus({ serverStatus: RUNNING })
          if (this.requestNumber === requestNumber)
            this.updatePrediction(jsonData.predictedWords)
        })
        .catch(error => {
          this.setServerStatus({ serverStatus: DOWN })
        })
    },
    // 予測単語リストに新しいデータを追加するメソッド
    updatePrediction (predictedWords) {
      this.predictedWords = this.predictedWords
                                .concat(predictedWords)
                                .sort(this.compareFunc)
    },
    onInput (value) {
      // 末尾の予測文字列を取り除いて、値を更新する
      let predictedText = this.predictedText.replace('(', '\\(')
                                            .replace(')', '\\)')
                                            .replace('[', '\\[')
                                            .replace(']', '\\]')
      let newValue = value.replace(new RegExp(predictedText + '$'), '')
      if (newValue.slice(-1) === LF && newValue.slice(-2, -1) !== LF)
        newValue += LF
      this.text = newValue
    },
    // Textareaのinputイベントハンドラ
    onInputE () {
      this.tabFlag = false

      if (
        event.type === 'input' && event.data === ' ' ||
        event.type === 'keydown' && event.key === 'Enter'
      ) {
        if (this.isNextWordPerfectMatch) {
          this.matchProcessing()
        } else {
          this.filteringWords(event.data)
        }
      } else {
        if (!this.isNextWordPartialMatch && !this.isNextWordPerfectMatch) {
          this.filteringWords(event.data)
        }
      }
      this.debouncedGetNextWords.cancel()
      this.debouncedGetNextWords()
    },
    // 正しくない予測をフィルターにかけるメソッド
    filteringWords (lastInput) {
      while (this.predictedWords.length) {
        if (
          (this.isNextWordPartialMatch ||
          this.isNextWordPerfectMatch) &&
          !this.isLastCharactorBlank ||
          this.isLastCharactorBlank && this.nextWord[0] === ' '
        ) {
          return
        } else {
          this.predictedWords.shift()
        }
      }
    },
    // 最後の単語が予想した単語と一致したときの処理
    matchProcessing () {
      const newArray = []
      const word = this.nextWord
      this.predictedWords.forEach($sequence => {
        const sequence = this.copyArray($sequence)
        if (sequence[0][1] !== word) {
          return
        }
        sequence.shift()
        if (sequence.length) {
          newArray.push(sequence)
        }
      })
      this.predictedWords = newArray
      this.sortWords()
    },
    // 予測した単語を文章とつなげる処理
    onKeyTab () {
      if (!this.nextWord) return
      const matchFlag = this.isNextWordPerfectMatch
      this.$refs['EditableWindow'].moveCaretBy(this.preProcessedNextWord.length)
      this.text += this.preProcessedNextWord
      this.tabFlag = true
      this.matchProcessing()
      if (matchFlag) return this.onKeyTab()
      this.debouncedGetNextWords.cancel()
      this.debouncedGetNextWords()
    },
    // Enterキー押下時の処理
    onKeyEnter () {
      if (this.text.trim() === this.command.startServer) {
        if (this.serverStatus === DOWN) {
          event.preventDefault()
          this.setServerStatus({ serverStatus: STARTING })
          setTimeout(() => { this.text = '' }, 0)
          setTimeout(() => {
            this.setServerStatus({ serverStatus: RUNNING })
          }, 3000)
        }
      }
    },
  }
}
</script>

<style lang="scss">
span.private {
  margin-left: 0.1px;
  color: white;
  text-shadow: 0 0 2px #07f7e7;
}
</style>