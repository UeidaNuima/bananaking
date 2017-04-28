# BananaKing

A tool for choosing things.

Inspired by 抽選王.

选选选，全都选

其实只是个人的一个Vue练手项目。如果有什么需求的话可以在issue中提，~~当然我不一定会加的~~。

https://moondropx.github.io/bananaking/

## Simple Usage

- 大概一看就会用了。准备候选列表->输入要抽选多少条->蕉
- 「蕉」为抽选按钮。
- 「保存」将当前列表/设置/结果存入localStorage。
- 「允许重复」开关打开时允许结果中出现重复条目。
- 「权重」开关在打开的时候会显示权重。
    - 只有权重开关开启时权重才视为有效。
    - 权重数字代表该条目的重量，同样的数字重量相等，数字越大越重。
    - 权重数字为2的列表的权重是权重数字为1的两倍，以此类推。
    - 支持小数。
    - ~~本菜鸡懒得做过滤，请不要输入负数。~~ 想想还是做了一个简单的过滤，负数会自动变成1。
- 「上传列表」接受一个编码为utf-8的纯文本文件。
- 支持以下两种格式
    ``` bash
    ----upload1.txt---
    选项1
    选项2
    一行一个
    ----upload2.txt---
    选项1,4
    一行一个,5
    后面的数字是权重,6
    用半角逗号隔开,7
    不加权重的话默认是1
    ```


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
