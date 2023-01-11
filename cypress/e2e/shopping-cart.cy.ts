const products = require('../fixtures/products.json');

describe('Shopping cart regression suite for logged account', () => {
	beforeEach(() => {
		cy.session('loginTestingUser', () => {
			cy.fixture('../fixtures/user.json').then((userFixture) => {
				cy.login(userFixture.username, userFixture.password);
			});
		});
	});

	products.forEach((product: any) => {
		it(`${product.testcase}`, () => {
			cy.pageUrl();

			cy.addProductToCartAndVerifyItWasSuccessfullyAddedOnCartPage(
				product.category,
				product.name,
				product.price,
				product.description
			);

			cy.fixture('../fixtures/order.json').then((orderFixture) => {
				cy.placeOrderBtn();
				cy.placeOrderForm(
					orderFixture.name,
					orderFixture.country,
					orderFixture.city,
					orderFixture.card,
					orderFixture.month,
					orderFixture.year
				);
				cy.getOrderFormPrice(product.price);
				cy.getReceipt(product.price, orderFixture.card, orderFixture.name);
			});
		});
	});
});

describe('Shopping cart regression suite w/o an account: deletion', () => {
	it('Add product without an account and delete it from shopping cart', () => {
		cy.fixture('../fixtures/products.json').then((productsFixture) => {
			cy.pageUrl();
			cy.addProductToCartAndVerifyItWasSuccessfullyAddedOnCartPage(
				productsFixture[0].category,
				productsFixture[0].name,
				productsFixture[0].price,
				productsFixture[0].description
			);
		});
		cy.deleteProduct();
	});
});

describe('Shopping cart regression suite w/o an account: multiple products', () => {
	it('Add product without an account and verify sum is returned correctly for multiple products', () => {
		cy.pageUrl();
		cy.fixture('../fixtures/products.json').then((productsFixture) => {
			cy.addSingleProductToCartFlow(
				productsFixture[0].category,
				productsFixture[0].name
			);
			cy.addSingleProductToCartFlow(
				productsFixture[1].category,
				productsFixture[1].name
			);

			let totalCost: number =
				parseInt(productsFixture[0].price) + parseInt(productsFixture[1].price);
			cy.get('a.nav-link').contains('Cart').click();
			cy.get('#totalp').should('have.text', totalCost);
			cy.placeOrderBtn();
			cy.get('#totalp').should('have.text', totalCost);
		});
	});
});
