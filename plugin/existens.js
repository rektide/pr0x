var prox= require("../prox").prox

function existens(o,opts){
	function existens(o){
		function existens(ctx){
			var slot= ctx.args[0]
			if(!ctx.obj[slot])
				ctx.result= ctx.obj[slot]= {}
		}
		// add the existens handler to the get chain
		o._chains.get.push(existens)
	}
	o._enhance("existens",existens) // this module is existens
}
