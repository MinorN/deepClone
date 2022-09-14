const DeepClone = require("../src/deepClone.js")
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const assert = chai.assert;
describe('deepClone', () => {
    it('是一个类', () => {
        assert.isFunction(DeepClone)
    })
    it('能够复制基本类型', () => {

        const n = 123

        const n2 = new DeepClone().clone(n)
        assert(n === n2)
        const s = '123456'
        const s2 = new DeepClone().clone(s)
        assert(s === s2)
        const b = true
        const b2 = new DeepClone().clone(b)
        assert(b === b2)
        const u = undefined
        const u2 = new DeepClone().clone(u)
        assert(u === u2)
        const empty = null
        const empty2 = new DeepClone().clone(empty)
        assert(empty === empty2)
        const sym = Symbol()
        const sym2 = new DeepClone().clone(sym)
        assert(sym === sym2)
    })
    describe('对象', () => {
        it('能够复制普通对象', () => {
            const a = {name: 'Yuk1', child: {name: '雪'}}
            const a2 = new DeepClone().clone(a)
            assert(a !== a2) // 表示是两个不同的对象
            assert(a.name === a2.name)
            assert(a.child !== a2.child) // 表示是两个不同的对象
            assert(a.child.name === a2.child.name)
        })
        it('能够复制数组对象', () => {
            const a = [[11, 12], [21, 22], [31, 32]]
            const a2 = new DeepClone().clone(a)
            assert.deepEqual(a, a2) // deepEqual不对比引用
        })
        it('能够复制函数', () => {
            const a = function (x, y) {
                return x + y
            }
            a.xxx = {yyy: {zzz: 1}}
            const a2 = new DeepClone().clone(a)
            assert(a.xxx !== a2.xxx)
            assert(a.xxx.yyy !== a2.xxx.yyy)
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz)
            assert(a(1, 2) === a2(1, 2))
        })
        it('环也能够复制', () => {
            // 没写环复制别执行，会死循环
            const a = {name: 'Yuk1'}
            a.self = a
            const a2 = new DeepClone().clone(a)
            assert(a !== a2) // 表示是两个不同的对象
            assert(a.name === a2.name)
            assert(a.self !== a2.self) // 表示是两个不同的对象
        })
        it('可以复制正则表达式',()=>{
            const a = new  RegExp('hi\\d+','gi')
            a.xxx = {yyy:{zzz:1}}
            const a2 = new DeepClone().clone(a)
            assert(a.source===a2.source)
            assert(a.flags===a2.flags)
            assert(a!==a2)
            assert(a.xxx !== a2.xxx)
            assert(a.xxx.yyy !== a2.xxx.yyy)
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz)
        })
        it('可以复制日期',()=>{
            const a = new Date()
            a.xxx = {yyy:{zzz:1}}
            const a2 = new DeepClone().clone(a)
            assert(a!==a2)
            assert(a.getTime()===a2.getTime())
            assert(a.xxx !== a2.xxx)
            assert(a.xxx.yyy !== a2.xxx.yyy)
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz)
        })
        it('自动跳过原型属性',()=>{
            const a = Object.create({name:'Hello'})
            a.xxx = {yyy:{zzz:1}}
            const a2 = new DeepClone().clone(a)
            assert(a!==a2)
            assert.isFalse('name' in a2)
            assert(a.xxx !== a2.xxx)
            assert(a.xxx.yyy !== a2.xxx.yyy)
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz)
        })
    })
})