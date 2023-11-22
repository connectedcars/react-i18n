import React from 'react'

import { DocNode, ElementNode, parse, TextNode } from '../parser'
import {
  ReplaceJsxOptions,
  ReplaceStringOptions,
  ReplaceStringRegex,
  TranslateDataWithJSX,
} from '../types'

const defaultReplaceStringRegex: ReplaceStringRegex = {
  pattern: (key) => `{${key}}`,
}

export const replaceString = (
  str: string,
  data: TranslateDataWithJSX | null,
  options?: ReplaceStringOptions
) => {
  const { strict = false, replaceStringRegex = defaultReplaceStringRegex } =
    options || {}
  if (!data) {
    return str
  }

  Object.keys(data).forEach((key) => {
    const v = data[key]
    if (typeof v === 'function') {
      return
    }
    str = str.replace(
      new RegExp(replaceStringRegex.pattern(key), 'g'),
      String(v)
    )
  })

  if (strict) {
    const match = str.match(new RegExp(replaceStringRegex.pattern('([\\w-]+)')))
    if (match) {
      throw new Error(`translation data not found for tag: '${match[1]}'`)
    }
  }

  return str
}

export const replaceJsx = (
  str: string,
  data: TranslateDataWithJSX | null,
  options?: ReplaceJsxOptions
): React.ReactNode[] => {
  const { strict = false, replaceStringRegex = defaultReplaceStringRegex } =
    options || {}

  const keys = Object.keys(data || {})
  if (strict) {
    keys.push('[\\w-]+')
  }
  return parse(str, replaceStringRegex.pattern(`(${keys.join('|')})`)).map(
    (node) => renderNode(node, data, strict)
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
