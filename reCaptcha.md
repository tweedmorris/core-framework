# Introduction #

reCAPTCHA is a free CAPTCHA service that helps to digitize books, newspapers and old time radio shows.

A CAPTCHA is a program that can tell whether its user is a human or a computer. You've probably seen them — colorful images with distorted text at the bottom of Web registration forms. CAPTCHAs are used by many websites to prevent abuse from "bots," or automated programs usually written to generate spam. No computer program can read distorted text as well as humans can, so bots cannot navigate sites protected by CAPTCHAs.

If you **run a website that suffers from problems with spam**, you can put reCAPTCHA on your site.

# Install with Core Framework #

Core Framework allows you to install reCaptcha with a single line of code:
```
Core.require('plugins.captcha', function()
{
	Captcha.config(
	{
		key: '<your public key here>'
	}).create("captcha",
	{
		theme: "red"
	});
})
```

In the example above CF will render reCaptcha in element with ID: captcha

If you have noticed so far, there is no need to include any JavaScript files in your code, they will be included automatically for you on demand. Core Frameworks enables you to activate reCaptcha in your existing pages without any need to modify your HTML code. Also reCaptcha is included with AJAX call thus reducing start-up resources for your pages.