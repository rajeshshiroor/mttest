// Bundled with Fusion v0.1



/*
 * File: host_map.js
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  WARNING: Moovweb auto-generated file. Any changes you make here will *
 *  be overwritten.                                                      *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function(){

var mapProxyToOrigin = {"http://mlocal.mindtree.com":"http://www.mindtree.com","https://mlocal.mindtree.com":"https://www.mindtree.com"};
var mapOriginToProxy = {"http://mindtree.com":"http://mlocal.mindtree.com","http://www.mindtree.com":"http://mlocal.mindtree.com","https://mindtree.com":"https://mlocal.mindtree.com","https://www.mindtree.com":"https://mlocal.mindtree.com"};

if (typeof(mw) == "undefined") {
	window.mw = {};
}

if(typeof(mw.catch_all_domain) == "undefined") {
	mw.catch_all_domain = ".moovapp.com";
} else {
  if (mw.catch_all_domain[0] != ".") {
  	console.log("Bad catch all domain");
  }
}


function detect_catch_all(url) {
	var found_index = url.host.indexOf(mw.catch_all_domain);
	var length = url.host.length;

	if (found_index != -1 && (found_index + mw.catch_all_domain.length) == length) {
		return true;
	}
	return false;
}

function strip_catch_all(url) {
	var found_index = url.host.indexOf(mw.catch_all_domain);
	var length = url.host.length;

	url.host = url.host.slice(0, found_index);
	return url;
}

function add_catch_all(url) {
	url.host = url.host + mw.catch_all_domain;
	return url;	
}

function getParsedURL(url) {
	var elem = document.createElement("a")
	elem.href = url;
	return elem;
}

function getSchemeAndHostname(url) {
	var result = {};
	result.scheme = url.protocol;
	result.host = url.host;
	return result;
}

function getKey(url) {
	var components = getSchemeAndHostname(url);
	return components.scheme + "//" + components.host;
}

function fetch(url, map) {
	var key = getKey(url);
	var result = map[key];
	
	if (result === undefined) {
		if (typeof(mw) != 'undefined' && mw.debug == true) {
			console.log("Warning. No rule to modify host (" + key + ").")
		}
		return url.href;
	}
	
	return result + url.pathname + url.search + url.hash;
}

function detect(rawURL) {
  var properties = {
    "secure": false,
    "schema_relative": false,
    "relative": false
  };  
  properties.raw = rawURL;
  
  if (rawURL.indexOf("https://") != -1) {
    properties.secure = true;
  } else if(rawURL.indexOf("http://") == -1) {
    if (rawURL.indexOf("//") == 0) {
      properties.schema_relative = true;
    } else {
      properties.relative = true;
    }
  }
  
  return properties;
}

function denormalize(url, properties) {
  url = getParsedURL(url);
  if (properties.relative) {    
    return url.pathname + url.search + url.hash;
  } else {
    if (properties.secure) {
      return url.href.replace("http://","https://");
    } 
    if (properties.schema_relative) {
      return url.href.replace(/^https*:/, "");
    }
    
  }
  return url.href;
}

mw.proxyURLToOrigin = function(rawURL){	

	var properties = detect(rawURL);

	// Make sure it includes the host, or it will still be proxied!
	properties.relative = false;

	var url = getParsedURL(rawURL);
	var catch_all = detect_catch_all(url);

  if (catch_all) {    
	  url = strip_catch_all(url);
  }
	
	url = fetch(url, mapProxyToOrigin);
	url = denormalize(url, properties);

	return url;
}

mw.originURLToProxy = function(rawURL){

	var properties = detect(rawURL);
	var url = getParsedURL(rawURL);
	var catch_all = detect_catch_all(url);

  if (catch_all) {    
	  url = strip_catch_all(url);
  }

  url = getParsedURL(fetch(url, mapOriginToProxy));
  var globalLocation = getParsedURL(window.location.href);
  if (detect_catch_all(globalLocation)) {
      url = add_catch_all(url);
  }

	url = denormalize(url.href, properties);
	
	return url;
}

}());



/*
 * File: cachify.js
 */
/*
  Cachify 1.0
  by Hampton Catlin

  This is a simple library that works with Moovweb's "cache"
  mixer to make it very easy to late load content onto 
  the Moov'd site.
*/
document.addEventListener("DOMContentLoaded", function() {
  var cache = document.querySelector("[data-cache-hold]");
  if (cache) {
    var xhr = new XMLHttpRequest;
    var prefix = location.href.indexOf("?") == -1 ? "?" : "&";
    xhr.open("GET", document.location.href + prefix + "_mw_cached_fragments=true&_=" + Date.now());
    xhr.setRequestHeader("X-Requested-With", "CacheRequest");
    try { xhr.responseType = "json"; } catch(e) {}
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var data = Array.isArray(xhr.response) ? xhr.response : JSON.parse(xhr.responseText);
          for (var i = 0; i < data.length; i++) {
            var node = document.querySelector("[data-cache-hold='" + (i+1) + "']");
            if (node)
              node.outerHTML = data[i];
          }
        }
        else
          console.log("Looks like the cachify process failed. Oh noes!");
      }
    };
    xhr.send();
  }
});



/*
 * File: main/stub.js
 */
// Delete me when ready
