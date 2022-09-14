// 最简单的是JSON序列化与反序列化
let a = {
    n: 1,
    b: ['hello']
}

let b = JSON.parse(JSON.stringify(a))
console.log(b)
b.n = 2
console.log(b.n)
console.log(a.n)
// log 是为了展示深拷贝，也就是b和a没有引用