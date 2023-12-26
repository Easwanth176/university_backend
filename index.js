import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import Student from './src/models/Student.js';
import Query from './src/models/Query.js';
import Message from './src/models/Message.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const dbURI = 'mongodb+srv://easwanth123:AbYIaNzfzyeXEyaF@cluster0.bkvrbcv.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB:', mongoose.connection.name);
});

app.post('/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { userType, identifier, password } = req.body;

  try {
    const user = await Student.findOne({
      $or: [{ Number: identifier }, { Email: identifier }],
      Password: password,
    });

    if (user) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid registrationNumber, email, or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/submitQuery', async (req, res) => {
  const { Name, Regarding, Description, contact } = req.body;

  try {
    const newQuery = new Query({
      Name,
      Regarding,
      Description,
      contact,
    });

    await newQuery.save();

    res.status(201).json({ message: 'Query submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/unresolvedQueries', async (req, res) => {
  try {
    const unresolvedQueries = await Query.find({ isResolved: false });
    res.status(200).json(unresolvedQueries);
  } catch (error) {
    console.error('Error fetching unresolved queries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/submitSolution/:id', async (req, res) => {
  const { id } = req.params;
  const { solution } = req.body;

  try {
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { solution, isResolved: true },
      { new: true }
    );

    if (updatedQuery) {
      console.log('Solution submitted successfully');
      res.status(200).json({ message: 'Solution submitted successfully' });
    } else {
      console.error('Query not found');
      res.status(404).json({ error: 'Query not found' });
    }
  } catch (error) {
    console.error('Error during solution submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/solvedQueries', async (req, res) => {
  try {
    const solvedQueries = await Query.find({ isResolved: true });
    res.status(200).json(solvedQueries);
  } catch (error) {
    console.error('Error fetching solved queries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/messages/add', async (req, res) => {
  try {
    const { message } = req.body;
    const newMessage = new Message({ Message: message });
    await newMessage.save();
    res.json({ message: 'Message added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/messages/all', async (req, res) => {
  try {
    const messages = await Message.find(); // Retrieve all messages from the database
    res.json(messages); // Send a JSON response with the messages
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' }); // Handle errors with a 500 response
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

