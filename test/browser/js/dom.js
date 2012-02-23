describe('d.html', function() {
    it('is shortcut for innerHTML with single element', function() {
        var elem = d.id("id1-1");
        is(elem.innerHTML, "");

        d.html(elem, "html");
        is(elem.innerHTML, "html");
        is(d.html(elem), "html");
    });

    it('sets multiple innerHTML with Array of element', function() {
        var elems = d.cls("class1-1");
        elems.forEach(function(elem) {
            is(elem.innerHTML, "");
        });

        d.html(elems, "html");
        elems.forEach(function(elem) {
            is(elem.innerHTML, "html");
        });
    });

    it('gets multiple innerHTML with Array of element', function() {
        var elems = d.cls("class1-2");
        d.html(elems, "html");

        var htmls = d.html(elems);
        is(htmls.length, 3);
        htmls.forEach(function(html) {
            is(html, "html");
        });
    });
});

describe('d.add', function() {
    it('adds string to single element', function() {
        var elem = d.id("id2-1");
        elem.innerHTML = "foo";
        d.add(elem, "bar");
        is(elem.innerHTML, "foobar");
    });

    it('adds element to single element', function() {
        var elem1 = d.id("id2-2");
        var elem2 = d.id("id2-3");
        elem1.innerHTML = "foo";
        elem2.innerHTML = "bar";

        is(elem1.childNodes.length, 1);

        d.add(elem1, elem2);
        is(elem1.childNodes[1].id, "id2-3");
        is(d.id("id2-3").id, "id2-3"); // bad manner!
    });

    it('adds string to multiple elements', function() {
        var elems = d.cls("class2-1");
        d.html(elems, "foo");
        d.add(elems, "bar");
        elems.forEach(function(elem) {
            is(elem.innerHTML, "foobar");
        });
    });

    it('adds element to multiple elements', function() {
        var elems = d.cls("class2-2");
        var elem = d.cls("class2-3")[0];

        d.add(elems, elem);
        elems.forEach(function(el) {
            is(el.childNodes[0].className, "class2-3");
        });
    });
});

describe('d.remove', function() {
    it('removes single element from DOM tree', function() {
        var elem = d.id("id3-1");
        d.remove(elem);
        is(d.id("id3-1"), null);
    });

    it('removes multiple elements from DOM tree', function() {
        var elems = d.cls("class3-1");
        d.remove(elems);
        is(d.cls("class3-1").length, 0);
    });
});
