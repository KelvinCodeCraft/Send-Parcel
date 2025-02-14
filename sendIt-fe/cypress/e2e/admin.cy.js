describe('Validates the parcel details form', () => {
    beforeEach(() => {
        cy.adminLogin()
    })
    it('Validates the parcel details form', () => {
        cy.get('[data-cy="parcel-form"]').click()
        cy.get('button').contains('Submit').click()
    })
    it('')
})
describe('Tests Admin CRUD opearations on parcels', () => {
    beforeEach(() => {
        cy.adminLogin()
    })
    it('Tests creating new parcel', () => {
        cy.get('[data-cy="parcel-form"]').click()
        cy.get('#senderEmail').type('coyote@gmail.com')
        cy.get('#senderName').type('Coyote')
        cy.get('#receipientEmail').type('example@gmail.com')
        cy.get('#recipientName').type('Example')
        cy.get('#recipientLocation').select('Nakuru')
        cy.get('#senderLocation').select('Nairobi')
        cy.get('#weight').type('5')
        cy.get('#price').type('150')
        cy.get('#dispatchDate').type('2025-02-14')
        cy.get('#deliveryDate').type('2025-02-16')
        cy.get('#status').select('inTransit')
        // cy.get('button').contains('Submit').click()
    })
    it('Edits a parcel record', () => {
        cy.get('tr').contains('td', 'inTransit').parent().find('.edit-btn').first().click();
        cy.get('#status').select('delivered')
        cy.get('button').contains('Submit').click()

    })
    it('Deletes a parcel record', () => {
        cy.get('tr').contains('td', 'delivered').parent().find('.deleteParcel').first().click();
    })
})