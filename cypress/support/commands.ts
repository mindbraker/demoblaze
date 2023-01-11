/// <reference types="cypress" />
import 'cypress-network-idle';
export {};

declare global {
	namespace Cypress {
		interface Chainable {
			pageUrl(): Chainable<void>;
			login(username: string, password: string): Chainable<void>;
			clickOnProductCategory(category: string): Chainable<void>;
			clickOnProduct(name: string): Chainable<void>;
			verifyProductDetails(
				name: string,
				price: string,
				description: string
			): Chainable<void>;
			addProductToCart(): Chainable<void>;
			verifyProductDetailsOnCartPage(
				name: string,
				price: string
			): Chainable<void>;
			addSingleProductToCartFlow(
				category: string,
				name: string
			): Chainable<void>;
			addProductToCartAndVerifyItWasSuccessfullyAddedOnCartPage(
				category: string,
				name: string,
				price: string,
				description: string
			): Chainable<void>;
			placeOrderBtn(): Chainable<void>;
			placeOrderForm(
				name: string,
				country: string,
				city: string,
				card: string,
				month: string,
				year: string
			): Chainable<void>;
			getOrderFormPrice(price: string): Chainable<void>;
			getReceipt(price: string, card: string, name: string): Chainable<void>;
			deleteProduct(): Chainable<Chainable>;
		}
	}
}

Cypress.Commands.add('pageUrl', () => {
	cy.visit('/');
});

Cypress.Commands.add('login', (username: string, password: string) => {
	cy.session(
		[username, password],
		() => {
			cy.pageUrl();
			cy.get('a#login2').click();
			cy.get('input#loginusername').click().type(username);
			cy.get('input#loginpassword').click().type(password);
			cy.get('button.btn-primary').contains('Log in').click();

			cy.waitForNetworkIdle('*', '*', 5_000);

			cy.get('a#nameofuser')
				.should('be.visible')
				.contains(`Welcome ${username}`);
		},
		{ cacheAcrossSpecs: true }
	);
});

Cypress.Commands.add('clickOnProductCategory', (category: string) => {
	cy.get('#itemc.list-group-item').contains(category).click();
});

Cypress.Commands.add('clickOnProduct', (name: string) => {
	cy.get('.card-title').contains(name).click();
});

Cypress.Commands.add(
	'verifyProductDetails',
	(name: string, price: string, description: string) => {
		cy.get('.name').should('have.text', name);
		cy.get('.price-container').should('contain', price);
		cy.get('#more-information p')
			.invoke('text')
			.then((text) => {
				expect(text.trim().replace(/[\n\t]/g, '')).to.equal(description.trim());
			});
	}
);

Cypress.Commands.add('addProductToCart', () => {
	cy.get('.btn-lg').contains('Add to cart').click();

	cy.on('window:alert', (message) => {
		expect(message).to.be.equal('Product added');
	});
});

Cypress.Commands.add(
	'verifyProductDetailsOnCartPage',
	(name: string, price: string) => {
		cy.get('a.nav-link').contains('Cart').click();
		cy.waitForNetworkIdle('*', '*', 5_000);
		cy.get('tr.success')
			.should('be.visible')
			.each(($data) => {
				cy.wrap($data).contains('td', name);
				cy.wrap($data).contains('td', /^\d+$/).contains(price);
			});
		cy.get('#totalp').should('have.text', price);
	}
);

Cypress.Commands.add(
	'addSingleProductToCartFlow',
	(category: string, name: string) => {
		cy.pageUrl();
		cy.clickOnProductCategory(category);
		cy.clickOnProduct(name);
		cy.addProductToCart();
	}
);

Cypress.Commands.add(
	'addProductToCartAndVerifyItWasSuccessfullyAddedOnCartPage',
	(category: string, name: string, price: string, description: string) => {
		cy.clickOnProductCategory(category);
		cy.clickOnProduct(name);
		cy.verifyProductDetails(name, price, description);
		cy.addProductToCart();
		cy.verifyProductDetailsOnCartPage(name, price);
	}
);

Cypress.Commands.add('placeOrderBtn', () => {
	cy.get('button').contains('Place Order').click();
});

Cypress.Commands.add(
	'placeOrderForm',
	(
		name: string,
		country: string,
		city: string,
		card: string,
		month: string,
		year: string
	) => {
		cy.get('h5#orderModalLabel').should('be.visible');
		cy.get('input#name').click().type(name);
		cy.get('input#country').type(country);
		cy.get('input#city').type(city);
		cy.get('input#card').type(card);
		cy.get('input#month').type(month);
		cy.get('input#year').type(year);
		cy.get('button').contains('Purchase').click();
	}
);

Cypress.Commands.add('getOrderFormPrice', (price: string) => {
	cy.get('#totalm').contains(price);
});

Cypress.Commands.add(
	'getReceipt',
	(price: string, card: string, name: string) => {
		cy.get('.showSweetAlert').should('be.visible');
		cy.get('p.text-muted').contains(price).contains(card).contains(name);

		cy.waitForNetworkIdle('*', '*', 5_000);

		cy.get('button').contains('OK').click();
	}
);

Cypress.Commands.add('deleteProduct', () => {
	cy.get('a').contains('Delete').click();

	cy.waitForNetworkIdle('*', '*', 5_000);
});
