import { ReactChild, ReactNode } from 'react';

export interface PoConfig {
  '': Record<string, string>
}

export interface PoTranslation {
  [key: string]: Record<string, string[]>
}

export type PoFile = PoConfig | PoTranslation

export interface Translations {
  [locale: string]: PoFile
}

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
