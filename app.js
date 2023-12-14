const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/vikram');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
// Create Student Schema
const contactSchema = new mongoose.Schema({
  name : String,
  mobile: String,
  email: String,
  feedback: String,
   
});
const studentSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  address: String,
  dob: Date,
  roomType: String,
  foodPreference: String,
  username: String,
  password: String,
});
 

const Student = mongoose.model('Student', studentSchema);
const contact = mongoose.model('contact',contactSchema);
 


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
function authenticateUser(username, password) {
  if (username== "username" && password=="password") {
    return true
  } else {
    return false
  }
  
}
// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/studentLogin', (req, res) => {
  res.render('studentLogin');
});

app.post('/studentLogin', async (req, res) => {
  const { username, password } = req.body;

  // Check student credentials
  const student = await Student.findOne({ username, password });

  if (student) {
    res.render('profile', { student });
  } else {
    res.send('Invalid credentials');
  }
});
app.get('/studentdetail', async (req, res) => {
  try {
    const students = await Student.find({});
    res.render('studentdetail' ,{students});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/employeeLogin', (req, res) => {
  res.render('employeeLogin');
});
 
app.post('/employeeLogin', (req, res) => {
  const { username, password } = req.body;

  // Perform authentication logic (replace this with your actual authentication code)
  const isAuthenticated = authenticateUser(username, password);

  if (isAuthenticated) {
    res.redirect('/studentdetail');;
  } else {
    res.json({ message: 'Login failed' });
  }
});
 
app.get('/createAccount', (req, res) => {
  res.render('createAccount');
});

app.post('/createAccount', async (req, res) => {
  const {
    name, mobile, address, dob, roomType, foodPreference, username, password,
  } = req.body;

  try {
    await Student.create({
      name, mobile, address, dob, roomType, foodPreference, username, password,
    });
    res.redirect('/studentLogin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/contact', (req, res) => {
  res.render('contact');
});
app.post('/contact',(req,res)=>{
  var mydata = new contact(req.body);
  mydata.save().then(()=>{
      res.send("Thank you for reaching out! We have received your message and will get back to you as soon as possible.")
  }).catch(error => {
    console.error('Error saving data:', error);
    res.status(500).send('Internal Server Error');
}); 
  
  
})
app.get('/profile', (req, res) => {
    // Assuming you have a user object with user details
    const user = {
      name: 'John Doe',
      mobile: '1234567890',
      address: '123 Street, City',
      dob: '1990-01-01',
      roomType: 'Single',
      foodPreference: 'Vegetarian',
      username: 'john.doe',
      // Add other user details as needed
    };
  
    res.render('profile', { user });
  });
  app.get('/profile/:id', async (req, res) => {
    const employee = await Student.findById(req.params.id);
    res.render('profile', { Student });
  });
  
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
