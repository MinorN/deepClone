# 手写深拷贝

什么是深拷贝？

b是a的一份拷贝，b里面没有对a中对象的引用

步骤：(明确需求)

* 询问数据类型

* 询问数据规模

  数据有多少个属性？多少层嵌套？

* 询问性能要求

* 询问运行环境

* 其他要求

## 方法一：JSON（反）序列化



```js
const b = JSON.parse(JSON.stringify(a))
```

缺点：

1. 不支持函数（但是不会报错）

2. 不支持`undefined`（因为``` json```只支持```null```）

3. 不支持引用，也就是不支持环

   ```js
   let a = {
   	name:'a'
   }
   a.self = a
   // 这就是一个引用
   ```

	4. 不支持`Date`（会变成`ISO8601`）(会把`Date`变成字符串)
	4. 不支持正则表达式

## 方法二：递归克隆

思路：

* 看节点类型（7种）
* 如果是基本类型=>直接拷贝
* 如果是Object=>分情况讨论

Object：

* 普通的`object`
* 数组
* 函数
* 日期

步骤：

* 创建目录，引入`chai`和`sinon`
* 驱动测试开发
* 测试失败=>改代码=>测试成功=>加测试=>测试失败

第一步：基本类型`deepClone`

```js
function deepClone(source){
    return source
}
```

第二步：普通对象`deepClone`

```js
function deepClone(source) {
    if (source instanceof Object) {
        const dist = new Object()
        for (let key in source) {
            dist[key] = deepClone(source[key])
        }
        return dist
    }
    return source
}
const a = [[11, 12], [21, 22], [31, 32]]
const a2 = deepClone(a)
console.log(a2)
// 发现a2有问题，本来a是数组，结果a2是对象，改写代码
function deepClone(source) {
    if (source instanceof Object) {
        if (source instanceof Array) {
            const dist = new Array()
            for (let key in source) {
                dist[key] = deepClone(source[key])
            }
            return dist
        } else {
            const dist = new Object()
            for (let key in source) {
                dist[key] = deepClone(source[key])
            }
            return dist
        }

    }
    return source
}
// 还有函数没有deepClone，再次改写代码
function deepClone(source) {
    if (source instanceof Object) {
        if (source instanceof Array) {
            const dist = new Array()
            for (let key in source) {
                dist[key] = deepClone(source[key])
            }
            return dist
        } else if (source instanceof Function) {
            // console.log 一个函数没什么意义，你可以log一下
            // 所有使用 console.dir()来查看函数
            // fn.toString()就是函数体，不信可以fn.toString()试一下
            const dist = function () {
                return source.apply(this, arguments)
            }
            for (let key in source) {
                dist[key] = deepClone(source[key])
            }
            return dist
        } else {
            const dist = new Object()
            for (let key in source) {
                dist[key] = deepClone(source[key])
            }
            return dist
        }

    }
    return source
}
// 如果出现环怎么办？
// 进入的时候有个缓存，说明访问过，出现环就能够说明缓存过,直接复制即可
// 先优化一下代码
function deepClone(source) {
    if (source instanceof Object) {
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
        } else {
            dist = new Object()
        }
        for (let key in source) {
            dist[key] = deepClone(source[key])
        }
        return dist
    }
    return source
}
```

```js
// 解决环状结构deepClone
// 1.有一个数组来接受缓存
// 2.进入后需要先判断是否存在缓存
let cache = []
function deepClone(source) {
    if (source instanceof Object) {
        if(cache.indexOf(source)>=0){
            // 有缓存
            return source
        }else{
            // 无缓存
            cache.push(source)
        }
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
        } else {
            dist = new Object()
        }
        for (let key in source) {
            dist[key] = deepClone(source[key])
        }
        return dist
    }
    return source
}
// 发现还是不行，思考原因：deepClnoe返回的应该是对应的deepClone
let cache = []
function deepClone(source) {
    if (source instanceof Object) {
        let cacheDist = findCache(source)
        if(cacheDist){
            return cacheDist
        }else{
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
            } else {
                dist = new Object()
            }
            cache.push([source,dist]) // 必须要放到for循环上面，因为for循环会继续deepClone
            for (let key in source) {
                dist[key] = deepClone(source[key])
            }
            return dist
        }
    }
    return source
}

function findCache(source){
    for (let i =0;i<cache.length;i++){
        if(cache[i][0]===source){
            return cache[i][1]
        }
    }
    return undefined
}
```

第三步：可以复制正则表达式

```js
let cache = []

function deepClone(source) {
    if (source instanceof Object) {
        let cacheDist = findCache(source)
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
                // 正则
                dist = new RegExp(source.source,source.flags)
            } else {
                dist = new Object()
            }
            cache.push([source, dist]) // 必须要放到for循环上面，因为for循环会继续deepClone
            for (let key in source) {
                dist[key] = deepClone(source[key])
            }
            return dist
        }
    }
    return source
}

function findCache(source) {
    for (let i = 0; i < cache.length; i++) {
        if (cache[i][0] === source) {
            return cache[i][1]
        }
    }
    return undefined
}
```

第四步：可以复制日期

```js
let cache = []

function deepClone(source) {
    if (source instanceof Object) {
        let cacheDist = findCache(source)
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
                // 可以复制日期
                dist = new Date(source)
            } else {
                dist = new Object()
            }
            cache.push([source, dist]) // 必须要放到for循环上面，因为for循环会继续deepClone
            for (let key in source) {
                dist[key] = deepClone(source[key])
            }
            return dist
        }
    }
    return source
}

function findCache(source) {
    for (let i = 0; i < cache.length; i++) {
        if (cache[i][0] === source) {
            return cache[i][1]
        }
    }
    return undefined
}
```

最后一步：是否需要拷贝原型属性？

```	js
// 如下
let a = Object.create({name:'Hello'})
console.log(a)
// 发现{name:'Hello'}在原型上，所以deepClone需不需要拷贝原型的属性呢？
// 一般来说不拷贝，如果拷贝就要逐层拷贝
// 如何做呢？这就是for in 的坑了，for in 会遍历原型上的属性，
// 只需要判断是否是自身的属性:hasOwnProperty
// 修改如下:
let cache = []
function deepClone(source) {
    if (source instanceof Object) {
        let cacheDist = findCache(source)
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
            cache.push([source, dist]) // 必须要放到for循环上面，因为for循环会继续deepClone
            for (let key in source) {
                if(source.hasOwnProperty(key)){
                    dist[key] = deepClone(source[key])
                }
            }
            return dist
        }
    }
    return source
}

function findCache(source) {
    for (let i = 0; i < cache.length; i++) {
        if (cache[i][0] === source) {
            return cache[i][1]
        }
    }
    return undefined
}

```

其实代码还是有些问题，因为每次`deepClone`，`cache`都是一个，所以需要每次`deepClone`的都是一个新的`cache`

```js
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
```

