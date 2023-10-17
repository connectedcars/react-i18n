import React from 'react'
import { replaceString } from '../translate'
import { replaceJsx } from './replace-content'

describe('replace-content', () => {
  it('can replace a string', () => {
    expect(
      replaceString('Hello {name}', { name: 'John Doe' })
    ).toMatchSnapshot()
  })

  it('can replace JSX', () => {
    expect(
      replaceJsx('Hello <strong>{name}</strong>', { name: 'John Doe' }, false)
    ).toMatchSnapshot()

    expect(() =>
      replaceJsx('Hello <strong>{name}</strong>', { name: 'John Doe' }, true)
    ).toThrowErrorMatchingSnapshot()

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
        true
      )
    ).toMatchSnapshot()
  })
})
