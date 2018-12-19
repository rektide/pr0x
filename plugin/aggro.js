import Prox from "../prox"

export function setAggro( ctx){
	const val= ctx.args[ 2]
	if( !val){
		return ctx.next()
	}
	if( Object(val)!== val){
		return ctx.next()
	}
	const
	  [ target, key]= ctx.args,
	  parentProx= ctx.prox,
	  existingProx= val._prox
	if( existingProx&& existingProx.parent=== parentProx&& existingProx.parentKey=== key){
		// object already has a prox with the correct location information
		return ctx.next()
	}
	const
	  plugins= parentProx.aggroPlugins|| parentProx.plugins,
	  proxied= Prox.make( val, { plugins}) // the aggro plugin will recursively apply itself here
	proxied._prox.parent= ctx.prox
	proxied._prox.parentKey= ctx.args[ 1]

	// swap in the new proxied object
	ctx.args[ 2]= proxied
	ctx.next()
}
setAggro.phase= {pipeline: "set", phase: "prerun"}

/**
* Aggro plugin will, whenever an object is assigned, insure that that object is wrapped in a prox
* Additionally, aggro attaches the parent & parentKey to the new prox, that point to the aggro prox & the key where it was set.
*/
export const aggro= {
	set: setAggro,
	name: "aggro"
}

export default aggro
