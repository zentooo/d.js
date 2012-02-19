describe('d._nid', function() {
    it('adds sequential id to element', function(){
        is(d._nid(d.id("1")), 1);
        is(d._nid(d.id("2")), 2);
        is(d._nid(d.id("3")), 3);
    });
});

describe('d._getStructs', function() {
    it('makes prefix array', function() {
        var structs = d._getStructs("foo.bar.baz");
        is(structs[0], "foo");
        is(structs[1], "foo.bar");
        is(structs[2], "foo.bar.baz");
    });
});

describe('d.__bind', function() {
    it('pushes event listener infos to bound with struct', function() {
        var el = d.id("foo1");
        var nid = d._nid(el);
        var callback = function() { /*cb*/ };
        d.__bind(d.id("foo1"), "click", nid, "click.foo", callback, false);
        isnt(d._listeners[nid]["click.foo"].length, void 0);

        var bound = d._listeners[nid]["click.foo"][0];
        isnt(bound, void 0);

        is(bound.name, "click");
        is(bound.actor, el);
        is(bound.callback, callback);
        is(bound.index, 0);
        is(bound.useCapture, false);
    });
});

describe('d._bind', function() {
    it('pushes event listener infos to with splat struct', function() {
        var el = d.id("foo2");
        var spy = sinon.spy();
        d._bind(el, "click.foo", spy, false);

        isnt(d._listeners[el._nid]["click"].length, void 0);
        isnt(d._listeners[el._nid]["click.foo"].length, void 0);

        emit(el, "click");
        ok(spy.calledOnce);
    });
});

describe('d.bind', function() {
    it('binds event listeners to single element', function() {
        var el = d.id("foo3");
        var spy = sinon.spy();
        d.bind(el, "click", spy);
        emit(el, "click");
        ok(spy.calledOnce);
    });
    it('binds event listeners to multiple elements', function() {
        var elems = d.cls("bar1");
        var spy = sinon.spy();
        d.bind(elems, "click", spy);
        emit(elems, "click");
        ok(spy.calledThrice);
    });
});

describe('d._findBounds', function() {
    var f = function() {};

    it('returns nothing with ghost nid', function() {
        is(d._findBounds(-1, "click"), void 0);
    });

    it('returns all bounds if no name', function() {
        var el = d.id("foo4");
        d.bind(el, "click", f);
        d.bind(el, "click", f);
        d.bind(el, "click.foo", f);
        d.bind(el, "change", f);
        is(d._findBounds(el._nid).length, 5);
    });

    it('returns partial bounds with name', function() {
        var el = d.id("foo4");
        is(d._findBounds(el._nid, "click").length, 3);
        is(d._findBounds(el._nid, "click.foo").length, 1);
    });
});

describe('d._unbind', function() {
    it('unbinds lister from single element', function() {
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var spy3 = sinon.spy();
        var spy4 = sinon.spy();
        var spy5 = sinon.spy();

        var el = d.id("foo5");
        d.bind(el, "click", spy1);
        d.bind(el, "click.foo", spy2);
        d.bind(el, "click.foo", spy3);
        d.bind(el, "click.foo.bar", spy4);
        d.bind(el, "click.foo.bar", spy5);

        emit(el, "click");
        ok(spy1.calledOnce);
        ok(spy2.calledOnce);
        ok(spy3.calledOnce);
        ok(spy4.calledOnce);
        ok(spy5.calledOnce);

        d.unbind(el, "click.foo.bar");
        emit(el, "click");
        ok(spy1.calledTwice);
        ok(spy2.calledTwice);
        ok(spy3.calledTwice);
        ok(spy4.calledOnce);
        ok(spy5.calledOnce);

        d.unbind(el, "click.foo");
        emit(el, "click");
        ok(spy1.calledThrice);
        ok(spy2.calledTwice);
        ok(spy3.calledTwice);
        ok(spy4.calledOnce);
        ok(spy5.calledOnce);
    });
});

describe('d.unbind', function() {
    it('unbinds lister from single element', function() {
        var spy = sinon.spy();
        var el = d.id("foo6");
        d.bind(el, "click", spy);
        d.unbind(el, "click");
        emit(el, "click");
        ng(spy.called);
    });

    it('unbinds lister from multiple elements', function() {
        var spy = sinon.spy();
        var elems = d.cls("bar2");
        d.bind(elems, "click", spy);
        d.unbind(elems, "click");
        emit(elems, "click");
        console.dir(spy);
        ng(spy.called);
    });
});
