import { parse } from './parse'

describe('parse', () => {
  it('can parse strings', () => {
    expect(parse('foo <foo>bar</foo> {bar}')).toMatchSnapshot()
    expect(parse('foobar')).toMatchSnapshot()
    expect(parse('foobar <bar /><bar/><bar attributes />')).toMatchSnapshot()
    expect(parse('foobar <bar attributes />')).toMatchSnapshot()
    expect(parse('foobar {bar} <bar />')).toMatchSnapshot()
  })

  it('throws an error when missing open nodes', () => {
    expect(() => parse('bar</a>')).toThrowErrorMatchingSnapshot()
    expect(() => parse('<a>bar</a></b>')).toThrowErrorMatchingSnapshot()
    expect(() => parse('<a>bar</a></a>')).toThrowErrorMatchingSnapshot()
  })

  it('throws an error when missing close nodes', () => {
    expect(() => parse('<a>bar')).toThrowErrorMatchingSnapshot()
    expect(() => parse('<b><a>bar')).toThrowErrorMatchingSnapshot()
    expect(() => parse('<b><a>bar</a>')).toThrowErrorMatchingSnapshot()
  })
})
