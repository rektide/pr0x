import tape from "tape"
import prox from ".."
import aggro from "../plugin/aggro.js"
import { DefaultPlugins} from "../defaults.js"

tape.only("aggro adds prox to child", function(t){
	const
	  plugins=[ ...DefaultPlugins, aggro],
	  i= plugins.length -1,
	  o= prox({ parent: "is me"},{ plugins}),
	  foo= { value: "a child"}
	t.ok( o._prox, "root object has a _prox")
	o.foo= foo
	const fooProx= o.foo._prox
	t.ok( fooProx, "child object has a _prox")
	const
	  symbol= fooProx.symbol( i, foo),
	  data= fooProx[ symbol]
	t.equal( data.parent, o._prox, "child points to `parent`")
	t.equal( data.parentKey, "foo", "child knowns it's key via `parentKey`")
	t.end()
})

tape("grandchildren also proxed by aggro", function(t){
	const o= prox({}, {plugins: [...plugins, aggro]})
	t.ok( o._prox, "root object has a `_prox`")
	o.foo=  {}
	const grandchild= {}
	o.foo.bar= grandchild
	t.ok( o.foo.bar._prox, "proxed grandchild has a `_prox`")
	t.equal( o.foo.bar._prox.parent, o.foo._prox, "proxied grandchild points to child prox via `parent`")
	t.equal( o.foo.bar._prox.parentKey, "bar", "proxied grandchild knows it's key via `parentKey`")
	t.error( grandchild._prox, "real grandchild unaffected")
	t.end()
})

tape("child's contents are also proxed", function(t){
	const
	  o= prox({}, {plugins: [...plugins, aggro]}),
	  more= {
		stuff: {},
		primitive: 42
	  }
	o.more= more
	t.ok( o.more._prox, "child has `_prox`")
	t.ok( o.more.stuff._prox, "child's content's have `_prox`")
	t.ok( o.more.primitive, 42, "child's primitive content's unchanged")
	t.end()
})

tape("one object can be aggroed by two prox", function(t){
	const
	  shared= {},
	  proxed1= prox({}, {plugins: [...plugins, aggro]}),
	  proxed2= prox({}, {plugins: [...plugins, aggro]})

	proxed1.alpha= shared
	t.error( shared._prox, "original shared object being aggroed is unaffected")
	t.ok( proxed1.alpha._prox, "shared object is proxied accessed via parent")
	t.equal( proxed1.alpha._prox.parent, proxed1._prox, "first proxying has parent")
	t.equal( proxed1.alpha._prox.parentKey, "alpha", "first proxying knows it's parent's key")

	proxed2.omega= shared
	t.error( shared._prox, "original shared object being aggroed is unaffected")
	t.ok( proxed2.omega._prox, "shared object is proxied accessed via parent")
	t.equal( proxed2.omega._prox.parent, proxed2._prox, "second proxying has parent")
	t.equal( proxed2.omega._prox.parentKey, "omega", "second proxying knows it's parent's key")
	// let's re-assert our proxed1, which ought be unchanged
	t.equal( proxed1.alpha._prox.parent, proxed1._prox, "first proxying still knows it's parent")
	t.equal( proxed1.alpha._prox.parentKey, "alpha", "first proxying still knows it's parent's key")
	t.end()
})

tape( "an array can be aggro", function(t){
	t.end()
})

tape( "can optionally do a deep recurse", function(t){
	t.end()
})
