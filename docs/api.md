# 代码编辑器后端接口
## 接口类别
1. 基于 [GraphQL](https://graphql.org/) 的 HTTP 请求，全部使用 POST 方式，URL为 /api，content-type 为 application/json
2. 基于 [Socket.IO](https://socket.io/) 的 WebSocket 请求，用于实时数据更新

## 接口内容
1. 查询项目
  - 方式：GraphQL
  - 请求结构：
  ```
  query {
    project(_id: 项目ID, hash: 项目Hash 均可选) {
      _id  项目ID ID
      hash  项目对应Hash值，用于短链接 String
      projectName  项目名称 String
      code  代码 String
      createTime  创建时间 Float
      updateTime  更新时间 Float
      syntax  编程语言 String
      createUser  创建用户ID String
      lastModifiedUser  最后编辑用户ID String
      
    }
  }
  ```
2. 新建项目
  - 方式：GraphQL
  - 请求结构：
  ```
  mutation {
    createProject(
      projectName: 项目名称 String! 必填
      syntax: 编程语言 String! 必填
      userId: 当前操作用户ID String! 必填
    ) {
      success   操作是否成功 Boolean
      data  新建的项目内容，内容同查询项目 [Project]
    }
  }
  ```

3. 删除项目
  - 方式：GraphQL
  - 请求结构：
  ```
  mutation {
    removeProject (
      id: 项目ID String! 必填
    ) {
      result: 操作结果 Boolean
    }
  }
  ```

4. 客户端项目内容更新（项目名称/代码/编程语言）
  - 方式：Socket.IO
  - 事件：clientUpdateProjectInfo
  - 方向：客户端发起，服务端监听
  - 上传数据：
  ```
  {
    projectId: 项目ID String 必填
    projectName: 项目名称 String
    code: 代码 String
    syntax: 编程语言 String
    userId: 当前编辑用户ID String 必填
  }
  ```

5. 服务端项目内容同步至客户端
  - 方式：Socket.IO
  - 事件：serverProejctInfoSync
  - 方向：服务端发起，客户端监听
  - 下载数据：
  ```
  {
    projectId: 项目ID String 必填
    projectName: 项目名称 String
    code: 代码 String
    syntax: 编程语言 String
  }
 
  ```

6. 新建用户
  - 方式：GraphQL
  - 请求结构：
  ```
  mutation {
    createUser(
      userName: 用户名称 String! 必填
      avatar: 用户头像 String! 必填
    ) {
      success   操作是否成功 Boolean
      userId  返回用户ID String
    }
  }
  ```

7. 用户进入项目
  - 方式：Socket.IO
  - 事件：clientEnterProject
  - 方向：客户端发起，服务端监听
  - 上传数据：
  ```
  {
    projectId: 项目ID String 必填
    userId: 当前编辑用户ID String 必填
  }
  ```

