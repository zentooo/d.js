describe('d', function(){
    it('returns NodeList', function() {
        is(str(d(".bar")), "[object Array]");
    });
});

describe('d.id', function(){
    it('returns HTMLElement', function() {
        is(str(d.id("foo")), "[object HTMLDivElement]");
    });
});

describe('d.cls', function(){
    it('returns NodeList', function() {
        is(str(d.cls("bar")), "[object Array]");
    });
});

describe('d.tag', function(){
    it('returns NodeList', function() {
        is(str(d.tag("a")), "[object Array]");
    });
});

describe('d.isObject', function(){
    function Klass() {}
    Klass.prototype = [];
    var k = new Klass();
    it('detect plain object or not', function() {
        ok(d.isObject({}));
        ng(d.isObject(k));
    });
});

describe('d.toArray', function(){
    it('convert pseudo-Array to Array', function() {
        ok(Array.isArray(d.toArray(d.cls("bar"))));
    });
});
