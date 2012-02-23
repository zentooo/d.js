// scope

function d(arg, ctx) {
    if ( typeof arg === "function" ) {
        document.addEventListener("DOMContentLoaded", arg, false);
    }
    else {
        return d.toArray((ctx || document).querySelectorAll(arg));
    }
}

d.version = 0.1;

d.exportAs = function(name) {
    window[name] = d;
    delete window["d"];
};


// util

d.isHash = function(o) { return o.constructor.toString().indexOf("function Object") === 0; };
d.toArray = function(arrayLike) { return Array.prototype.slice.apply(arrayLike); };


// selectors

d.id = function(id, ctx) { return (ctx || document).getElementById(id); };
d.cls = function(cls, ctx) { return d.toArray((ctx || document).getElementsByClassName(cls)); };
d.tag = function(tag, ctx) { return d.toArray((ctx || document).getElementsByTagName(tag)); };


// dom

d.html = function(elems, htmlString) {
    if ( elems.length === void 0 ) {
        if ( htmlString ) elems.innerHTML = htmlString;
        return elems.innerHTML;
    }
    else {
        if ( htmlString ) {
            return d.toArray(elems).map(function(el) {
                return (el.innerHTML = htmlString);
            });
        }
        else {
            return d.toArray(elems).map(function(el) {
                return el.innerHTML;
            });
        }
    }
};

d.add = function(elems, html) {
    if ( elems.length === void 0 ) {
        if ( typeof html === "string" ) {
            elems.innerHTML += html;
        }
        else {
            elems.appendChild(html.cloneNode(true));
        }
    }
    else {
        if ( typeof html === "string" ) {
            d.toArray(elems).forEach(function(el) {
                el.innerHTML += html;
            });
        }
        else {
            d.toArray(elems).forEach(function(el) {
                el.appendChild(html.cloneNode(true));
            });
        }
    }
};

d.remove = function(elems) {
    if ( elems.length === void 0 ) {
        elems.parentNode.removeChild(elems);
    }
    else {
        d.toArray(elems).forEach(function(el) {
            el.parentNode.removeChild(el);
        });
    }
};


// modifiers

d.css = function(elems, arg1, arg2) {
    var cssText;
    if ( arguments.length === 1 ) {
        if ( d.isHash(arg1) ) { // d.css(elems, { foo: "bar" });
            cssText = d._cssText(arg1);
        }
        else { // d.css(elems, "foo");
            if ( elems.length === void 0 ) {
                return getComputedStyle(elems, null).getPropertyValue(args1);
            }
            else {
                return d.toArray(elems).map(function(el) {
                    return getComputedStyle(el, null).getPropertyValue(args1);
                });
            }
        }
    }
    else { // d.css(elems, "foo", "bar");
        cssText = ";" + arg1 + ":" + arg2;
    }

    if ( elems.length === void 0 ) {
        elems.cssText += cssText;
    }
    else {
        d.toArray(elems).forEach(function(el) {
            el.cssText += cssText;
        });
    }
};

d._cssText = function(o) {
    var buf = [";"];
    for ( var k in o ) {
        buf.concat([k, ":", o[k], ";"]);
    }
    return buf.join("");
};


d.attr = function(elems, arg1, arg2) {
    if ( arguments.length === 1 ) {
        if ( d.isHash(arg1) ) { // d.attr(elems, { foo: "bar" });
            for ( var k in arg1 ) {
                d._setAttr(elems, k, arg1[k]);
            }
        }
        else { // d.attr(elems, "foo");
            if ( elems.length === void 0 ) {
                return elems.getAttribute(arg1);
            }
            else {
                return d.toArray(elems).map(function(el) {
                    return el.getAttribute(arg1);
                });
            }
        }
    }
    else { // d.attr(elems, "foo", "bar");
        d._setAttr(elems, arg1, arg2);
    }
};

d._setAttr = function(elems, key, value) {
    if ( elems.length === void 0 ) {
        elems.setAttribute(key, value);
    }
    else {
        d.toArray(elems).forEach(function(el) {
            el.setAttribute(key, value);
        });
    }
};


