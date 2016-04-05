# Form validation #

Most of the user interaction is done via web forms. Core Framework provides robust mechanism for form validation that can be applied to every form in every project (even existing forms)

# Details #

Form validation is done through a process called mapping:

```
var maps = /* Validation map(s) */
{
	login: 
	{
		username: 
		{
			required: true, 
			email: 	  true,
			message:  "Username must be valid email address"
		}
	}
}
```

Mapping is a simple process of creating a JSON map with the fields that need to be validated. One can validate multiple forms with single map.

# Map format #

```
<form id>: {
	<field>:
	{
		required: <true>|<false>,
		message: <error message>,
		<validator>: <result>,
		<validator>: <result>
		...
		...
		...
	}
}
```

In the example above 

&lt;validator&gt;

 is one of the valdiators provided by Core Framework. 

&lt;result&gt;

 is boolean value.

# Example #
```
$.each(maps, function(key, map)
{
	var form = $('form[id=' + key + ']');
	

	form.find(':submit').click(function()
	{
		return Core.validator.map(form,map).auto().valid();
	})
})
```

# Validators #
  1. **empty**:  Check whether value is empty string
  1. **email**:  Check whether the value is valid email
  1. **alnum**:  Check whether value contains alphabetic or numeric characters only
  1. **digit**:  Check whether value contains numeric characters only
  1. **alpha**:  Check whether value contains alphabetic characters only
  1. **lower**:  Check whether value contains only lower characters
  1. **upper**:  Check whether value contains only upper characters
  1. **password**: Check whether value contains secure password
  1. **checked**: Check whether value is checked
  1. **ukpostcode**: Check whether value contains valid UK postcode

The library allows you to combine multiple validators in the map.

# Adding validator(s) #

Usually bespoke projects need more advanced and complex validation. Core Framework allows you to extend the default validators and add your own:
```
Core.validator.extend(
{
	sexyWoman: function(value) /* Returns true if the value is sexy woman */
	{ 
		return true;
	}
})
```