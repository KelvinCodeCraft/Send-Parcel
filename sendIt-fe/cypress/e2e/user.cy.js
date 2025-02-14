describe('Tests Admin CRUD opearations on parcels', () => {
    beforeEach(() => {
        cy.userLogin()
    })
    
    it('Views a parcel details', () => {
        cy.get('tr').contains('td', 'delivered').parent().find('.parcelDetailsBtn').first().click();
    })
    it('Gets parcels sent by the user', () => {
        cy.get('a').contains('Outgoing').click();
    })
    it('Gets parcels to be received by the user', () => {
        cy.get('a').contains('Incoming').click();
    })
})