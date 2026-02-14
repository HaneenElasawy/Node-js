const express = require('express');
const todos = require('./todos')

const app = express();
app.use(express.json())

app.use(express.static('public'))

app.set('view engine', 'pug')


app.get('/todos', (req, res, next) => {
  console.log(Date.now())
  req.hamada = 'Ahmed'
  next()
} , (req, res, next) => {
  console.log(req.query)
  res.status(201).json(todos)
  next()
}, (req, res) => {
  console.log(Date.now())
});

app.get('/todos/:id', (req, res) => {
  console.log(req.params);
  res.json(todos)
})

app.post('/todos', (req, res) => {
 res.json(req.body)
});

app.get('/hello', (req, res) => {
  res.render('index', { title: 'Hey OSAD', message: 'Hello there ITI!', todos })
})

app.use((req, res) => {
  res.sendStatus(404)
});


app.listen(5005, () => {
  console.log('App is up and running on: http://127.0.0.1:5005')
})