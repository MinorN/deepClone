// 引入测试框架
// yarn init -y   会创建一个package.json
// yarn install
// yarn test 就可以运行测试
class DeepClone {
    constructor() {
        this.cache = []
    }
    clone(source) {
        if (source instanceof Object) {
            let cacheDist = this.findCache(source)
            if (cacheDist) {
                return cacheDist
            } else {
                let dist
                if (source instanceof Array) {
                    dist = new Array()
                } else if (source instanceof Function) {
                    // console.log 一个函数没什么意义，你可以log一下
                    // 所有使用 console.dir()来查看函数
                    // fn.toString()就是函数体，不信可以fn.toString()试一下
                    dist = function () {
                        return source.apply(this, arguments)
                    }
                } else if (source instanceof RegExp) {
                    dist = new RegExp(source.source,source.flags)
                }else if(source instanceof Date){
                    dist = new Date(source)
                } else {
                    dist = new Object()
                }
                this.cache.push([source, dist]) // 必须要放到for循环上面，因为for循环会继续deepClone
                for (let key in source) {
                    if(source.hasOwnProperty(key)){
                        dist[key] = this.clone(source[key])
                    }
                }
                return dist
            }
        }
        return source
    }
    findCache(source) {
        for (let i = 0; i < this.cache.length; i++) {
            if (this.cache[i][0] === source) {
                return this.cache[i][1]
            }
        }
        return undefined
    }
}

module.exports = DeepClone