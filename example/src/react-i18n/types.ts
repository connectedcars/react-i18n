import { ReactNode } from 'react'

export interface Translations {
  [locale: string]: TranslationSet
}

export interface TranslationSet extends Record<string, string[]> {
  // { singular: [ plural, ...translations ]}
}

export type TranslateData = Record<
  string,
  ((children: React.ReactNode, attributes?: string) => React.ReactNode) | string | number
> | null

export interface TranslationOptions {
  trimWhiteSpace?: boolean
  preserveIndentation?: boolean
  replaceNewLines?: false | string
}

export type TranslateFunc = (
  message: string,
  data?: TranslateData,
  context?: string
) => string

export type TranslateJsxFunc = (
  message: string,
  data?: TranslateData,
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
  data?: TranslateData,
  context?: string
) => ReactNode