d.addClass = function(elems, className) {
    if ( elems.length === void 0 ) {
        d._addClass(elems, className);
    }
    else {
        d.toArray(elems).forEach(function(el) {
            d._addClass(el, className);
        });
    }
};

d._addClass = function(el, className) {
    var currents = el.className.split(" ");
    currents.push(className);
    el.className = currents.join(" ");
};


d.removeClass = function(elems, className) {
    if ( elems.length === void 0 ) {
        d._removeClass(elems, className);
    }
    else {
        d.toArray(elems).forEach(function(el) {
            d._removeClass(el, className);
        });
    }
};

d._removeClass = function(el, className) {
    var currents = el.className.split(" ");
    currents.filter(function(c) {
        return c !== className;
    });
    el.className = currents.join(" ");
};

d.hasClass = function(elems, className) {
    var regex = new RegExp("(?:^|\\b)" + className + "(?:\\b|$)");
    if ( elems.length === void 0 ) {
        return !!elems.className.match(regex);
    }
    else {
        d.toArray(elems).map(function(el) {
            return !!el.className.match(regex);
        });
    }
};

d.swapClass = function(elems, fromClass, toClass) {
    d.removeClass(elems, fromClass);
    d.addClass(elems, toClass);
};


// event

d._listeners = {};
d._nidc = 1;

d._nid = function(el) {
    return el._nid || (el._nid = d._nidc++);
};

d._getStructs = function(namespace) {
    var structs = [], current = [];

    namespace.split(".").forEach(function(t) {
        current.push(t);
        structs.push(current.join("."));
    });

    return structs;
};

d.bind = function(elems, name, callback, useCapture) {
    if ( elems.length === void 0 ) {
        d._bind(elems, name, callback, useCapture);
    }
    else {
        d.toArray(elems).forEach(function(el) {
            d._bind(el, name, callback, useCapture);
        });
    }
};

d._bind = function(el, name, callback, useCapture) {
    var nid = d._nid(el),
        structs = d._getStructs(name);

    structs.forEach(function(struct) {
        d.__bind(el, structs[0], nid, struct, callback, useCapture);
    });

    el.addEventListener(structs[0], callback, useCapture || false);
};

d.__bind = function(el, name, nid, struct, callback, useCapture) {
    d._listeners[nid] = d._listeners[nid] || {};
    var bounds = d._listeners[nid][struct] || (d._listeners[nid][struct] = []);

    bounds.push({
        name: name,
        actor: el,
        callback: callback,
        index: bounds.length,
        useCapture: useCapture || false
    });
};


d.unbind = function(elems, name) {
    if ( elems.length === void 0 ) {
        d._unbind(elems, name);
    }
    else {
        d.toArray(elems).forEach(function(el) {
            d._unbind(el, name);
        });
    }
};

d._unbind = function(el, name) {
    var nid = d._nid(el),
        bounds = d._findBounds(nid, name);

    bounds && bounds.forEach(function(bound) {
        el.removeEventListener(bound.name, bound.callback, bound.useCapture);
    });
};

d._findBounds = function(nid, name) {
    var allBounds;
    if ( d._listeners[nid] === void 0 ) {
        return;
    }
    else if ( name === void 0 ) {
        allBounds = [];
        for ( var n in d._listeners[nid] ) {
            allBounds = allBounds.concat(d._listeners[nid][n]);
        }
        return allBounds;
    }
    else {
        return d._listeners[nid][name];
    }
};


// ajax

d.ajax = function(url, success, error, options) {
    var xhr = new XMLHttpRequest(),
        options = options || {},
        success = success || function() {},
        error = error || function() {},
        method = options.method || "GET",
        header = options.header || {},
        ctype = options.ctype || (( method === "POST" ) ? "application/x-www-form-urlencoded" : ""),
        data = options.data || "",
        key;

    xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4 ) {
            if ( xhr.status >= 200 && xhr.status < 300 ) {
                success(xhr.responseText, xhr);
            } else {
                error(xhr);
            }
        }
    };

    if ( typeof data === "object" ) {
        data = encode(data);
    }

    xhr.open(method, url, true);
};

d.get = function(url, success, error) {
    d.ajax(url, success, error);
};

d.post = function(url, success, error, data) {
    d.ajax(url, success, error, {
        method: "POST",
        data: data
    });
};
