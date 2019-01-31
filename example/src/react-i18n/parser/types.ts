import ElementNode from './ElementNode'
import TextNode from './TextNode'

export enum SyntaxKind {
  text = 'text',
  open = 'open',
  close = 'close',
  self = 'self',
}

export interface Token {
  kind: SyntaxKind
  tagName?: string
  attributes?: string
  text: string
}

export type DocNode = ElementNode | TextNode
