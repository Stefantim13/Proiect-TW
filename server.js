const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

let sessions = {};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        const sessionId = new Date().getTime().toString();
        sessions[sessionId] = { username };
        res.json({ success: true, sessionId });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/logout', (req, res) => {
    const { sessionId } = req.body;
    delete sessions[sessionId];
    res.json({ success: true });
});

app.post('/submit-question', (req, res) => {
    const { name, age, email, question } = req.body;
    if (name && age && email && question) {
        res.json({ success: true, message: 'Question submitted' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid data' });
    }
});

app.use((req, res) => {
    res.status(404).send('404: Page not found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
