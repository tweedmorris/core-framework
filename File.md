# File upload #

Most of the user interaction in rich UI's happens on screen without refreshing the page. File upload with JavaScript can be painful process in terms of crossbrowser issues. CF provides file upload interface to simplify this process. There are also handy callback functions i.e listeners which can be used to track the upload status.

# IFrame #
CF's AJAX File Upload makes use of dynamically generated iframe invisible to the end user.

# Uploading file with CF #

The next example shows how to upload file with CF:

  * Assume there is a form defined with action **upload.php**
  * Assume there is a container defined with class **.ajaxUpload**

```
var upload = new Core.data.FileUpload(
{
	listeners: 
	{
		before: function(event, ui)
		{
                },
		success: function(event, response)
		{
                }
         },
         renderTo: '.ajaxUpload'
         
});
			
/* Render upload */
upload.render();
```

The example above will render a file upload field in the container with class **.ajaxUpload** and will post data to **upload.php** via AJAX call once the value of the input changes i.e user selects file from local system.

Notice the 2 listeners provided by CF (before, success). They are called respectively before file upload and once upload is complete.

Response object of the success listener passed as second argument contains the output of file **upload.php**. Recommended output is **JSON**