import { ReactNode } from 'react'

export interface Translations {
  [locale: string]: TranslationSet
}

export interface TranslationSet extends Record<string, string[]> {
  // { singular: [ plural, ...translations ]}
}

type BasicTypes = boolean | string | number | null | undefined

export type TranslateData = Record<string, BasicTypes> | null

export type TranslateDataWithJSX = Record<
  string,
  ((children: React.ReactNode, attributes?: string) => React.ReactNode) | BasicTypes
> | null

export interface TranslationOptions {
  strict?: boolean
  jsxWhitelist?: TranslateDataWithJSX

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

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
