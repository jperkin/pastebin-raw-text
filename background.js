/*
 * Watch all URL requests.  If we see one for pastebin.com which looks like
 * a paste URL, redirect to the raw.php version and avoid obnoxious adverts.
 */
var urlcb = function (details)
{
	/* Thanks to https://gist.github.com/jlong/2428561 */
	var parser = document.createElement('a');

	/* Try to only match paste URLs.  Not foolproof. */
	var validpaste = new RegExp('^[A-Za-z0-9]{8}$');

	parser.href = details.url;
	var pasteid = parser.pathname.replace(/^\//, '');

	if (validpaste.test(pasteid)) {
		return {
			redirectUrl: parser.protocol +
				     parser.hostname +
				     parser.port +
				     "/raw.php?i=" + pasteid
		};
	}
}

var filter = {
	urls : ["*://pastebin.com/*"]
};

var extraspec = [
	"blocking"
];

chrome.webRequest.onBeforeRequest.addListener(urlcb, filter, extraspec);
