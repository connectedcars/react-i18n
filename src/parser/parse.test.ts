import parse from "./parse";
import TextNode from "./TextNode";

describe('parse', () => {
  it('can parse strings', () => {
    expect(parse('foo <foo>bar</foo> {bar}')).toMatchSnapshot()
    expect(parse('foobar')).toMatchSnapshot()
    expect(parse('foobar <bar /><bar/><bar attributes />')).toMatchSnapshot()
    expect(parse('foobar <bar attributes />')).toMatchSnapshot()
    expect(parse('foobar {bar} <bar />')).toMatchSnapshot()
  })

  it('throws an error when missing open nodes', () => {
    expect(() => parse('bar</a>')).toThrowError('missing open node: a')
    expect(() => parse('<a>bar</a></b>')).toThrowError('missing open node: b')
    expect(() => parse('<a>bar</a></a>')).toThrowError('missing open node: a')
  })

  it('throws an error when missing close nodes', () => {
    expect(() => parse('<a>bar')).toThrowError('missing close node: a')
    expect(() => parse('<b><a>bar')).toThrowError('missing close node: a')
    expect(() => parse('<b><a>bar</a>')).toThrowError('missing close node: b')
  })
})
