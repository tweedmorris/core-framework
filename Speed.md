# Introduction #

Core Framework provides means for dynamic script inclusion and one can make use of this to speed up an application.

In a trivial situation most of the scripts are included in the **head** section. However sometimes a script may never do a task depending on the purpose of the user visit.

(**Example:** User may look at the site, but may not log in to update his/her profile. Imagine that authorization is done via clicking log-in button followed by popup created by JavaScript showing username & password field, followed by AJAX call, and some functions needed to properly handle the log in process)

Usually all the required functionality is binded in page load.

If the visitor does not use the provided log in functionality, all those functions related to it will not be needed thus making them not worth loading.

# How-to #
One can use Core Framework to rectify the example above and reduce some of the resources loaded on the page.
```
$('a.login').click(function()
{
	Core.require('tools.login', function()
	{
		/* Do all the stuff here */
	})
});
```
In the example above CF will include script on demand and allow to bind functionality with callback function. If the user never clicks login button, the code will not be included.