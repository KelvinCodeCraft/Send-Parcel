/// <reference types="cypress"/> 
describe('It validates Login and registration forms', () => {
    beforeEach(() => {
        cy.toLogin()
    })
    it('Validates Login form', () => {
      cy.get('button').contains('Login').click()
    })
    it('Validates Sign Up form', () => {
        cy.get('a').contains('account').click()
        cy.get('button').contains('Register').click()
    })
    it('Validates if email exists', () => {
        cy.get('#loginEmail').type('email@example.com')
        cy.get('#loginPassword').type('1111')
        cy.get('button').contains('Login').click()
    })
    it('Validates if password is valid', () => {
        cy.get('#loginEmail').type('admin@gmail.com')
        cy.get('#loginPassword').type('1111')
        cy.get('button').contains('Login').click()
    })
})

describe('It Logs in admin and users', () => {
    beforeEach(() => {
        cy.toLogin()
    })
    it('Log in an admin', () => {
        cy.get('#loginEmail').type('admin@gmail.com')
        cy.get('#loginPassword').type('1234')
        cy.get('button').contains('Login').click()
    })
    it('Log in other users', () => {
        cy.get('#loginEmail').type('coyote@gmail.com')
        cy.get('#loginPassword').type('123456')
        cy.get('button').contains('Login').click()
    })
})