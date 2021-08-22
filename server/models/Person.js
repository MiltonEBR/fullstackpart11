const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config()

// const name = process.argv[2] || null
// const number = process.argv[3] || null

const url = process.env.MONGODB_URI

console.log('Connecting to', url)

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Could not connect to MongoDB', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String, minlength: 3, required: true, unique: true,
  },
  number: {
    type: String, minlength: 8, required: true,
  },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // eslint-disable-line no-param-reassign, no-underscore-dangle
    delete returnedObject._id // eslint-disable-line no-param-reassign, no-underscore-dangle
    delete returnedObject.__v // eslint-disable-line no-param-reassign, no-underscore-dangle
  },
})

// const Person = mongoose.model('Person', personSchema)

// if (name && number) {
//   const person = new Person({
//     name,
//     number,
//   })

//   person.save().then((res) => {
//     console.log(`${name} number: ${number} added!`)
//     mongoose.connection.close()
//   })
// } else {
//   Person.find({}).then((res) => {
//     console.log('Phonebook')
//     res.forEach((person) => {
//       console.log(`${person.name} ${person.number}`)
//     })
//     mongoose.connection.close()
//   })
// }

module.exports = mongoose.model('Person', personSchema)
