const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Use express.json() middleware to parse request bodies
app.use(express.json());

// Mock database (books array)
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 }
];

// Root route (Welcome message)
app.get('/', (req, res) => {
    res.send('Welcome to the Book CRUD API! Go to /books to see the list.');
});

// GET /books - Retrieve all books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET /books/:id - Retrieve a single book by ID
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
});

// POST /books - Create a new book
app.post('/books', (req, res) => {
    const { title, author, year } = req.body;
    
    // Basic validation
    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required fields.' });
    }

    const newBook = {
        id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
        title,
        author,
        year: year || new Date().getFullYear()
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /books/:id - Update an existing book
app.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author, year } = req.body;

    // Validation
    if (!title && !author && !year) {
        return res.status(400).json({ error: 'At least one field (title, author, year) must be provided for update.' });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (year) book.year = year;

    res.json(book);
});

// DELETE /books/:id - Delete a book
app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully', deletedBook: deletedBook[0] });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});