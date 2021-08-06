# 在线代码编辑器后端项目

## 系统依赖
### 需要安装 [Node.js](https://nodejs.org)
### 在版本 Node.js 14.17 上稳定运行
### 需要安装 [MongoDB](https://www.mongodb.com/)
### 建议安装 MongoDB Community 4.4 版本 [官方下载](https://www.mongodb.com/try/download/community)

## 操作命令
### 首次运行或有依赖变更时执行安装 `npm install`
### 启动本地服务 `npm run dev`
### 使用PM2启动生产环境服务 `npm run prod`
### 执行单元测试 `npm run test`
### 执行代码校验 `npm run lint`


## 项目主要文件与目录结构说明
```
.
├── README.md    项目说明文档
├── api    接口目录
│   ├── resolver.js    接口控制器文件
│   └── schema.js    接口类型定义文件
├── app.js    全局文件
├── bin
│   └── www    项目配置文件
├── database    数据库操作目录
│   ├── mongodb.js    MongoDB数据库配置及操作文件
│   ├── project.js    项目数据库操作文件
│   └── user.js    用户数据库操作文件
├── docs    文档目录
│   ├── api.js    接口文档
│   └── database.js    数据库结构文档
├── modules    逻辑模块目录
│   ├── project.js    项目逻辑文件
│   └── user.js    用户逻辑文件
├── package-lock.json    项目依赖版本配置文件
├── package.json    项目配置文件
├── public    同构网站前端内容（为控制台预留）
├── routes    路由目录（为控制台预留）
├── socket.js    Socket.IO实时数据同步文件
├── tests    单元测试目录
└── views    同构网站前端页面模板（为控制台预留）
```

## 主要框架、组件及技术
- [Express](http://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [GraphQL](https://graphql.org/)
- [PM2](https://pm2.keymetrics.io/)

## 接口
[后端接口文档](./docs/api.md)

## 数据库设计
[数据库设计文档](./docs/database.md)
