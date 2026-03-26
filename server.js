const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ no need for body-parser

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// Create table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        rollno TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Table creation error:', err.message);
    } else {
        console.log('✅ Users table ready');
    }
});

// API route
app.post('/submit', (req, res) => {
    const { name, email, rollno } = req.body;

    if (!name || !email || !rollno) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
        INSERT INTO users (name, email, rollno)
        VALUES (?, ?, ?)
    `;

    db.run(query, [name, email, rollno], function(err) {
        if (err) {
            console.error('Insert error:', err.message);
            return res.status(500).json({ error: 'Error saving data' });
        }

        res.json({
            message: '✅ Data saved successfully',
            id: this.lastID
        });
    });
});

// Test route
app.get('/', (req, res) => {
    res.send('Server is working 🚀');
});

// Start server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
    
