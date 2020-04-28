/**
* curl 命令封装
* @param {string} url
* @param {object} config
* @param {'GET'|'POST'|'PUT'|'DELETE'} config.method
* @param {*} config.headers
* @param {string} config.data
*/
export default function (url, config) {
  const response = app.doShellScript([
    'curl',
    config.method && `-X '${config.method.toUpperCase()}'`,
    config.headers && Object.keys(config.headers)
      .map(key => `-H '${key}: ${config.headers[key]}'`)
      .join(' '),
    config.data && `-d '${config.data}'`,
    `-A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36'`,
    `'${url}'`,
  ].filter(x => x).join(' '))
  try {
    return JSON.parse(response)
  } catch {
    return response
  }
}
