const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // '.verbose()' adds more detailed logging to the console, which is helpful for debugging.
const cors = require('cors'); // crucial for frontend running on different adress.

const app = express();
const port = 5000;

// --- Middleware Setup (Filters that requests or responses passes before reaching their destination) ---

app.use(cors());
app.use(express.json());

// --- Database Setup ---

const db = new sqlite3.Database('./searches.db', (e) => { // Opens or Create the Database file
    if(e) {
        console.log(e);
        console.error('Error opening database:', e.message);
    } else {
        console.log('Connected to the SQLite database: searches.db');

        // Executes a SQL command that doesn't return rows (like CREATE TABLE, INSERT, UPDATE, DELETE)
        db.run(` 
        CREATE TABLE IF NOT EXISTS search_counts (
            anime_id TEXT PRIMARY KEY,
            title TEXT,
            poster_url TEXT,
            search_count INTEGER DEFAULT 0
        )
        `, (err) => {
            if (err) {
                console.log(err);
                console.error('Error creating table:', err.message);
            } else {
                console.log('Database table "search_counts" is ready.');
            }
        });
    }
});

// --- API Endpoints ---

app.post('/api/track-search', (req, res) => { // app.post responds to POST requests
    const { anime_id, title, poster_url } = req.body; // req.body holds the JSON data sent thanks to express.json() middleware
    if (!anime_id) return res.status(400).json({ error: 'anime_id is required in the request body.' });
    if (!title) return res.status(400).json({ error: 'title is required in the request body.' });
    if (!poster_url) return res.status(400).json({ error: 'poster_url is required in the request body.' });

    const sql = `
        INSERT INTO search_counts (anime_id, title, poster_url, search_count)
        VALUES (?, ?, ?, 1)
        ON CONFLICT(anime_id) DO UPDATE SET search_count = search_count + 1;
    `;

    db.run(sql, [anime_id, title, poster_url], (e) => {
        if (e) {
            console.log(e)
            console.error('Error updating search count:', e.message);
            return res.status(500).json({ error: 'Failed to update search count in database.' });
        }
        console.log(`Search count updated for anime ID: ${anime_id}. Rows affected: ${this.changes}`);
        res.status(200).json({ message: 'Search count updated successfully.' });
    });
});

app.get('/api/most-searched', (req, res) => { // app.get responds to GET requests
    const limit = parseInt(req.query.limit) || 10;

    const sql = `
        SELECT anime_id, title, poster_url, search_count
        FROM search_counts
        ORDER BY search_count DESC
        LIMIT ?;
    `;

    // Used for SELECT queries that returns multiple rows
    db.all(sql, [limit], (e, rows) => {
        if (e) {
            console.log(e)
            console.error('Error retrieving most searched:', e.message);
            return res.status(500).json({ error: 'Failed to retrieve most searched from database.' });
        }
        res.json(rows); // Each row will be an object like { anime_id: '...', search_count: N }.
    });
});

// --- Start the Server --- 

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    console.log(`You can test the GET endpoint by visiting: http://localhost:${port}/api/most-searched`);
});