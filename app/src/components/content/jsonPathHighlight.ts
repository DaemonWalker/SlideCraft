import type { CodeHighlightRange } from './CodeBlock.vue'

type PathSegment = string | number

interface JsonNodeRange {
  start: number
  end: number
}

const serializePath = (segments: PathSegment[]) => segments.reduce<string>((path, segment) => {
  if (typeof segment === 'number') return `${path}[${segment}]`
  return path ? `${path}.${segment}` : segment
}, '')

class JsonRangeParser {
  private index = 0
  private readonly nodes = new Map<string, JsonNodeRange>()

  constructor(private readonly source: string) {}

  parse() {
    this.skipWhitespace()
    this.parseValue([])
    this.skipWhitespace()
    return this.nodes
  }

  private parseValue(path: PathSegment[]) {
    this.skipWhitespace()
    const start = this.index
    const character = this.source[this.index]
    if (character === '{') this.parseObject(path)
    else if (character === '[') this.parseArray(path)
    else if (character === '"') this.parseString()
    else if (character === '-' || /\d/.test(character)) this.parseNumber()
    else this.parseLiteral()
    this.nodes.set(serializePath(path), { start, end: this.index })
  }

  private parseObject(path: PathSegment[]) {
    this.index += 1
    this.skipWhitespace()
    if (this.source[this.index] === '}') {
      this.index += 1
      return
    }

    while (this.index < this.source.length) {
      this.skipWhitespace()
      const keyStart = this.index
      const key = this.parseString()
      this.skipWhitespace()
      if (this.source[this.index] !== ':') throw new Error('Invalid object property')
      this.index += 1
      const propertyPath = [...path, key]
      this.parseValue(propertyPath)
      this.nodes.set(serializePath(propertyPath), { start: keyStart, end: this.index })
      this.skipWhitespace()
      if (this.source[this.index] === ',') {
        this.index += 1
        continue
      }
      if (this.source[this.index] !== '}') throw new Error('Invalid object')
      this.index += 1
      return
    }
    throw new Error('Unterminated object')
  }

  private parseArray(path: PathSegment[]) {
    this.index += 1
    this.skipWhitespace()
    if (this.source[this.index] === ']') {
      this.index += 1
      return
    }

    let itemIndex = 0
    while (this.index < this.source.length) {
      this.parseValue([...path, itemIndex])
      itemIndex += 1
      this.skipWhitespace()
      if (this.source[this.index] === ',') {
        this.index += 1
        continue
      }
      if (this.source[this.index] !== ']') throw new Error('Invalid array')
      this.index += 1
      return
    }
    throw new Error('Unterminated array')
  }

  private parseString() {
    const start = this.index
    if (this.source[this.index] !== '"') throw new Error('Expected string')
    this.index += 1
    while (this.index < this.source.length) {
      const character = this.source[this.index]
      if (character === '\\') {
        this.index += 2
        continue
      }
      this.index += 1
      if (character === '"') return JSON.parse(this.source.slice(start, this.index)) as string
    }
    throw new Error('Unterminated string')
  }

  private parseNumber() {
    const match = this.source.slice(this.index).match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/)
    if (!match) throw new Error('Invalid number')
    this.index += match[0].length
  }

  private parseLiteral() {
    const literal = ['true', 'false', 'null'].find((value) => this.source.startsWith(value, this.index))
    if (!literal) throw new Error('Invalid value')
    this.index += literal.length
  }

  private skipWhitespace() {
    while (/\s/.test(this.source[this.index] ?? '')) this.index += 1
  }
}

const findLine = (lineStarts: number[], offset: number) => {
  let low = 0
  let high = lineStarts.length - 1
  while (low <= high) {
    const middle = Math.floor((low + high) / 2)
    if (lineStarts[middle] <= offset) low = middle + 1
    else high = middle - 1
  }
  return Math.max(0, high)
}

export const createJsonPathHighlightRanges = (code: string, paths: string[]): CodeHighlightRange[] => {
  const source = code.replace(/\r\n/g, '\n')
  if (!paths.length) return []

  let nodes: Map<string, JsonNodeRange>
  try {
    JSON.parse(source)
    nodes = new JsonRangeParser(source).parse()
  } catch {
    return []
  }

  const lineStarts = [0]
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === '\n') lineStarts.push(index + 1)
  }

  return paths.flatMap((path) => {
    if (!path) return []
    const node = nodes.get(path)
    if (!node || node.end <= node.start) return []

    const firstLine = findLine(lineStarts, node.start)
    const lastLine = findLine(lineStarts, node.end - 1)
    const ranges: CodeHighlightRange[] = []
    for (let lineIndex = firstLine; lineIndex <= lastLine; lineIndex += 1) {
      const lineStart = lineStarts[lineIndex]
      const lineEnd = lineStarts[lineIndex + 1] === undefined
        ? source.length
        : lineStarts[lineIndex + 1] - 1
      const start = Math.max(node.start, lineStart)
      const end = Math.min(node.end, lineEnd)
      if (end > start) ranges.push({ line: lineIndex + 1, start: start - lineStart, end: end - lineStart })
    }
    return ranges
  })
}
