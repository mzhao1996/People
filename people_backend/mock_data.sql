-- Create the candidates table if it doesn't exist
CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100),
    experience INTEGER,
    self_introduction TEXT,
    skills TEXT,
    job_preference VARCHAR(20)
);

-- Insert mock data
INSERT INTO candidates (name, experience, self_introduction, skills, job_preference) VALUES
('Alex Thompson', 5, 'Passionate software developer with a focus on web technologies', 'JavaScript, React, Node.js, Python', 'full-time'),
('Sarah Chen', 3, 'Creative full-stack developer with strong problem-solving skills', 'Python, Django, PostgreSQL, AWS', 'full-time'),
('Michael Rodriguez', 7, 'Senior developer specialized in cloud architecture', 'AWS, Docker, Kubernetes, Java', 'full-time'),
('Emma Wilson', 2, 'Frontend developer with an eye for design', 'HTML, CSS, JavaScript, Vue.js', 'part-time'),
('James Lee', 4, 'Backend developer with expertise in microservices', 'Java, Spring Boot, MySQL, Redis', 'full-time'),
('David Miller', 6, 'DevOps engineer with strong automation skills', 'Jenkins, Terraform, Ansible, Python', 'full-time'),
('Lisa Wang', 8, 'Technical architect with extensive enterprise experience', 'Java, C++, System Design, Cloud Architecture', 'full-time'),
('Robert Taylor', 1, 'Junior developer eager to learn and grow', 'JavaScript, HTML, CSS, React', 'full-time'),
('Jennifer Park', 4, 'Mobile app developer with iOS expertise', 'Swift, Objective-C, Firebase', 'part-time'),
('William Brown', 5, 'Full-stack developer focused on scalable solutions', 'Node.js, MongoDB, React, TypeScript', 'full-time'),
('Grace Liu', 3, 'Data engineer with machine learning experience', 'Python, TensorFlow, SQL, Spark', 'full-time'),
('Daniel White', 6, 'Security specialist with cloud expertise', 'AWS Security, Python, Cryptography', 'full-time'),
('Sophie Anderson', 2, 'UX/UI developer with creative background', 'React, Figma, CSS, JavaScript', 'part-time'),
('Kevin Zhang', 4, 'Backend developer specialized in APIs', 'Go, REST APIs, GraphQL, PostgreSQL', 'full-time'),
('Rachel Green', 7, 'Senior frontend architect', 'Angular, TypeScript, Redux, WebGL', 'full-time'),
('Marcus Johnson', 5, 'Game developer with Unity expertise', 'C#, Unity3D, JavaScript, WebGL', 'full-time'),
('Nina Patel', 3, 'Cloud infrastructure engineer', 'AWS, Azure, GCP, Terraform', 'full-time'),
('Thomas Wilson', 6, 'Blockchain developer and enthusiast', 'Solidity, Web3.js, Ethereum, JavaScript', 'part-time'),
('Hannah Kim', 4, 'Quality assurance engineer', 'Selenium, Python, TestNG, Jenkins', 'full-time'),
('Carlos Martinez', 2, 'Frontend performance specialist', 'React, Redux, Webpack, Performance Optimization', 'full-time'),
('Olivia Chen', 7, 'Machine learning engineer', 'Python, TensorFlow, PyTorch, scikit-learn', 'full-time'),
('Ryan Cooper', 3, 'Mobile app developer', 'React Native, JavaScript, Firebase', 'part-time'),
('Michelle Lee', 5, 'Database administrator', 'MySQL, PostgreSQL, MongoDB, Redis', 'full-time'),
('Andrew Taylor', 4, 'DevSecOps engineer', 'Docker, Kubernetes, Security Tools', 'full-time'),
('Isabella Wong', 6, 'Systems architect', 'Java, Spring, Microservices, AWS', 'full-time'); 