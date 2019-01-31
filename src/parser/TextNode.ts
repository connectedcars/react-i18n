import { SyntaxKind, DocNode } from './types'

class TextNode {
  public kind = SyntaxKind.text
  public text: string
  public parent: DocNode | null = null

  constructor(text: string, parent: DocNode | null) {
    this.text = text
    this.parent = parent
  }
}

export default TextNode
