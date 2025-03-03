# 人才库智能查询系统 / Talent Database Smart Query System

## 项目简介 / Project Overview
这是我用来联系全栈开发的一个项目

这是一个基于自然语言处理的人才库查询系统。用户可以使用自然语言描述需求，系统会自动将其转换为 SQL 查询语句，并从人才库中检索相关信息。

This is a talent database query system based on natural language processing. Users can describe their requirements in natural language, and the system will automatically convert it into SQL queries to retrieve relevant information from the talent database.

## 项目结构 / Project Structure

```
people/
├── people/              # 前端项目 / Frontend Project
│   ├── src/            # 源代码 / Source code
│   ├── public/         # 静态资源 / Static assets
│   └── package.json    # 前端依赖配置 / Frontend dependencies
│
└── people_backend/     # 后端项目 / Backend Project
    ├── server.js       # 主服务器文件 / Main server file
    ├── mock_data.sql   # 数据库初始化脚本 / Database initialization script
    ├── candidates.db   # SQLite 数据库文件 / SQLite database file
    └── package.json    # 后端依赖配置 / Backend dependencies
```

## 技术栈 / Tech Stack

### 前端 / Frontend
- React 19
- Vite
- TypeScript
- ESLint

### 后端 / Backend
- Node.js + Express.js
- SQLite3 数据库 / SQLite3 Database
- CORS 支持 / CORS Support

## 数据库结构 / Database Schema

### 候选人表 (candidates)
| 字段 / Field | 类型 / Type | 描述 / Description |
|-------------|-------------|-------------------|
| id | INTEGER | 主键 / Primary Key |
| name | VARCHAR(100) | 姓名 / Name |
| experience | INTEGER | 工作经验（年）/ Work Experience (years) |
| self_introduction | TEXT | 自我介绍 / Self Introduction |
| skills | TEXT | 技能列表 / Skills List |
| job_preference | VARCHAR(20) | 工作偏好 / Job Preference |

## API 接口 / API Endpoints

### 查询候选人 / Query Candidates
- **URL**: `/people`
- **方法 / Method**: POST
- **请求体 / Request Body**:
  ```json
  {
    "requirement": "查询要求（自然语言）/ Query requirement (natural language)"
  }
  ```
- **响应 / Response**:
  ```json
  {
    "requirement": "原始查询要求 / Original requirement",
    "sql": "生成的SQL查询 / Generated SQL query",
  }
  ```

## 主要功能 / Key Features

- 自然语言转 SQL / Natural Language to SQL Conversion
  - 支持经验年限查询 / Support experience years query
  - 支持技能匹配 / Support skills matching
  - 支持工作类型筛选 / Support job type filtering
  - 支持按名字搜索 / Support name search
  - 支持职位级别筛选 / Support position level filtering

## 开发环境设置 / Development Setup

### 前端 / Frontend
```bash
cd people/people
npm install
npm run dev        # 开发模式 / Development mode
npm run build      # 构建生产版本 / Build for production
npm run preview    # 预览生产版本 / Preview production build
```

### 后端 / Backend
```bash
cd people/people_backend
npm install
node server.js     # 启动服务器 / Start server
```

## 环境要求 / Requirements

- Node.js >= 14.0.0
- SQLite3

## 配置说明 / Configuration

1. 前端配置 / Frontend Configuration
- 位于 `people/people/vite.config.js`
- 默认开发服务器端口：5173 / Default dev server port: 5173

2. 后端配置 / Backend Configuration
- 服务器端口：3000 / Server port: 3000
- 数据库文件：`candidates.db` / Database file: `candidates.db`

## 查询示例 / Query Examples

自然语言查询示例 / Natural language query examples:

- "查找有5年以上经验的前端开发者" / "Find frontend developers with more than 5 years of experience"
- "查找会使用 React 和 Node.js 的全栈工程师" / "Find full-stack engineers who know React and Node.js"
- "查找偏好兼职工作的开发者" / "Find developers who prefer part-time work"
- "查找经验最丰富的3位架构师" / "Find top 3 architects with most experience"

## 开发规范 / Development Guidelines

- 使用 ESLint 进行代码规范检查 / Use ESLint for code linting
- 遵循 RESTful API 设计规范 / Follow RESTful API design principles
- 使用参数化查询防止 SQL 注入 / Use parameterized queries to prevent SQL injection

## 贡献指南 / Contributing

欢迎提交 Pull Request 或创建 Issue。

Feel free to submit Pull Requests or create Issues.

## 许可证 / License

MIT

## 联系方式 / Contact

如有任何问题，请创建 Issue 或联系项目维护者。

For any questions, please create an Issue or contact the project maintainer. 
