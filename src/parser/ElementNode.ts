import { DocNode, SyntaxKind, Token } from './types'

export class ElementNode {
  public kind: SyntaxKind
  public text: string = ''
  public tagName: string = ''
  public attributes?: string = ''
  public children: Array<DocNode> = []
  public parent: DocNode | null = null

  constructor(
    { kind: type, tagName, attributes, text }: Token,
    parent: DocNode | null
  ) {
    this.kind = type
    this.text = text
    this.tagName = tagName || ''
    this.attributes = attributes
    this.parent = parent
  }
}
