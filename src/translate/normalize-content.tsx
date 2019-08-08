import { TranslationOptions } from '../types'

export const normalizeContent = (
  message: string,
  options?: TranslationOptions['content']
) => {
  const {
    trimWhiteSpace = true,
    preserveIndentation = false,
    replaceNewLines = false,
  } = options || {}

  if (trimWhiteSpace) {
    message = message.replace(/^\n+|\s+$/g, '')
  }
  if (!preserveIndentation) {
    message = message.replace(/^[ \t]+/gm, '')
  }
  message = message.replace(/\r\n/g, '\n')
  if (typeof replaceNewLines === 'string') {
    message = message.replace(/^\n+|\s+$/g, replaceNewLines)
  }

  return message
}
