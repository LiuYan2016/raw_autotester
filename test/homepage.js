var assert = require('assert');

describe('onedrive.com page' , function(){
	it('should have the right title' , function(){
		browser.url('/');
		var title = browser.getTitle();
		assert.equal(title , 'WebdriverIO - WebDriver bindings for Node.js');
		console.log("title: ", title);
	});

	it('should click on uploads' , function(){
		browser.url('/');
		var hasApiLink = browser.isExisting("=API");
		assert(hasApiLink);
		// console.log("title: ", title);
	});

	it('should click on uploads' , function(){
		browser.url('/');
		browser.click("=API");
		// assert(hasApiLink);
		var title = browser.getTitle();
		assert.equal(title , 'WebdriverIO - API Docs');
		// browser.pause(5000);
		browser.debug();
		// console.log("title: ", title);
	});

	it.only('should filter search results' , function(){
		browser.url('/api.html');
		browser.setValue('input[name="search"]' , 'debug');
		browser.saveScreenshot("api_with_results.png");
	});
});