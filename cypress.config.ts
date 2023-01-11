import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		env: {
			demoblaze: 'https://demoblaze.com'
		},
		baseUrl: 'https://demoblaze.com',
		viewportHeight: 1_600,
		viewportWidth: 1_400
	}
});
