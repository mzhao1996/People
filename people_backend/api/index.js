const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const DB_PATH = path.join('/tmp', 'candidates.db');

// Enable CORS for all routes
app.use(cors({
  origin: process.env.VERCEL_ENV === 'production' 
    ? ['https://people-frontend.vercel.app'] 
    : '*'
}));

app.use(express.json());

// Initialize database
function initializeDatabase() {
  // Copy mock data to tmp directory in Vercel
  const initSQL = fs.readFileSync(path.join(__dirname, '../mock_data.sql'), 'utf8');
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Database connection error:', err.message);
        reject(err);
        return;
      }
      
      db.exec(initSQL, (err) => {
        if (err) {
          console.error('Database initialization error:', err.message);
          reject(err);
          return;
        }
        console.log('Database initialized successfully');
        resolve(db);
      });
    });
  });
}

// Convert requirements to SQL query
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

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Search endpoint
app.post('/people', async (req, res) => {
    try {
        const { requirement } = req.body;
        console.log('rawRequirement:', requirement);
        const sqlQuery = convertToSQL(requirement);
        
        const db = await initializeDatabase();
        
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
            
            // Close database connection
            db.close();
        });
    } catch (error) {
        console.error('server error:', error);
        res.status(500).json({ error: error.message || 'server side error' });
    }
});

// Export the Express API
module.exports = app; 