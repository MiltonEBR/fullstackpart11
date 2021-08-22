const express = require('express')

const morgan = require('morgan')

const app = express()

const cors = require('cors')

require('dotenv').config()

const Person = require('./models/Person')

app.use(express.static('build'))
app.use(cors())

app.use(express.json())
morgan.token('body', (req) => (
  req.body.name && req.body.number
    ? `{name: ${req.body.name}, number:${req.body.number}}`
    : ''
))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = [
//   { id: 1, name: 'Arto Hellas', number: '040-123456' },
//   { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
//   { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
//   { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
// ]

app.get('/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    const currDate = new Date()
    res.send(`<div>
    <h3>Phonebook has info for ${persons.length} people</h3>
    <p>${currDate}</p>
  </div>`)
  })
})

app.get('/persons/:id', (req, res, next) => {
  const { id } = req.params
  // const person = persons.find((person) => person.id === parseInt(id))
  Person.findById(id)
    .then((person) => {
      person ? res.json(person) : res.status(404).end() // eslint-disable-line no-unused-expressions
    })
    .catch((err) => {
      next(err)
    })
})

app.post('/persons', (req, res, next) => {
  const { body } = req
  // if (!body.name || !body.number) {
  //   return res.status(400).json({
  //     error: 'Name or number missing',
  //   })
  // }
  // // else if (persons.some((person) => person.name === body.name)) {
  // //   return res.status(400).json({
  // //     error: 'Name must be unique',
  // //   })
  // // }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((err) => next(err))
})

app.put('/persons/:id', (req, res, next) => {
  const { id } = req.params
  const { body } = req

  const person = { name: body.name, number: body.number }
  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

const errorHandler = (error, request, response, next) => { // eslint-disable-line consistent-return
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // eslint-disable-line no-else-return
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

module.exports = app

// const PORT = process.env.PORT
// app.listen(PORT, () => {
//   console.log(`Server running at port ${PORT}`)
// })
