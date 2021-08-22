
describe('Phonebook', function() {
    it('front page can be opened', function() {
      cy.visit('http://localhost:8000')
      cy.contains('Phonebook')
      cy.contains('Add new person')
    })
  })