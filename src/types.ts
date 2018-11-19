export type TranslateFunc = (text: string, data?: object, context?: string) => string
export type TranslatePluralFunc = (n: number, text: string, textPlural: string, data?: object, context?: string | null) => string
