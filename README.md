# 在线代码编辑器后端项目
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=CPG-Innovation-Team_cpg-code-editor-server&metric=alert_status)](https://sonarcloud.io/dashboard?id=CPG-Innovation-Team_cpg-code-editor-server)
[![CircleCI](https://circleci.com/gh/CPG-Innovation-Team/cpg-code-editor-server/tree/master.svg?style=svg)](https://circleci.com/gh/CPG-Innovation-Team/cpg-code-editor-server/tree/master)
[![codecov](https://codecov.io/gh/CPG-Innovation-Team/cpg-code-editor-server/branch/master/graph/badge.svg?token=U1BHB34KNX)](https://codecov.io/gh/CPG-Innovation-Team/cpg-code-editor-server)

## 系统依赖
### 需要安装 [Node.js](https://nodejs.org)
### 在版本 Node.js 14.17 上稳定运行
### 需要安装 [MongoDB](https://www.mongodb.com/)
### 建议安装 MongoDB Community 4.4 版本 [官方下载](https://www.mongodb.com/try/download/community)

## 操作命令
### 首次运行或有依赖变更时执行安装 `npm install`
### 启动本地服务 `npm run dev`
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
├── jest-mongodb-config.js    Jest MongoDB数据库单元测试配置文件
├── jest.config.json    Jest单元测试配置文件
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

## 集成工具
- 自动化构建部署 [CircleCI](https://app.circleci.com/pipelines/github/CPG-Innovation-Team/cpg-code-editor-server)
- 代码质量静态扫描 [SonarCloud](https://sonarcloud.io/project/overview?id=CPG-Innovation-Team_cpg-code-editor-server)
- 单元测试覆盖率报告 [Codecov](https://app.codecov.io/gh/CPG-Innovation-Team/cpg-code-editor-server)

## 接口
[后端接口文档](./docs/api.md)

## 数据库设计
[数据库设计文档](./docs/database.md)
