import { ElementNode } from './ElementNode'
import { TextNode } from './TextNode'
import { DocNode, SyntaxKind, Token } from './types'

const addToken = (
  stack: Token[],
  line: string,
  isTextNode: boolean = false
): void => {
  if (line.trim() === '') {
    return
  }

  if (isTextNode) {
    stack.push({
      kind: SyntaxKind.text,
      text: line,
    })
    return
  }

  let match: RegExpMatchArray | null

  // <tag attrs />
  if ((match = line.match(/<([^\s<>]+) ?([^<>]*)\/>/))) {
    stack.push({
      kind: SyntaxKind.self,
      tagName: match[1],
      attributes: match[2],
      text: line,
    })
    return
  }

  // </tag>
  if ((match = line.match(/<\/([^\s<>]+)>/))) {
    stack.push({
      kind: SyntaxKind.close,
      tagName: match[1],
      text: line,
    })
    return
  }

  // <tag attrs>
  if ((match = line.match(/<([^\s<>]+) ?([^<>]*)>/))) {
    stack.push({
      kind: SyntaxKind.open,
      tagName: match[1],
      attributes: match[2],
      text: line,
    })
    return
  }

  // {text}
  if ((match = line.match(/{([a-z0-9_-]+)}/i))) {
    stack.push({
      kind: SyntaxKind.self,
      tagName: match[1],
      attributes: match[1],
      text: line,
    })
    return
  }

  return
}

const tokenize = (str: string): Token[] => {
  const pattern = /(<[^<>]+>|{[a-z0-9_-]+})/gi
  const stack: Token[] = []

  let match: RegExpExecArray | null = null
  let pointer: number = 0
  while ((match = pattern.exec(str))) {
    addToken(stack, str.slice(pointer, match.index), true)
    addToken(stack, match[1])
    pointer = match.index + match[0].length
  }

  const hasMoreText = pointer < str.length
  if (hasMoreText) {
    addToken(stack, str.slice(pointer), true)
  }

  return stack
}

const lex = (tokens: Token[]): DocNode[] => {
  const children: DocNode[] = []

  if (tokens.length === 0) {
    return children
  }

  let currentNode: DocNode | null = null
  for (const node of tokens) {
    if (node.kind === SyntaxKind.text) {
      if (currentNode instanceof ElementNode) {
        currentNode.children.push(new TextNode(node.text, currentNode))
      } else {
        children.push(new TextNode(node.text, null))
      }

      continue
    }

    if (node.kind === SyntaxKind.close) {
      if (!(currentNode instanceof ElementNode)) {
        throw new Error(`missing open node: '${node.tagName}'`)
      }
      if (node.tagName !== currentNode.tagName) {
        throw new Error(`missing close node: '${currentNode.tagName}'`)
      }

      currentNode = currentNode.parent
      continue
    }

    if (node.kind === SyntaxKind.open) {
      const newNode = new ElementNode(node, currentNode)
      if (currentNode instanceof ElementNode) {
        currentNode.children.push(newNode)
      } else {
        children.push(newNode)
      }

      currentNode = newNode
      continue
    }

    if (node.kind === SyntaxKind.self) {
      if (currentNode instanceof ElementNode) {
        currentNode.children.push(new ElementNode(node, currentNode))
      } else {
        children.push(new ElementNode(node, null))
      }
      continue
    }
  }

  if (
    currentNode instanceof ElementNode &&
    currentNode.kind === SyntaxKind.open
  ) {
    throw new Error(`missing close node: '${currentNode.tagName}'`)
  }

  return children
}

const parse = (str: string): DocNode[] => {
  // Break our string into tokens
  const lines = tokenize(str)
  // Add extra context to our tokens and validate the syntax
  const ast = lex(lines)
  // Return our syntax tree
  return ast
}

export { parse }
