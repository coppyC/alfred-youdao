import curl from './utils/curl'

/**
 * 有道翻译 api
 * @param {string} query
 * @returns {{
    "returnPhrase": string[],
    "RequestId": string,
    "web": {
      "value": string[],"key": string}[],
      "query": string,
      "translation": string[],
      "errorCode": string,
      "dict": {"url": string},
      "webdict": {"url": string},
      "basic": {
        "exam_type": string[],
        "us-phonetic": string,
        "phonetic": string,
        "uk-phonetic": string,
        "uk-speech": string,
        "explains": string[],
        "us-speech": string
      },
      "l": string,
      "speakUrl": string,
      "tSpeakUrl": string,
    }}
 */
function youDaoTranslate(query) {
  // 备用 appKey: 2423360539ba5632
  // http://ai.youdao.com/product-fanyi-text.s
  return curl('https://aidemo.youdao.com/trans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Origin: 'https://ai.youdao.com',
      Referer: 'https://ai.youdao.com/product-fanyi-text.s',
    },
    data: `q=${query}&from=Auto&to=Auto`
  })
}

/**
 * 入口
 * @param {string[]} argv
 */
export default function (argv) {
  const q = argv.join(' ').replace(/[a-z][A-Z]/g, $$ => $$[0] + ' ' + $$[1].toLowerCase())
  if (/^[a-z]$/.test(q)) delay(30)
  const result = youDaoTranslate(q)
  if (result.errorCode == '411')
    return JSON.stringify({
      items: [{
        title: 'error: 访问频率受限,请稍后访问',
        icon: { path: './error.png' }
      }]
    })
  if (result.errorCode != '0')
    return JSON.stringify({
      items: [{
        title: 'error: ' + result.errorCode,
        icon: { path: './error.png' }
      }]
    })
  return JSON.stringify({
    items: result.translation.map(item => ({
      title: item,
      arg: item,
    }))
  })
}
