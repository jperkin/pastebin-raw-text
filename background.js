/*
 * Copyright (c) 2015 Jonathan Perkin <jonathan@perkin.org.uk>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

/*
 * Parse URL requests for pastebin.com and redirect valid paste links to
 * the raw.php version.
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
	var rawurl = "https://pastebin.com/raw/" + pasteid;

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

var filter = {
	urls : ["*://pastebin.com/*"]
};

var extraspec = [
	"blocking"
];

/*
 * See https://developer.chrome.com/extensions/webRequest for more info.
 */
chrome.webRequest.onBeforeRequest.addListener(urlcb, filter, extraspec);
