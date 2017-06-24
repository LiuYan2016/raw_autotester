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

	it.only('should be able to upload files' , function(){
		// browser.url('/api.html');
		// browser.setValue('input[name="search"]' , 'debug');
		// browser.saveScreenshot("api_with_results.png");
		browser.url('/');
		// browser.newWindow('/' , 'One Drive');
		// browser.getAttribute('=Sign in', 'href').click();
		browser.click("=Sign in");
		browser.setValue('.//*[@id=\'appRoot\']/ms-signindialog/section/div[2]/div/div[1]/div/form/input[1]' , 'admin@sumoskope.onmicrosoft.com');
		// browser.click("=Next");
		browser.keys("Enter");
		// browser.click("=Password");
		// browser.url('/');
		var he = browser.getUrl();
		console.log("he", he);

		browser.pause(5000);
		browser.setValue('input[name=\'passwd\']' , 'netSk0pe#123');
		// browser.click(".//*[@id='cred_sign_in_button']");
		browser.submitForm('#credentials');

		// browser.pause(10000);
		// browser.reload();
		// browser.keys("Enter");

		// browser.url('https://sumoskope-my.sharepoint.com');



		var after_login_url = browser.getUrl();
		console.log("after_login_url", after_login_url);
		// browser.url(after_login_url);


		var title = browser.getTitle();
		console.log("title", title);
		assert.equal(title , 'OneDrive for Business');
		browser.pause(5000);
		browser.click(".//*[@id='appRoot']/div[1]/div[2]/div[3]/div/div[2]/div/div[2]/div[2]/div/div");
		browser.pause(10000);

		var path = require('path');
	    var toUpload = path.join(__dirname, '..', '..', 'test', 'ved.txt');

	 //    it('uploads a file and fills the form with it', function() {
		//     return this.client.chooseFile('#upload-test', toUpload).catch(function(err) {
  //       		assert.ifError(err);
	 //    	}).getValue('#upload-test').then(function(val) {
  //       		assert.ok(ved\.txt$/.test(val));
	 //    	});
		// });

		// it('errors if file does not exists', function() {
		//     return this.client.chooseFile('#upload-test', '$#$#940358435').catch(function(err) {
		//         assert.notEqual(err, null);
		//     });
		// });

		// browser.click("input[class=\'ContextualMenu-fileInput\']");
		// browser.setValue('.//*[@id=\'ContextualMenu0\']/div/ul/li[1]/div/div/input' , '~/Desktop/ved.txt');
		// browser.keys("Enter");
		// browser.click("=Files");
		// browser.chooseFile('input[class=\'ContextualMenu-fileInput\']' , '~/Desktop/ved.txt');
		// browser.chooseFile(".//*[@id='ContextualMenu0']/div/ul/li[1]/div/div/input" , '~/Desktop/ved.txt');
		browser.debug();
		// browser.pause(50000);

	});
});