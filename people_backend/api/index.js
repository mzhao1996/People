const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.VERCEL_ENV === 'production' 
    ? ['https://people-hn5c.vercel.app'] 
    : '*'
}));

app.use(express.json());

// Mock data
const CANDIDATES = [
  {
    name: 'Alex Thompson',
    experience: 5,
    introduction: 'Passionate software developer with a focus on web technologies',
    skills: 'JavaScript, React, Node.js, Python',
    job_preference: 'full-time'
  },
  {
    name: 'Sarah Chen',
    experience: 3,
    introduction: 'Creative full-stack developer with strong problem-solving skills',
    skills: 'Python, Django, PostgreSQL, AWS',
    job_preference: 'full-time'
  },
  {
    name: 'Michael Rodriguez',
    experience: 7,
    introduction: 'Senior developer specialized in cloud architecture',
    skills: 'AWS, Docker, Kubernetes, Java',
    job_preference: 'full-time'
  },
  {
    name: 'Emma Wilson',
    experience: 2,
    introduction: 'Frontend developer with an eye for design',
    skills: 'HTML, CSS, JavaScript, Vue.js',
    job_preference: 'part-time'
  },
  {
    name: 'James Lee',
    experience: 4,
    introduction: 'Backend developer with expertise in microservices',
    skills: 'Java, Spring Boot, MySQL, Redis',
    job_preference: 'full-time'
  },
  {
    name: 'David Miller',
    experience: 6,
    introduction: 'DevOps engineer with strong automation skills',
    skills: 'Jenkins, Terraform, Ansible, Python',
    job_preference: 'full-time'
  },
  {
    name: 'Lisa Wang',
    experience: 8,
    introduction: 'Technical architect with extensive enterprise experience',
    skills: 'Java, C++, System Design, Cloud Architecture',
    job_preference: 'full-time'
  },
  {
    name: 'Robert Taylor',
    experience: 1,
    introduction: 'Junior developer eager to learn and grow',
    skills: 'JavaScript, HTML, CSS, React',
    job_preference: 'full-time'
  },
  {
    name: 'Jennifer Park',
    experience: 4,
    introduction: 'Mobile app developer with iOS expertise',
    skills: 'Swift, Objective-C, Firebase',
    job_preference: 'part-time'
  },
  {
    name: 'William Brown',
    experience: 5,
    introduction: 'Full-stack developer focused on scalable solutions',
    skills: 'Node.js, MongoDB, React, TypeScript',
    job_preference: 'full-time'
  }
];

// Search function
function searchCandidates(requirement) {
  const cleanedReq = requirement.toString().toLowerCase().trim();
  let results = [...CANDIDATES];

  // Filter by experience
  if (cleanedReq.includes('experience') || cleanedReq.includes('years') || cleanedReq.includes('year')) {
    if (cleanedReq.includes('less than')) {
      const expMatch = cleanedReq.match(/(\d+)\s*(?:years?|experience)/);
      if (expMatch) {
        results = results.filter(candidate => candidate.experience <= parseInt(expMatch[1]));
      }
    } else {
      const expMatch = cleanedReq.match(/(\d+)[\+]?\s*(?:years?|experience)/);
      if (expMatch) {
        results = results.filter(candidate => candidate.experience >= parseInt(expMatch[1]));
      }
    }
  }

  // Filter by skills
  if (cleanedReq.includes('skill') || cleanedReq.includes('know')) {
    const skillMatch = cleanedReq.match(/(?:skill|know)[s\s]+(?:in|with|of)?\s+([a-zA-Z\+\#\.]+)/);
    if (skillMatch) {
      const skill = skillMatch[1].toLowerCase();
      results = results.filter(candidate => 
        candidate.skills.toLowerCase().includes(skill)
      );
    }
  } else {
    const techKeywords = ['java', 'python', 'javascript', 'nodejs', 'react', 'angular', 'vue', 'c++', 'ruby', 'php', 'aws', 'docker', 'kubernetes', 'devops'];
    for (const keyword of techKeywords) {
      if (cleanedReq.includes(keyword)) {
        results = results.filter(candidate => 
          candidate.skills.toLowerCase().includes(keyword) || 
          candidate.introduction.toLowerCase().includes(keyword)
        );
      }
    }
  }

  // Filter by job preference
  if (cleanedReq.includes('full-time') || cleanedReq.includes('full time')) {
    results = results.filter(candidate => candidate.job_preference === 'full-time');
  } else if (cleanedReq.includes('part-time') || cleanedReq.includes('part time')) {
    results = results.filter(candidate => candidate.job_preference === 'part-time');
  }

  // Filter by name
  if (cleanedReq.includes('named') || cleanedReq.includes('name is')) {
    const nameMatch = cleanedReq.match(/(?:named|name is)\s+([a-zA-Z]+)/);
    if (nameMatch) {
      const name = nameMatch[1].toLowerCase();
      results = results.filter(candidate => 
        candidate.name.toLowerCase().includes(name)
      );
    }
  }

  // Filter by background keywords
  const backgroundKeywords = ['architect', 'senior', 'junior', 'lead', 'frontend', 'backend', 'full-stack', 'mobile'];
  for (const keyword of backgroundKeywords) {
    if (cleanedReq.includes(keyword)) {
      results = results.filter(candidate => 
        candidate.introduction.toLowerCase().includes(keyword)
      );
    }
  }

  // Sort by experience (default descending)
  if (!cleanedReq.includes('ascending') && !cleanedReq.includes('asc')) {
    results.sort((a, b) => b.experience - a.experience);
  } else {
    results.sort((a, b) => a.experience - b.experience);
  }

  return results;
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Search endpoint
app.post('/people', (req, res) => {
  try {
    const { requirement } = req.body;
    console.log('rawRequirement:', requirement);
    
    const results = searchCandidates(requirement);
    
    res.json({ 
      requirement: requirement,
      results: results
    });
  } catch (error) {
    console.error('server error:', error);
    res.status(500).json({ error: error.message || 'server side error' });
  }
});

// Export the Express API
module.exports = app; 