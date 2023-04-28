/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 1. parse就是将一段DOM字符串，利用正则，转换拆分为AST结构的对象
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 2. 优化AST，添加 static（静态节点） 和 staticRoot（静态根节点） 标记，
    // 节省后面的diff算法时间
    optimize(ast, options)
  }
  // 3. 返回render方法和staticRenderFns数组
  const code = generate(ast, options)
  return {
    ast, // 抽象语法树
    render: code.render, // 返回 with(this) { return _c(code..) }
    staticRenderFns: code.staticRenderFns // 返回被标记为static的 render 数组
  }
})
