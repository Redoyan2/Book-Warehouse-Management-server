const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


// use middleware

app.use(cors());
app.use(express.json());

// mongo database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntcev.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
    await client.connect();
    const bookCollection = client.db('book-management').collection('books-list');
    
    app.get('/book', async(req, res)=>{
      const query = {};
     const cursor = bookCollection.find(query);
     const books = await cursor.toArray();
     res.send(books);
    } )
    app.get('/book/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const book = await bookCollection.findOne(query);
      res.send(book);
    })
    //post data
    app.post('/book', async(req,res)=>{
      const newBook = req.body;
       const insertBook = await bookCollection.insertOne(newBook);
       res.send(insertBook);
    })

  }
  finally{

  }
}
run().catch(console.dir);



//listen path
app.get('/', (req, res) => {
    res.send('Running books house')
})

app.listen(port, ()=>{
    console.log("Listening to port", port)
});
