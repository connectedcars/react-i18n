import { ReactChild, ReactNode } from 'react';

export interface Translations {
  [locale: string]: TranslationSet
}

export interface TranslationSet extends Record<string, string[]> {
  // { singular: [ plural, ...translations ]}
}

export interface TranslationOptions {
  trimWhiteSpace?: boolean
  preserveIndentation?: boolean
  replaceNewLines?: false | string
}

export type TranslateFunc = (
  message: string,
  data?: Record<string, string | number> | null,
  context?: string
) => string

export type TranslateJsxFunc = (
  message: string,
  data?: Record<string, ReactChild> | null,
  context?: string
) => ReactNode

export type TranslatePluralFunc = (
  n: number,
  singular: string,
  plural: string,
  data?: Record<string, string | number> | null,
  context?: string
) => string

export type TranslatePluralJsxFunc = (
  n: number,
  singular: string,
  plural: string,
  data?: Record<string, ReactChild> | null,
  context?: string
) => ReactNode
