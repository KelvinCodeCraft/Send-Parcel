// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
Cypress.Commands.add('toLogin', () => {
   cy.visit('http://127.0.0.1:5502/sendIt-fe/home.html')
   cy.get('[data-cy="login-btn"]').click();
})
Cypress.Commands.add('userLogin', (email, password) => {
    email = 'coyote@gmail.com'
    password = '123456'
    cy.visit('http://127.0.0.1:5502/sendIt-fe/home.html')
    cy.get('[data-cy="login-btn"]').click();
    cy.get('#loginEmail').type(email)
    cy.get('#loginPassword').type(password)
    cy.get('button').contains('Login').click()
})
Cypress.Commands.add('adminLogin', (email, password) => {
    email = 'admin@gmail.com'
    password = '1234'
    cy.visit('http://127.0.0.1:5502/sendIt-fe/home.html')
    cy.get('[data-cy="login-btn"]').click();
    cy.get('#loginEmail').type(email)
    cy.get('#loginPassword').type(password)
    cy.get('button').contains('Login').click()
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })