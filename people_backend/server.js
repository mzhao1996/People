const path = require('path');
const app = require(path.join(__dirname, 'api', 'index.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});