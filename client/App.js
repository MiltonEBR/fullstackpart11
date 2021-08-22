import React, { useState, useEffect } from 'react'
import services from './Services'
import './custom.scss'

const Message = ({ msg, err }) => (msg === null ? null : (
  <div className="msg" style={err ? { color: 'red' } : { color: 'green' }}>
    {msg}
  </div>
)
)

const PersonForm = ({ addPerson }) => {
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  return (
    <form>
      <h2>Add new person</h2>
      <div>
        name:
        {' '}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        <br />
        phone:
        {' '}
        <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
      </div>
      <div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            addPerson(newName, newPhone)
            setNewName('')
            setNewPhone('')
          }}
        >
          add
        </button>
      </div>
    </form>
  )
}

const Persons = ({ list, handleClick }) => (
  list.map((person) => (
    <p key={person.id}>
      Name:
      {` ${person.name} `}
      Phone:
      {` ${person.number}`}
      <button type="button" onClick={() => handleClick(person.id, person.name)}>Remove</button>
    </p>
  ))
)

const Filter = ({ setList, persons }) => {
  const [filter, setFilter] = useState('')
  const filterList = () => {
    setList(persons.filter((person) => person.name.includes(filter)))
  }

  return (
    <div>
      Filter by:
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <button type="button" onClick={filterList}>Filter</button>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { id: '1', name: 'Arto Hellas', number: '040-123456' },
    { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
    { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' },
  ])

  const [list, setList] = useState(persons)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(false)

  const notif = (txt, error) => {
    setMsg(txt)
    setErr(error)
    setTimeout(() => {
      setMsg(null)
    }, 5500)
  }

  useEffect(() => {
    services.get().then((data) => {
      setPersons([...data])
      setList([...data])
    })
  }, [])

  const addPerson = (newName, newPhone) => {
    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already on your list, replace the old number with a new one?`,
        )
      ) {
        const existingPerson = persons.find((person) => person.name === newName)
        services
          .update(existingPerson.id, { ...existingPerson, number: newPhone })
          .then(() => {
            services.get().then((data) => {
              setPersons([...data])
              setList([...data])
              notif(`${newName} has been changed`, false)
            })
          })
          .catch((err) => {
            notif(` ${err.response.data.error}`, true)
          })
      }
      return
    }
    const newPerson = { name: newName, number: newPhone }
    services
      .create(newPerson)
      .then((data) => {
        setPersons([...persons, data])
        setList([...persons, data])
        notif(`${newName} has been aded`, false)
      })
      .catch((err) => {
        notif(` ${err.response.data.error}`, true)
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`You really want to erase ${name}?`)) {
      services
        .del(id)
        .then(() => {
          services.get().then((data) => {
            setPersons([...data])
            setList([...data])
            notif(`${name} has been deleted`, false)
          })
        })
        .catch(() => {
          notif(`${name} has already been deleted`, true)
          const newPersons = persons.filter((person) => person.id !== id)
          setPersons({ ...newPersons })
          setList([...newPersons])
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter setList={setList} persons={persons} />
      <Message msg={msg} err={err} />
      <PersonForm addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons list={list} handleClick={deletePerson} />
    </div>
  )
}

export default App
