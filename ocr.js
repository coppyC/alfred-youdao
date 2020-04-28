import curl from './utils/curl'

/**
 *
 * @param {string} imgBase
 * @returns {{
    errorCode: string
    lanFrom: string
    lanTo: string
    lines: { context: string, tranContent: string }[]
    orientation: 'Up' | 'Down' | 'Left' | 'Right'
    textAngle: string
   }}
 */
function ocr(imgBase) {
  return curl('https://aidemo.youdao.com/ocrtransapi1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Origin: 'https://ai.youdao.com',
      Referer: 'https://ai.youdao.com/product-fanyi-picture.s'
    },
    data: `imgBase=${encodeURIComponent(imgBase)}`
  })
}

export default function([imgBase]) {
  if (!imgBase) return
  const res = ocr('data:image/jpeg;base64,' + imgBase)
  return res.lines.map(line => line.context).join('\r') + '\r'
    + res.lines.map(line => line.tranContent).join('\r')
}
