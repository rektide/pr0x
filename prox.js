import PhasedMiddleware from "phased-middleware"
import { pluginName} from "phased-middleware/name.js"
import { $symbols} from "phased-middleware/symbol.js"

import { defaults, defaulter } from "./defaults.js"
import { PipelineNames, PipelineSymbols} from "./pipeline.js"
import AggroProx from "./plugin/aggro-prox.js"
import { $proxied, $target} from "./symbol.js"

/**
* prox is a proxy 'handler' instance, pointing to a specific obj
*/
export class Prox extends PhasedMiddleware{
	/**
	* factory method to create a new Prox around an object & return the proxied object
	*/
	static make( obj= {}, opts){
		var p= new Prox( obj, opts)
		return p.proxied
	}
	constructor( target= {}, opts){
		super( defaulter( opts))
		// these both strike me as kind of a no-no that could potentially obstruct garbage collection
		this[ $target]= target
		this[ $proxied]= new Proxy( target, this)
	}
	get target(){
		return this[ $targe]
	}
	get proxied(){
		return this[ $proxied]
	}

	free(){
		const value= {
		  prox: this,
		  target: this.target,
		  proxied: this.proxied
		}
		this[ $target]= null
		this[ $proxied]= null
		return value
	}
	/**
	* Return a prox proxy for a new `obj`.
	* @danger: do not `#install` after `#fork`, symbols will be out of alignment
	*/
	fork( obj){
		const newProx= new (AggroProx())( obj, this)
		return newProx.proxied
	}
}
for( let i= 0; i< PipelineNames.length; ++i){
	const
	  method= PipelineNames[ i],
	  symbol= PipelineSymbols[ i]
	Prox.prototype[ method]= function( o, ...args){
		return this.exec( symbol, undefined, undefined, o, ...args)
	}
}
export default Prox.make
export const make = Prox.make
