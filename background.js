/*
 * Watch all URL requests.  If we see one for pastebin.com which looks like
 * a paste URL, redirect to the raw.php version and avoid obnoxious adverts.
 */
var urlcb = function (details)
{
	/*
	 * Thanks to https://gist.github.com/jlong/2428561 for the easy way
	 * to parse a URL.
	 */
	var parser = document.createElement("a");
	parser.href = details.url;

	/*
	 * Try to only match paste URLs.  First exclude any URLs which
	 * obviously don't match.
	 */
	var validpaste = new RegExp("^[A-Za-z0-9]+$");
	var pasteid = parser.pathname.replace(/^\//, "");

	if (!(validpaste.test(pasteid)))
		return;

	/*
	 * If that succeeded then perform an AJAX request to check the
	 * proposed URL works via raw.php.  We need to test both that the
	 * returned status is 200, but also that the URL didn't change as
	 * XMLHttpRequest will automatically follow redirects.
	 *
	 * This avoids false positives such as http://pastebin.com/settings
	 */
	var xhr = new XMLHttpRequest();
	var rawurl = "http://pastebin.com/raw.php?i=" + pasteid;

	xhr.open("HEAD", rawurl, false);
	xhr.send();

	if (xhr.status === 200 && xhr.responseURL === rawurl ) {
		/*
		 * We're now reasonable confident that the URL is a valid
		 * paste, so return the modified URL redirect.
		 */
		return {
			redirectUrl: rawurl
		};
	}
}

/*
 * Note that we don't bother handling HTTPS or preserving parser.protocol
 * as pastebin redirects HTTPS to HTTP first anyway (as of August 2015).
 */
var filter = {
	urls : ["http://pastebin.com/*"]
};

var extraspec = [
	"blocking"
];

/*
 * See https://developer.chrome.com/extensions/webRequest
 */
chrome.webRequest.onBeforeRequest.addListener(urlcb, filter, extraspec);
