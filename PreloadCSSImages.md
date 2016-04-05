# Preload CSS Images #

One may need to preload CSS images. Core Framework finds images used in available CSS sheets and preloads them on demand. Example:
```
Core.preloader.preloadCssImages(function(ui)
{
	alert('All CSS images preloaded in ' + ui.time + ' sec.');
});
```