<template>
  <BasePre
    ref="BasePre"
    contenteditable
    v-html="innerHTML"
    :scrollTop="scrollTop"
    v-on="listeners"
  />
</template>

<script>
/* eslint-disable */
import { CR, LF, CRLF, regExpCR, regExpCRLF } from '../store/char-code-types'
import converter from '../mixins/converter'
import BasePre from './BasePre'

export default {
  name: 'Editable',
  mixins: [
    converter,
  ],
  components: {
    BasePre,
  },

  props: {
    value: {
      type: String,
      required: false,
      default: '',
    },
    scrollTop: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  data () {
    return {
      innerHTML: '',      // valueのコピー（キャレット位置をコントロールするために必要）
      isComposing: false, // 入力が未確定であるかどうか（全角入力時／Inputイベントでは判別できない為必要）
      isFocused: false,   // フォーカスされている状態かどうか
      selectionRange: {   // 選択領域（キャレット位置）
        startOffset: 0,
        endOffset: 0,
      },
    }
  },

  computed: {
    listeners () {
      return {
        scroll: this.onScroll,
        keydown: this.onKeydown,
        keyup: this.onKeyUp,
        input: this.onInput,
        paste: this.onPaste,
        mousedown: this.onMousedown,
        mouseup: this.onMouseup,
        focus: this.onFocus,
        blur: this.onBlur,
      }
    },
  },

  mounted () {
    this.innerHTML = this.value
  },

  watch: {
    value (val) {
      // DOMの再構築が完了するのを待つ必要があるためPromiseを使用する
      new Promise((resolve, reject) => {
        // この操作でキャレットが先頭に移動してしまう
        this.innerHTML = val
        if (this.isFocused) resolve()
      })
      .then(ver => {
        // 再びセレクションに適切な範囲を設定する
        this.applySelectionRange()
        const innerText = this.getInnerText()
        if (
          innerText.length === this.selectionRange.endOffset ||
          innerText.length === this.selectionRange.endOffset + 1
        ) {
          this.scrollToBottom()
        }
      })
    },
  },

  methods: {
    moveCaretBy (number) {
      this.selectionRange.startOffset += number
      this.selectionRange.endOffset += number
    },
    applySelectionRange () {
      const rootNode = this.$refs['BasePre'].$el
      const range = this.selectionRange
      this.adjustSelectionRange()
      const [startContainer, startOffset] = this.getElementalOffset(rootNode, range.startOffset)
      const [endContainer, endOffset] = this.getElementalOffset(rootNode, range.endOffset)
      this.setSelectionRange(startContainer, startOffset, endContainer, endOffset)
    },
    adjustSelectionRange () {
      const innerText = this.getInnerText()
      const range = this.selectionRange
      range.startOffset = Math.min(innerText.length, range.startOffset)
      range.endOffset = Math.min(innerText.length, range.endOffset)
    },
    onFocus () {
      this.isFocused = true
    },
    onBlur () {
      this.isFocused = false
    },
    onMousedown () {

    },
    onMouseup () {
      const range = this.getSelectionRange()
    },
    // キー入力開始時のイベントハンドラ
    onKeydown () {
      this.$emit('keydown', event)

      // 全角入力の未確定、または、確定時
      if (event.key === 'Process') {
        if (event.code === 'Enter') {
          this.isComposing = false  // 確定したのでinputイベントのemitを可能にする
        } else {
          this.isComposing = true   // 未確定なのでinputイベントのemitを不可能にする
        }
        return
      }
      // 半角入力、または、改行時
      else {
        this.isComposing = false
      }
      // Enterキーの入力処理は特別に処理する（brやdivタグを作らせないようにするため）
      if (event.key === 'Enter') {
        event.preventDefault()
        this.insertText(LF)
      }
      if (event.repeat) {
        this.scrollByArrowKey(event)
        this.markSelectionRange()
      }
    },
    // キー入力終了時のイベントハンドラ
    onKeyUp () {
      this.$emit('keyup', event)
      if (event.key !== 'Process') {
        this.scrollByArrowKey(event)
        this.markSelectionRange()
      }
    },
    getInnerText () {
      return this.$refs['BasePre'].getInnerText()
    },
    // inputイベントハンドラ
    onInput () {
      if (this.isComposing) return

      let innerText = this.getInnerText()
      innerText = this.trimLastLF(innerText)
      event.preventDefault()
      this.markSelectionRange()

      this.$emit('input', innerText)
      this.$emit('input-e', event)
    },
    // テキストの末尾に改行コードが1つだけ残っている場合に取り除くメソッド
    trimLastLF (text) {
      const match = text.match(/\s+$/)
      if (match && match[0] === LF) {
        text = text.slice(0, -1)
      }
      return text
    },
    // pasteイベントハンドラ
    onPaste () {
      event.preventDefault()
      let text
      if (window.clipboardData) {
        text = window.clipboardData.getData('text')
      } else {
        text = event.clipboardData.getData('text/plain')
      }
      // 改行コードをLFに統一させる（キャレット位置のずれ等につながるため）
      text = this.convertToLF(text)

      this.insertText(text)
    },
    // 現在のキャレット位置にテキストを挿入するメソッド
    // MEMO: セレクション(見た目)上の範囲に、実際の文字数を合わせるために一時的にデコードする
    insertText (text) {
      this.markSelectionRange()

      const innerText = this.getInnerText()
      let a = innerText.slice(0, this.selectionRange.startOffset)
      let b = innerText.slice(this.selectionRange.endOffset)

      // MEMO: DOMの仕様上、終了タグの前の改行はテキストノードにならない
      // => つまり改行とみなされないので、末尾の改行は1つ多くする必要がある
      if (text.slice(-1) === LF && b === '') text += LF

      // aの末尾が改行コードであり、かつ、bが空文字であるならば、
      // aの末尾の改行コードは既に1つ多いはずであり、ノードが結合すれば不要になるので取り除く
      if (a.slice(-1) === LF && b === '') a = a.slice(0, -1)

      // セレクションの範囲を設定する
      const offset = (a + text).length
      this.selectionRange.startOffset = offset
      this.selectionRange.endOffset = offset
      this.$emit('input', a + text + b)
    },
    // 最上部へスクロールするイベントを発火するメソッド
    scrollToTop () {
      this.$emit('scroll', 0)
    },
    // 最下部へスクロールするイベントを発火するメソッド
    scrollToBottom () {
      this.$emit('scroll', this.$refs['BasePre'].getScrollHeight())
    },
    // スクロールイベントハンドラ
    onScroll () {
      this.$emit('scroll', event.target.scrollTop)
    },
    // 上下矢印キー入力時にキャレット位置に変化がなければスクロールするメソッド
    scrollByArrowKey (event) {
      if (event.key === 'ArrowUp' && this.isNotCaretMoved()) {
        this.scrollToTop()
      }
      else if (event.key === 'ArrowDown' && this.isNotCaretMoved()) {
        this.scrollToBottom()
      }
    },
    // 現在のセレクションの範囲を取得するメソッド
    getSelectionRange () {
      const selection = window.getSelection()
      if (selection.rangeCount) {
        return selection.getRangeAt(0)
      }
    },
    // セレクションの範囲を設定するメソッド
    setSelectionRange (startContainer, startOffset, endContainer, endOffset) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.setStart(startContainer, startOffset)
      range.setEnd(endContainer, endOffset)
      selection.removeAllRanges()
      selection.addRange(range)
    },
    // 現在のセレクションの範囲を記録するメソッド
    markSelectionRange () {
      const rootNode = this.$refs['BasePre'].$el
      const range = this.getSelectionRange()
      const startOffset = this.getTextualOffset(rootNode, range.startContainer, range.startOffset)
      const endOffset = this.getTextualOffset(rootNode, range.endContainer, range.endOffset)
      this.selectionRange.startOffset = startOffset
      this.selectionRange.endOffset = endOffset
    },
    // DOMツリーの特定のノードに関連付けられたoffsetを、
    // DOMツリーにテキストノードだけが存在すると考えた場合のoffsetとして取得するメソッド
    getTextualOffset (node, container, offset) {
      let textLengthSum = 0
      switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        const maxIterationNum = (node === container) ? offset : node.childNodes.length
        for (let i = 0; i < maxIterationNum; i++) {
          const childNode = node.childNodes.item(i)
          textLengthSum += this.getTextualOffset(childNode, container, offset)
          if (childNode.contains(container)) break
        }
        break
      case Node.TEXT_NODE:
        textLengthSum = (node === container) ? offset : node.length
        break
      default:
        console.error(`${node.nodeType} is unexpected node type.`)
      }
      return textLengthSum
    },
    // getTextualOffsetの逆バージョン
    getElementalOffset (node, offset) {
      let textLengthSum = 0
      switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (offset === 0) return [node, offset]
        for (const childNode of node.childNodes) {
          const retValue = this.getElementalOffset(childNode, offset - textLengthSum)
          if (typeof(retValue) === 'object') return retValue
          if (typeof(retValue) === 'number') textLengthSum += retValue
        }
        break
      case Node.TEXT_NODE:
        return (offset <= node.length) ? [node, offset] : node.length
        break
      default:
        console.error(`${node.nodeType} is unexpected node type.`)
      }
      return textLengthSum
    },
    // キャレットの位置が前回記録時から変化していないときに真を返すメソッド
    isNotCaretMoved () {
      const currentStartOffset = this.selectionRange.startOffset
      const currentEndOffset = this.selectionRange.endOffset
      this.markSelectionRange()
      return (
        currentStartOffset === this.selectionRange.startOffset &&
        currentEndOffset === this.selectionRange.endOffset
      )
    },
  },
}
</script>