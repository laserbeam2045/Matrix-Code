/* eslint-disable */

// タッチイベントのサポートの有無
const supportTouch = 'ontouchend' in document

export const TOUCHSTART = supportTouch ? 'touchstart' : 'mousedown'
export const TOUCHMOVE  = supportTouch ? 'touchmove'  : 'mousemove'
export const TOUCHEND   = supportTouch ? 'touchend'   : 'mouseup'
export const TOUCHLEAVE = supportTouch ? 'touchleave' : 'mouseleave'

export default {
  methods: {
    // 与えられた引数が、絶対位置指定のHTML要素であるかどうかを返すメソッド
    isPositionAbsolute (element) {
      return (
        element &&
        element.style &&
        element.style.position === 'absolute'
      )
    },
    // 第一引数から見て直近の、第二引数の条件を満たす祖先要素を返すメソッド
    getClosestElement (element, conditionFunc, checkLimit = 10) {
      for (let i = 0; i < checkLimit; i++) {
        element = element.parentElement
        if (element === null) {
          console.error('Component could not find element.')
          return null
        }
        else if (conditionFunc(element)) {
          return element
        }
      }
    },
    // 与えられた引数が、マウス系のイベントであるかどうかを返すメソッド
    isMouseEvent (e) {
      return (
        e.type === 'mousedown' ||
        e.type === 'mousemove' ||
        e.type === 'mouseup' ||
        e.type === 'mouseleave'
      )
    },
    getPageX (e) {
      const event = this.isMouseEvent(e) ? e : e.changedTouches[0]
      return event.pageX
    },
    getPageY (e) {
      const event = this.isMouseEvent(e) ? e : e.changedTouches[0]
      return event.pageY
    },
  },
}