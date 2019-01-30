enum NodeType {
  text = 'text',
  open = 'open',
  close = 'close',
  self = 'self',
}

interface SimpleNode {
  type: NodeType
  tagName?: string
  attributes?: string
  text: string
}

type Stack = SimpleNode[]

// voidElements copied from React:
// https://github.com/facebook/react/blob/85dcbf83/src/renderers/dom/shared/ReactDOMComponent.js#L449
export const voidElements = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
  menuItem: true,
}

export type SomeNode = ElementNode | TextNode

export class TextNode {
  public type = NodeType.text
  public text: string
  public parent: SomeNode | null = null

  constructor(text: string, parent: SomeNode | null) {
    this.text = text
    this.parent = parent
  }
}

export class ElementNode {
  public type: NodeType
  public text: string = ''
  public tagName: string = ''
  public attributes?: string = ''
  public children: Array<SomeNode> = []
  public parent: SomeNode | null = null

  constructor(
    { type, tagName, attributes, text }: SimpleNode,
    parent: SomeNode | null
  ) {
    this.type = type
    this.text = text
    this.tagName = tagName!
    this.attributes = attributes
    this.parent = parent
  }
}

const addLine = (stack: Stack, line: string, isTextNode: boolean = false) => {
  if (line.trim() === '') {
    return
  }

  if (isTextNode) {
    stack.push({
      type: NodeType.text,
      text: line,
    })
    return
  }

  let match

  // <tag attrs />
  match = line.match(/<([^\s<>]+) ?([^<>]*)\/>/)
  if (match) {
    stack.push({
      type: NodeType.self,
      tagName: match[1],
      attributes: match[2],
      text: line,
    })
    return
  }

  // </tag>
  match = line.match(/<\/([^\s<>]+)>/)
  if (match) {
    stack.push({
      type: NodeType.close,
      tagName: match[1],
      text: line,
    })
    return
  }

  // <tag attrs />
  match = line.match(/<([^\s<>]+) ?([^<>]*)>/)
  if (match) {
    stack.push({
      type: NodeType.open,
      tagName: match[1],
      attributes: match[2],
      text: line,
    })
  }
}

export const parse = (str: string): Array<SomeNode> => {
  const pattern = /(<[^<>]+>)/g
  const stack: Stack = []

  let match: RegExpExecArray | null = null
  let pointer: number = 0
  while ((match = pattern.exec(str))) {
    addLine(stack, str.slice(pointer, match.index), true)
    addLine(stack, match[1])
    pointer = match.index + match[0].length
  }

  const hasMoreText = pointer < str.length
  if (hasMoreText) {
    addLine(stack, str.slice(pointer), true)
  }

  const children: Array<SomeNode> = []

  if (stack.length === 0) {
    return children
  }

  let currentNode: SomeNode | null = null
  for (const node of stack) {
    if (node.type === NodeType.text) {
      if (currentNode instanceof ElementNode) {
        currentNode.children.push(new TextNode(node.text, currentNode))
      } else {
        children.push(new TextNode(node.text, null))
      }

      continue
    }

    if (node.type === NodeType.close && !voidElements[node.tagName!]) {
      if (!(currentNode instanceof ElementNode)) {
        throw new Error(`missing open node: ${node.tagName}`)
      }
      if (node.tagName !== currentNode.tagName) {
        throw new Error(`missing close node: ${currentNode.tagName}`)
      }

      currentNode = currentNode.parent
      continue
    }

    if (node.type === NodeType.open && !voidElements[node.tagName!]) {
      const newNode = new ElementNode(node, currentNode)
      if (currentNode instanceof ElementNode) {
        currentNode.children.push(newNode)
      } else {
        children.push(newNode)
      }

      currentNode = newNode
      continue
    }

    if (node.type === NodeType.self) {
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
    currentNode.type === NodeType.open
  ) {
    throw new Error(`missing close node: ${currentNode.tagName}`)
  }

  return children
}
