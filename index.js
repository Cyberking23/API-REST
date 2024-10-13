import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return { books: [] }; // Devuelve un array vacío en caso de error
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
    } catch (error) {
        console.log(error);
    }
};

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    res.json(book);
});

app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length + 1,
        ...body,
    };
    data.books.push(newBook);
    writeData(data);
    res.status(201).json(newBook); // Devuelve un código 201 para creación
});

app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body,
    };
    
    writeData(data);
    res.json(data.books[bookIndex]); // Devuelve el libro actualizado
});

app.delete("/books/:id",(req,res)=>{
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book)=>book.id ===id)
    data.books.splice(bookIndex,1)
    writeData(data);
    res.json({message:"Book deleted succesfully"})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
