import { ReactNode } from 'react'

// Example: { "da": ...TranslationSet }
export type Translations = Record<string, TranslationSet>

// Example: { "": {...TranslationConfig}, "Hello": TranslationItem }
export type TranslationSet =
  | Record<'', TranslationConfig>
  | Record<string, TranslationItem>

// Example: { "content-type": "text/plaing", ... }
export type TranslationConfig = Record<string, string>

// Example: { "Hello": [null, "Hej"] }
export type TranslationItem = Array<null | string | string[]>

type BasicTypes = boolean | string | number

export type TranslateData = Record<string, BasicTypes> | null

export type TranslateDataWithJSX = Record<
  string,
  | ((children: React.ReactNode, attributes?: string) => React.ReactNode)
  | BasicTypes
> | null

export interface TranslationOptions {
  strict?: boolean
  verbose?: boolean
  jsxWhitelist?: TranslateDataWithJSX
  replaceStringRegex?: ReplaceStringRegex

  content?: {
    trimWhiteSpace?: boolean
    preserveIndentation?: boolean
    replaceNewLines?: false | string
  }
}

export type TranslateFunc = (
  message: string,
  data?: TranslateData,
  context?: string
) => string

export type TranslateJsxFunc = (
  message: string,
  data?: TranslateDataWithJSX,
  context?: string
) => ReactNode

export type TranslatePluralFunc = (
  n: number,
  singular: string,
  plural: string,
  data?: TranslateData,
  context?: string
) => string

export type TranslatePluralJsxFunc = (
  n: number,
  singular: string,
  plural: string,
  data?: TranslateDataWithJSX,
  context?: string
) => ReactNode

export type FormatLocaleOption = 'xx-yy' | 'xx_yy' | 'xx-YY' | 'xx_YY'

export interface ReplaceStringRegex {
  pattern: (key: string) => string
}

export interface ReplaceStringOptions {
  strict?: boolean
  replaceStringRegex?: ReplaceStringRegex
}

export interface ReplaceJsxOptions {
  strict?: boolean
  replaceStringRegex?: ReplaceStringRegex
}
