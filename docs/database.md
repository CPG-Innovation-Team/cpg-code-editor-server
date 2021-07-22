# 代码编辑器数据库结构

## 数据库
使用 [MongoDB](https://www.mongodb.com/) 4.4

## 集合结构 (Collection)
1. 项目信息
  - 集合名称: project_info
  - 数据结构：
  ```
  {
    _id  项目ID ObjectId
    hash  项目对应Hash值，用于短链接 String
    projectName  项目名称 String
    code  代码 String
    createTime  创建时间 Double
    updateTime  更新时间 Double
    syntax  编程语言 String
    available  是否可用（未被删除） Boolean
    createUser  创建用户ID ObjectId
    lastModifiedUser  最后编辑用户ID ObjectId
  }
  ```

2. 用户信息
  - 集合名称: user_info
  - 数据结构：
  ```
  {
    _id  用户ID ObjectId
    userName  用户名 String
    avatar  用户头像 String
    createTime  用户创建时间 Float
  }
  ```

3. 项目编辑信息
  - 集合名称: project_edit_info
  - 数据结构：
  ```
  {
    projectId  项目ID ObjectId
    relatedUser [
      {
        userId  用户ID ObjectId
        isOnline  是否在线 Boolean
        isEditing  是否正在编辑 Boolean
      }
    ]
  }
  ```