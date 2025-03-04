require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();

// 使用 Vercel 环境变量
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgazjhpkmetpsxlrukgr.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY
)

// Enable CORS for all routes
app.use(cors({
  origin: process.env.VERCEL_ENV === 'production' 
    ? ['https://people-hn5c.vercel.app'] 
    : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// 搜索函数
async function searchCandidates(requirement) {
  const cleanedReq = requirement.toString().toLowerCase().trim();
  let query = supabase.from('jobseekers').select('*');

  // 按年龄筛选
  if (cleanedReq.includes('age')) {
    const ageMatch = cleanedReq.match(/(\d+)\s*(?:years?\s+old|age)/);
    if (ageMatch) {
      if (cleanedReq.includes('less than')) {
        query = query.lte('age', parseInt(ageMatch[1]));
      } else if (cleanedReq.includes('more than') || cleanedReq.includes('over')) {
        query = query.gte('age', parseInt(ageMatch[1]));
      } else {
        query = query.eq('age', parseInt(ageMatch[1]));
      }
    }
  }

  // 按工作经验筛选（通过 work_start_date 计算）
  if (cleanedReq.includes('experience') || (cleanedReq.includes('year') && !cleanedReq.includes('years old'))) {
    const expMatch = cleanedReq.match(/(\d+)\s*(?:years?|experience)/);
    if (expMatch) {
      const yearsOfExperience = parseInt(expMatch[1]);
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsOfExperience);
      
      if (cleanedReq.includes('less than')) {
        query = query.gt('work_start_date', cutoffDate.toISOString());
      } else {
        query = query.lte('work_start_date', cutoffDate.toISOString());
      }
    }
  }

  // 按技能筛选
  if (cleanedReq.includes('skill') || cleanedReq.includes('know')) {
    const skillMatch = cleanedReq.match(/(?:skill|know)[s\s]+(?:in|with|of)?\s+([a-zA-Z\+\#\.]+)/);
    if (skillMatch) {
      const skill = skillMatch[1].toLowerCase();
      query = query.ilike('skills', `%${skill}%`);
    }
  } else {
    const techKeywords = ['java', 'python', 'javascript', 'nodejs', 'react', 'angular', 'vue', 'c++', 'ruby', 'php', 'aws', 'docker', 'kubernetes', 'devops'];
    for (const keyword of techKeywords) {
      if (cleanedReq.includes(keyword)) {
        query = query.or(`skills.ilike.%${keyword}%,responsibilities.ilike.%${keyword}%`);
        break;
      }
    }
  }

  // 按姓名筛选
  if (cleanedReq.includes('named') || cleanedReq.includes('name is')) {
    const nameMatch = cleanedReq.match(/(?:named|name is)\s+([a-zA-Z]+)/);
    if (nameMatch) {
      const name = nameMatch[1].toLowerCase();
      query = query.or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`);
    }
  }

  // 按学历筛选
  const educationKeywords = ['bachelor', 'master', 'phd', 'doctorate'];
  for (const keyword of educationKeywords) {
    if (cleanedReq.includes(keyword)) {
      query = query.ilike('degree', `%${keyword}%`);
      break;
    }
  }

  // 按专业筛选
  const majorKeywords = ['computer science', 'engineering', 'business', 'mathematics', 'physics'];
  for (const keyword of majorKeywords) {
    if (cleanedReq.includes(keyword)) {
      query = query.ilike('major', `%${keyword}%`);
      break;
    }
  }

  // 按国籍筛选
  if (cleanedReq.includes('nationality')) {
    const nationalityMatch = cleanedReq.match(/nationality\s+(?:is\s+)?([a-zA-Z]+)/);
    if (nationalityMatch) {
      query = query.ilike('nationality', `%${nationalityMatch[1]}%`);
    }
  }

  // 按工作职位筛选
  const positionKeywords = ['engineer', 'developer', 'manager', 'architect', 'designer'];
  for (const keyword of positionKeywords) {
    if (cleanedReq.includes(keyword)) {
      query = query.ilike('position', `%${keyword}%`);
      break;
    }
  }

  // 默认按工作开始日期排序（经验）
  query = query.order('work_start_date', { ascending: cleanedReq.includes('ascending') });

  const { data, error } = await query;
  
  if (error) {
    console.error('Supabase query error:', error);
    throw error;
  }

  return data;
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Search endpoint
app.post('/people', async (req, res) => {
  try {
    const { requirement } = req.body;
    //console.log('rawRequirement:', requirement);
    const results = await searchCandidates(requirement);
    res.json({ 
      requirement: requirement,
      results: results
    });
    //console.log('results:', results);
  } catch (error) {
    console.error('server error:', error);
    res.status(500).json({ error: error.message || 'server side error' });
  }
});

// Export the Express API
module.exports = app; 