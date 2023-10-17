import React from 'react'

import { DocNode, ElementNode, parse, TextNode } from '../parser'
import { TranslateDataWithJSX } from '../types'

export const replaceString = (
  text: string,
  data?: TranslateDataWithJSX | null
) => {
  if (!data) {
    return text
  }

  Object.keys(data).forEach((key) => {
    const v = data[key]
    if (typeof v === 'function') {
      return
    }
    text = text.replace(new RegExp(`{${key}}`, 'g'), String(v))
  })

  return text
}

export const replaceJsx = (
  str: string,
  data: TranslateDataWithJSX | null,
  strict: boolean
): React.ReactNode[] => {
  return parse(replaceString(str, data)).map((node) =>
    renderNode(node, data, strict)
  )
}

const renderNode = (
  node: DocNode,
  data: TranslateDataWithJSX | null,
  strict: boolean
): React.ReactNode => {
  if (node instanceof TextNode) {
    return node.text
  }

  if (node instanceof ElementNode) {
    if (data) {
      const dataValue = data[node.tagName]
      if (dataValue != null) {
        if (typeof dataValue === 'function') {
          return dataValue(
            node.children.map((node) => renderNode(node, data, strict)),
            node.attributes
          )
        }

        return dataValue
      }
    }

    if (strict) {
      throw new Error(`translation data not found for tag: '${node.tagName}'`)
    }

    return React.createElement(
      node.tagName,
      { key: node.text },
      node.children.map((node) => renderNode(node, data, strict))
    )
  }

  throw new Error(
    `translation node type is not supported: ${JSON.stringify(node)}`
  )
}
