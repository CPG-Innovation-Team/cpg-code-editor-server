# 在线代码编辑器后端项目

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
├── jest.config.json    Jest单元测试配置文件
├── jest.setup.redis-mock.js
├── package-lock.json    项目依赖版本配置文件
├── package.json    项目配置文件
├── public    同构网站前端内容（为控制台预留）
├── redis.js    Redis数据库文件
├── routes    路由目录（为控制台预留）
├── socket.js    Socket.IO实时数据同步文件
├── tests    单元测试目录
└── views    同构网站前端页面模板（为控制台预留）
```

## 主要框架、组件及技术
- [Express](http://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [Redis](https://redis.io/)
- [GraphQL](https://graphql.org/)
- [PM2](https://pm2.keymetrics.io/)
