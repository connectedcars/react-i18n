import { ReactChild, ReactNode } from 'react';

export interface Translations {
  [locale: string]: TranslationSet
}

// TranslationSet structure:
// { singular: [ plural, ...translations ]}
export interface TranslationSet extends Record<string, string[]> {}

export type TranslateFunc = (
  message: string,
  data?: Record<string, any>,
  context?: string
) => string

export type TranslateJsxFunc = (
  message: string,
  data?: Record<string, ReactChild>,
  context?: string
) => ReactNode

export type TranslatePluralFunc = (
  n: number,
  singular: string,
  plural: string,
  data?: Record<string, any>,
  context?: string
) => string

export type TranslatePluralJsxFunc = (
  n: number,
  singular: string,
  plural: string,
  data?: Record<string, any>,
  context?: string
) => ReactNode
