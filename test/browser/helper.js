function assert(expr, msg) {
    if (!expr) throw new Error(msg || 'failed');
}

function ok(a, msg) {
    assert(a, msg);
}

function ng(a, msg) {
    assert(!a, msg);
}

function is(a, b, msg) {
    assert(a === b, msg);
}

function isnt(a, b, msg) {
    assert(a !== b, msg);
}

function str(a) {
    return Object.prototype.toString.call(a);
}

function emit(elems, eventName) {
    var event = document.createEvent("MouseEvent");
    event.initEvent(eventName, true, true);

    if ( elems.length ) {
        Array.prototype.forEach.call(elems, (function(el) { el.dispatchEvent(event); }));
    }
    else {
        elems.dispatchEvent(event);
    }
}
