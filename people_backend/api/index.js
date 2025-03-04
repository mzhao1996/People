require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();
const app = express();


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgazjhpkmetpsxlrukgr.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY
)


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

// Add synonym support
const synonyms = {
  gender: ['gender', 'sex', 'male', 'female'],
  education: ['education', 'degree', 'graduated', 'study', 'studied'],
  university: ['university', 'college', 'school', 'institute'],
  gpa: ['gpa', 'grade', 'score'],
  company: ['company', 'organization', 'firm', 'workplace'],
  nationality: ['nationality', 'citizen', 'citizenship'],
  location: ['address', 'location', 'city', 'country', 'live', 'living'],
  contact: ['contact', 'phone', 'email', 'reach'],
  graduate: ['graduate', 'graduated', 'graduation'],
  current: ['current', 'currently', 'now', 'present']
};

// Add degree levels
const degreeTypes = ['bachelor', 'master', 'phd', 'doctorate', 'undergraduate', 'postgraduate'];

// Add common majors
const majors = [
  'computer science', 'software engineering', 'information technology', 
  'electrical engineering', 'mechanical engineering', 'business administration',
  'finance', 'mathematics', 'physics', 'chemistry', 'biology'
];

async function searchCandidates(requirement) {
  const tokens = tokenizer.tokenize(requirement.toLowerCase());
  
  // Initialize query
  let query = supabase.from('jobseekers').select('*');
  
  // Extended entity recognition
  const entities = {
    age: null,
    experience: null,
    skills: [],
    education: null,
    position: null,
    comparison: null,
    gender: null,
    university: null,
    major: null,
    gpa: null,
    company: null,
    nationality: null,
    location: null,
    graduationYear: null,
    currentlyEmployed: false,
    contactInfo: null,
    name: null
  };
  
  // Analyze comparison words
  if (tokens.includes('less') || tokens.includes('under') || tokens.includes('below')) {
    entities.comparison = 'less';
  } else if (tokens.includes('more') || tokens.includes('over') || tokens.includes('above')) {
    entities.comparison = 'more';
  } else if (tokens.includes('equal') || tokens.includes('exactly')) {
    entities.comparison = 'equal';
  }
  
  // Extract numbers
  const numbers = tokens.filter(token => /\d+/.test(token));
  
  // Context analysis
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prevToken = tokens[i - 1];
    const nextToken = tokens[i + 1];
    
    // Gender analysis
    if (token === 'male' || token === 'female') {
      entities.gender = token;
    }
    
    // Name analysis
    if (token === 'named' || token === 'name') {
      let nameTokens = [];
      let j = i + 1;
      while (j < tokens.length && !/^(with|has|and|or)$/.test(tokens[j])) {
        nameTokens.push(tokens[j]);
        j++;
      }
      entities.name = nameTokens.join(' ');
    }
    
    // Education analysis
    if (degreeTypes.includes(token)) {
      entities.education = token;
    }
    
    // Major analysis
    majors.forEach(major => {
      if (requirement.toLowerCase().includes(major)) {
        entities.major = major;
      }
    });
    
    // GPA analysis
    if (token === 'gpa') {
      if (nextToken && /\d+(\.\d+)?/.test(nextToken)) {
        entities.gpa = parseFloat(nextToken);
      }
    }
    
    // Nationality analysis
    if (synonyms.nationality.includes(token) && nextToken) {
      entities.nationality = nextToken;
    }
    
    // Current employment status analysis
    if (synonyms.current.includes(token) && 
        (tokens.includes('working') || tokens.includes('employed'))) {
      entities.currentlyEmployed = true;
    }
    
    // Graduation year analysis
    if (synonyms.graduate.includes(token)) {
      const yearMatch = requirement.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        entities.graduationYear = parseInt(yearMatch[0]);
      }
    }
    
    // Age analysis
    if (token === 'age' || token === 'years' && nextToken === 'old') {
      entities.age = numbers[0];
    }
    
    // Experience analysis
    if (token === 'experience' || (token === 'years' && prevToken && /\d+/.test(prevToken))) {
      entities.experience = numbers[0];
    }
    
    // Skills analysis
    if (token === 'skill' || token === 'skills' || token === 'know') {
      let j = i + 1;
      while (j < tokens.length && !['in', 'with', 'and'].includes(tokens[j])) {
        if (!/^(the|a|an)$/.test(tokens[j])) {
          entities.skills.push(tokens[j]);
        }
        j++;
      }
    }
  }
  
  // Apply query conditions
  if (entities.gender) {
    query = query.eq('gender', entities.gender);
  }
  
  if (entities.name) {
    query = query.or(`first_name.ilike.%${entities.name}%,last_name.ilike.%${entities.name}%`);
  }
  
  if (entities.education) {
    query = query.ilike('degree', `%${entities.education}%`);
  }
  
  if (entities.major) {
    query = query.ilike('major', `%${entities.major}%`);
  }
  
  if (entities.gpa) {
    if (entities.comparison === 'less') {
      query = query.lt('gpa', entities.gpa);
    } else if (entities.comparison === 'more') {
      query = query.gt('gpa', entities.gpa);
    } else {
      query = query.gte('gpa', entities.gpa);
    }
  }
  
  if (entities.nationality) {
    query = query.ilike('nationality', `%${entities.nationality}%`);
  }
  
  if (entities.graduationYear) {
    const gradDate = new Date(entities.graduationYear, 11, 31).toISOString();
    query = query.lte('education_end_date', gradDate);
  }
  
  if (entities.currentlyEmployed) {
    query = query.is('work_end_date', null);
  }
  
  if (entities.age) {
    if (entities.comparison === 'less') {
      query = query.lte('age', parseInt(entities.age));
    } else if (entities.comparison === 'more') {
      query = query.gte('age', parseInt(entities.age));
    } else {
      query = query.eq('age', parseInt(entities.age));
    }
  }
  
  if (entities.experience) {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - parseInt(entities.experience));
    
    if (entities.comparison === 'less') {
      query = query.gt('work_start_date', cutoffDate.toISOString());
    } else {
      query = query.lte('work_start_date', cutoffDate.toISOString());
    }
  }
  
  if (entities.skills.length > 0) {
    entities.skills.forEach(skill => {
      query = query.or(`skills.ilike.%${skill}%,responsibilities.ilike.%${skill}%`);
    });
  }
  
  // Add sorting options
  const sortOptions = {
    'experience': 'work_start_date',
    'age': 'birth_date',
    'education': 'education_end_date',
    'gpa': 'gpa'
  };
  
  // Determine sort field
  let sortField = 'work_start_date'; // Default sort by work experience
  for (const [key, field] of Object.entries(sortOptions)) {
    if (tokens.includes(`sort by ${key}`) || tokens.includes(`order by ${key}`)) {
      sortField = field;
      break;
    }
  }
  
  // Determine sort direction
  const isAscending = tokens.includes('ascending') || tokens.includes('asc');
  query = query.order(sortField, { ascending: isAscending });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Supabase query error:', error);
    throw error;
  }
  
  return data;
}


app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});


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


module.exports = app; 
module.exports = app; 