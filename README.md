# Talent Database Smart Query System

## Project Overview
A talent database query system based on natural language processing. Users can describe their requirements in natural language, and the system will automatically analyze the query and retrieve relevant information from the talent database using advanced NLP techniques.

## Project Structure

```
People/
├── People/              # Root directory
│   ├── people/         # Frontend Project
│   │   ├── src/       # Source code
│   │   ├── public/    # Static assets
│   │   └── package.json
│   │
│   └── people_backend/ # Backend Project
│       ├── api/       # API handlers
│       │   └── index.js
│       ├── server.js  # Server entry point
│       └── package.json
```

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- ESLint
- Tailwind CSS

### Backend
- Node.js + Express.js
- Supabase (Database)
- Natural (NLP Processing)
- CORS Support
- dotenv for configuration

## Database Schema

### Jobseekers Table
| Field | Type | Description |
|-------------|-------------|-------------------|
| first_name | TEXT | First Name |
| last_name | TEXT | Last Name |
| gender | TEXT | Gender |
| age | INTEGER | Age |
| birth_date | TIMESTAMP | Date of Birth |
| nationality | TEXT | Nationality |
| phone | TEXT | Phone Number |
| email | TEXT | Email Address |
| address | TEXT | Address |
| degree | TEXT | Education Degree |
| university | TEXT | University Name |
| major | TEXT | Field of Study |
| education_start_date | TIMESTAMP | Education Start Date |
| education_end_date | TIMESTAMP | Education End Date |
| gpa | FLOAT | Grade Point Average |
| company | TEXT | Company Name |
| position | TEXT | Job Position |
| work_start_date | TIMESTAMP | Work Start Date |
| work_end_date | TIMESTAMP | Work End Date |
| responsibilities | TEXT | Job Responsibilities |
| skills | TEXT | Technical Skills |

## API Endpoints

### Health Check
- **URL**: `/`
- **Method**: GET
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "API is running"
  }
  ```

### Query Candidates
- **URL**: `/people`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "requirement": "Natural language query"
  }
  ```
- **Response**:
  ```json
  {
    "requirement": "Original query",
    "results": [
      {
        "first_name": "John",
        "last_name": "Doe",
        ...
      }
    ]
  }
  ```

## Key Features

### Natural Language Processing
- Advanced entity recognition
- Contextual analysis
- Synonym support for multiple fields:
  - Gender terms
  - Education related terms
  - Company related terms
  - Location terms
  - Contact information
  - Current status terms

### Query Capabilities
- Personal Information
  - Name search
  - Age filtering
  - Gender filtering
  - Nationality search
  
- Educational Background
  - Degree level filtering (bachelor, master, phd, etc.)
  - Major/field of study search
  - GPA filtering
  - Graduation year search
  
- Professional Experience
  - Years of experience calculation
  - Skills matching
  - Current employment status
  - Company search
  
- Advanced Features
  - Multiple criteria combination
  - Comparison operators (less than, more than, equal)
  - Custom sorting by:
    - Experience
    - Age
    - Education
    - GPA
  - Natural language date processing

### Query Examples

Natural language query examples:

- "Find female developers with more than 5 years of experience"
- "Search for candidates with a master's degree in computer science"
- "Look for currently employed engineers with GPA above 3.5"
- "Find developers who graduated after 2020 with React and Node.js skills"
- "Search for candidates with experience at Google or Microsoft"

## Development Setup

### Frontend
```bash
cd People/People/people
npm install
npm run dev        # Development mode
npm run build      # Build for production
npm run preview    # Preview production build
```

### Backend
```bash
cd People/People/people_backend
npm install
node server.js     # Start server
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
VERCEL_ENV=development
```

## Requirements

- Node.js >= 14.0.0
- npm or yarn

## Configuration

### Frontend
- Development server port: Default to Vite's standard port (5173)
- Build output directory: `dist/`

### Backend
- Server port: 3000 (configurable)
- CORS: Enabled for all origins in development, restricted in production
- Supabase connection: Configured via environment variables

## Contributing

Feel free to submit Pull Requests or create Issues.

## License

MIT

## Contact

For any questions, please create an Issue or contact the project maintainer. 
