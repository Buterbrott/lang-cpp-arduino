import {parser} from "@lezer/cpp"
import {flatIndent, continuedIndent, indentNodeProp, foldNodeProp, foldInside,
        LRLanguage, LanguageSupport} from "@codemirror/language"

/// A language provider based on the [Lezer C++
/// parser](https://github.com/lezer-parser/cpp), extended with
/// highlighting and indentation information.
export const cppLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        IfStatement: continuedIndent({except: /^\s*({|else\b)/}),
        TryStatement: continuedIndent({except: /^\s*({|catch)\b/}),
        LabeledStatement: flatIndent,
        CaseStatement: context => context.baseIndent + context.unit,
        BlockComment: () => -1,
        Statement: continuedIndent({except: /^{/})
      }),
      foldNodeProp.add({
        "DeclarationList CompoundStatement EnumeratorList FieldDeclarationList InitializerList": foldInside,
        BlockComment(tree) { return {from: tree.from + 2, to: tree.to - 2} }
      })
    ]
  }),
  languageData: {
    commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
    indentOnInput: /^\s*(?:case |default:|\{|\})$/
  }
})

/// Language support for C++.
export function cpp() {
  return new LanguageSupport(cppLanguage)
}
