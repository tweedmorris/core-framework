# Introduction #

Core Framework utilizes fast algorithm for preloading images in parallel, thus reducing the response time of an application. Instead of sequential loading, CF's preloader loads an array of images in parallel.


# Preloading images #
Example of image preloading with Core Framework:
```
Core.preloader.queue(
[
	'../../../../explorer/1.jpg',
	'../../../../explorer/2.jpg',
	'../../../../explorer/3.jpg',
	'../../../../explorer/4.jpg',
	'../../../../explorer/5.jpg',
	'../../../../explorer/6.jpg',
	'../../../../explorer/7.jpg',
	'../../../../explorer/8.jpg',
	'../../../../explorer/9.jpg',
	'../../../../explorer/10.jpg',
	'../../../../explorer/11.jpg',
	'../../../../explorer/22.jpg',
	'../../../../explorer/13.jpg',
	'../../../../explorer/14.jpg'
]).preload(function(ui)
{
	alert('All loaded in ' + ui.time + ' sec.');
})
```

In the example above Core Framework will preload an array of images passed as argument of **queue()** method and then will execute a callback function passed as argument of **preload()** method once all images are preloaded successfully.

# Preloading anchor hrefs #
Sometimes one may need to load images from anchor href attribute. In the following example there is simple implementation of how to achieve this:
```
var images = $('a').map(function()
{
	return $(this).attr('href');
}).get();

Core.preloader.queue(images).preload(function(ui)
{
	alert('All loaded in ' + ui.time + ' sec.');
})
```
# Preload CSS Images #

One may need to preload CSS images. Core Framework finds images used in available CSS sheets and preloads them on demand. Example:
```
Core.preloader.preloadCssImages(function(ui)
{
	alert('All CSS images preloaded in ' + ui.time + ' sec.');
});
```