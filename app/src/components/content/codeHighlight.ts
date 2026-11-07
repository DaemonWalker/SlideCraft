export type CodeTokenTone = 'keyword' | 'string' | 'comment' | 'number' | 'property' | 'tag'

export interface CodeToken {
  text: string
  tone?: CodeTokenTone
}

const commonKeywords = [
  'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
  'else', 'export', 'extends', 'finally', 'for', 'from', 'function', 'if', 'implements',
  'import', 'interface', 'let', 'new', 'private', 'protected', 'public', 'return', 'static',
  'super', 'switch', 'this', 'throw', 'try', 'type', 'var', 'void', 'while',
]

const languageKeywords: Record<string, string[]> = {
  java: [...commonKeywords, 'boolean', 'byte', 'char', 'double', 'enum', 'float', 'int', 'long', 'package', 'short'],
  javascript: [...commonKeywords, 'delete', 'in', 'instanceof', 'of', 'undefined', 'yield'],
  json: ['false', 'null', 'true'],
  python: ['and', 'as', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True', 'try', 'while', 'with', 'yield'],
  shell: ['case', 'do', 'done', 'echo', 'elif', 'else', 'esac', 'exit', 'export', 'fi', 'for', 'function', 'if', 'in', 'local', 'return', 'then', 'while'],
  sql: ['ALTER', 'AND', 'AS', 'ASC', 'BEGIN', 'BETWEEN', 'BY', 'CASE', 'COMMIT', 'CREATE', 'DELETE', 'DESC', 'DISTINCT', 'DROP', 'ELSE', 'END', 'EXISTS', 'FROM', 'GROUP', 'HAVING', 'IN', 'INNER', 'INSERT', 'INTO', 'IS', 'JOIN', 'LEFT', 'LIKE', 'LIMIT', 'NOT', 'NULL', 'ON', 'OR', 'ORDER', 'OUTER', 'RIGHT', 'ROLLBACK', 'SELECT', 'SET', 'TABLE', 'THEN', 'UNION', 'UPDATE', 'VALUES', 'WHEN', 'WHERE'],
  typescript: [...commonKeywords, 'any', 'declare', 'enum', 'infer', 'keyof', 'namespace', 'never', 'of', 'readonly', 'unknown'],
  vue: [...commonKeywords, 'defineProps', 'withDefaults'],
  xml: [],
  yaml: ['false', 'null', 'true'],
}

const aliases: Record<string, string> = {
  bash: 'shell',
  cjs: 'javascript',
  html: 'xml',
  js: 'javascript',
  mjs: 'javascript',
  properties: 'yaml',
  py: 'python',
  sh: 'shell',
  ts: 'typescript',
  yml: 'yaml',
  zsh: 'shell',
}

const tokenPattern = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|--[^\n]*|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][\w-]*\b)/g

export function highlightLine(line: string, language = ''): CodeToken[] {
  const normalizedLanguage = aliases[language.toLowerCase()] ?? language.toLowerCase()
  const keywords = languageKeywords[normalizedLanguage] ?? commonKeywords
  const keywordSet = new Set(keywords)
  const tokens: CodeToken[] = []
  let lastIndex = 0

  for (const match of line.matchAll(tokenPattern)) {
    const index = match.index
    const text = match[0]
    if (index > lastIndex) tokens.push({ text: line.slice(lastIndex, index) })

    let tone: CodeTokenTone | undefined
    const remainder = line.slice(index + text.length)
    if (text.startsWith('/*') || text.startsWith('//')) {
      tone = 'comment'
    } else if (text.startsWith('#') && ['properties', 'python', 'shell', 'yaml'].includes(normalizedLanguage)) {
      tone = 'comment'
    } else if (text.startsWith('--') && normalizedLanguage === 'sql') {
      tone = 'comment'
    } else if (/^["'`]/.test(text)) {
      tone = normalizedLanguage === 'json' && /^\s*:/.test(remainder) ? 'property' : 'string'
    } else if (/^\d/.test(text)) {
      tone = 'number'
    } else if (normalizedLanguage === 'xml' && /<\/?$/.test(line.slice(0, index))) {
      tone = 'tag'
    } else if (normalizedLanguage === 'xml' && /^\s*=/.test(remainder)) {
      tone = 'property'
    } else if ((normalizedLanguage === 'json' || normalizedLanguage === 'yaml') && /^\s*:/.test(remainder)) {
      tone = 'property'
    } else if (keywordSet.has(normalizedLanguage === 'sql' ? text.toUpperCase() : text)) {
      tone = 'keyword'
    }

    tokens.push({ text, tone })
    lastIndex = index + text.length
  }

  if (lastIndex < line.length) tokens.push({ text: line.slice(lastIndex) })
  return tokens.length ? tokens : [{ text: '' }]
}
