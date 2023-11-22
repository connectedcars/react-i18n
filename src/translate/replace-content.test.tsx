import React from 'react'

import { replaceString } from '../translate'
import { replaceJsx } from './replace-content'

describe('replace-content', () => {
  it('can replace a string', () => {
    expect(
      replaceString('Hello {name}', { name: 'John Doe' })
    ).toMatchSnapshot()
  })

  expect(() =>
    replaceString(
      'Hello {firstName} {lastName}',
      {
        firstName: 'Jane',
      },
      { strict: true }
    )
  ).toThrowErrorMatchingSnapshot()

  it('can replace a string with a custom pattern', () => {
    expect(
      replaceString(
        'Hello {{{name}}}',
        { name: 'John Doe' },
        { replaceStringRegex: { pattern: (key) => `{{{${key}}}}` } }
      )
    ).toMatchSnapshot()

    expect(
      replaceString(
        'Hello {{{firstName} {lastName}',
        { firstName: 'John', lastName: 'Doe' },
        { replaceStringRegex: { pattern: (key) => `{?{?{${key}}}?}?` } }
      )
    ).toMatchSnapshot()
  })

  it('can replace JSX', () => {
    expect(
      replaceJsx(
        'Hello {firstName} {lastName}',
        { firstName: 'Jane', lastName: 'Doe' },
        { strict: false }
      )
    ).toMatchSnapshot()

    expect(() =>
      replaceJsx('Hello {firstName} {lastName}', {}, { strict: true })
    ).toThrowErrorMatchingSnapshot()

    expect(() =>
      replaceJsx(
        'Hello <strong>{name}</strong>',
        { name: 'John Doe' },
        { strict: true }
      )
    ).toThrowErrorMatchingSnapshot()

    expect(
      replaceJsx(
        'Hello <b>Jane</b> {{{lastName}}}',
        {
          b: (content) => <strong>{content}</strong>,
          lastName: 'Doe',
        },
        {
          strict: true,
          replaceStringRegex: { pattern: (key) => `{{{${key}}}}` },
        }
      )
    ).toMatchSnapshot()

    const Link = (props: { children: React.ReactNode }) => {
      return <a href="https://example.com">{props.children}</a>
    }

    expect(
      replaceJsx(
        '<strong>Hello</strong> World <link>Foo bar</link>',
        {
          strong: (content) => <strong>{content}</strong>,
          link: () => <Link>Link here</Link>,
        },
        { strict: true }
      )
    ).toMatchSnapshot()
  })
})
