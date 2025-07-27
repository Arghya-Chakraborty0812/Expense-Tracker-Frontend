import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://arghya0812:Argfoo%23120922@cluster0.jysdx.mongodb.net/loginMERN_1'
, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDb connected'))
  .catch((err) => console.log('Connection error: ', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Expense Schema and Model
const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});
const Expense = mongoose.model('Expense', expenseSchema);

// JWT Authentication Middleware
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret');
      req.userId = decoded._id;  // Corrected line to use _id instead of username
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
  

// Routes
app.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Check both email and username for uniqueness
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Sign up Successful' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Error during signup', error: err.message });
  }
});



app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    // if(typeof req.body.username !== 'string' || req.body.password !== 'string'){
    //   return res.status(403).json({message : 'Invalid Credentials'});
    // }
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(403).json({ message: 'Invalid Credentials' });
    }
    const token = jwt.sign({ _id: user._id, username: user.username }, 'secret', { expiresIn: '1h' });
    return res.status(200).json({ message: 'Authentication Successful', token });
  });
  

// Add Expense
app.post('/expenses/add', authenticate, async (req, res) => {
    const { date, category, description, amount } = req.body;
    const expense = new Expense({
      userId: req.userId,  // This should now be the correct MongoDB _id
      date,
      category,
      description,
      amount,
    });
    await expense.save();
    res.status(201).json({ message: 'Expense saved' });
  });
  

// Get Expenses
app.get('/expenses', authenticate, async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId });
  res.json(expenses);
});

//Delete Expense
app.delete('/expenses/:id', async(req, res) => {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    try{
        if(!deleted)
            res.status(404).json({message : 'Expense not found'});
        res.status(200).json({message : 'Expense deleted successfully'})
    }
    catch(err){
        res.status(500).json({message : 'Server error'});
    }
})
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
