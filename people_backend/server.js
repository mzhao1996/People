const express = require('express');
const cors = require('cors');//only for testing in local
const sqlite3 = require('sqlite3').verbose();
const app = express();

const PORT = 3000;
const DB_PATH = './candidates.db';

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Read and execute initialization SQL file
        const fs = require('fs');
        const initSQL = fs.readFileSync('./mock_data.sql', 'utf8');
        db.exec(initSQL, (err) => {
            if (err) {
                console.error('Database initialization error:', err.message);
            } else {
                console.log('Database initialized successfully');
            }
        });
    }
});

//only for testing in local
app.use(cors());

app.use(express.json());
app.get('/', (req, res) => {
    res.send('server is running');
});

//convert the requirement to sql query, use this style to avoid the sql injection
function convertToSQL(requirement) {
    const cleanedReq = requirement.toString().toLowerCase().trim();
    const defaultFields = [
        'name',
        'experience',
        'self_introduction as introduction',
        'skills',
        'job_preference'
    ];
    let sql = `SELECT ${defaultFields.join(', ')} FROM candidates`;

    const conditions = [];
    
    if (cleanedReq.includes('experience') || cleanedReq.includes('years') || cleanedReq.includes('year')) {
        if (cleanedReq.includes('less than')) {
            const expMatch = cleanedReq.match(/(\d+)\s*(?:years?|experience)/);
            if (expMatch) {
                conditions.push(`experience <= ${expMatch[1]}`);
            }
        } else {
            const expMatch = cleanedReq.match(/(\d+)[\+]?\s*(?:years?|experience)/);
            if (expMatch) {
                conditions.push(`experience >= ${expMatch[1]}`);
            }
        }
    }
  
    if (cleanedReq.includes('skill') || cleanedReq.includes('know')) {
        const skillMatch = cleanedReq.match(/(?:skill|know)[s\s]+(?:in|with|of)?\s+([a-zA-Z\+\#\.]+)/);
        if (skillMatch) {
            conditions.push(`skills LIKE '%${skillMatch[1]}%'`);
        }
    } else {
    
        const techKeywords = ['java', 'python', 'javascript', 'nodejs', 'react', 'angular', 'vue', 'c++', 'ruby', 'php', 'aws', 'docker', 'kubernetes', 'devops'];
        for (const keyword of techKeywords) {
            if (cleanedReq.includes(keyword)) {
                conditions.push(`(skills LIKE '%${keyword}%' OR self_introduction LIKE '%${keyword}%')`);
            }
        }
    }
   
    if (cleanedReq.includes('full-time') || cleanedReq.includes('full time')) {
        conditions.push(`job_preference = 'full-time'`);
    } else if (cleanedReq.includes('part-time') || cleanedReq.includes('part time')) {
        conditions.push(`job_preference = 'part-time'`);
    }
    
    if (cleanedReq.includes('named') || cleanedReq.includes('name is')) {
        const nameMatch = cleanedReq.match(/(?:named|name is)\s+([a-zA-Z]+)/);
        if (nameMatch) {
            conditions.push(`name LIKE '%${nameMatch[1]}%'`);
        }
    }
    
    const backgroundKeywords = ['architect', 'senior', 'junior', 'lead', 'frontend', 'backend', 'full-stack', 'mobile'];
    for (const keyword of backgroundKeywords) {
        if (cleanedReq.includes(keyword)) {
            conditions.push(`self_introduction LIKE '%${keyword}%'`);
        }
    }
    
    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Add default sorting by experience in descending order if no specific order is specified
    if (!cleanedReq.includes('order by experience') && !cleanedReq.includes('sort by experience')) {
        sql += ' ORDER BY experience DESC';
    } else {
        sql += cleanedReq.includes('descending') || cleanedReq.includes('desc') ? 
            ' ORDER BY experience DESC' : 
            ' ORDER BY experience ASC';
    }
    
    const limitMatch = cleanedReq.match(/(?:first|top)\s*(\d+)/);
    if (limitMatch) {
        sql += ` LIMIT ${limitMatch[1]}`;
    }
    
    return sql;
}

app.post('/people', (req, res) => {
    try {
        const { requirement } = req.body;
        console.log('rawRequirement:', requirement);
        const sqlQuery = convertToSQL(requirement);
        
        // Execute SQL query
        db.all(sqlQuery, [], (err, rows) => {
            if (err) {
                console.error('Query error:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ 
                requirement: requirement,
                sql: sqlQuery,
                results: rows
            });
            console.log('sqlQuery:', sqlQuery);
        });
    } catch (error) {
        console.error('server error:', error);
        res.status(500).json({ error: error.message || 'server side error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Close database connection when application shuts down
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});