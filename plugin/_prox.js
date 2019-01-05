export let currentObject

export function makeProxProp( propertyName= "_prox"){
	function getProxProp( cursor){
		const propertyKey= cursor.inputs[ 1]
		if( propertyKey=== "_prox"){
			currentObject= cursor.inputs[ 0]
			cursor.setOutput( cursor.phasedMiddleware) // return the prox
			cursor.position= cursor.phasedRun.length // terminate
		}
	}
	getProxProp.phase= { pipeline: "get", phase: "prerun"}
	return {
		name: "prox-prop",
		get: getProxProp
	}
}

export const
  singleton= makeProxProp(),
  _prox= singleton,
  prox= singleton,
  proxProp= singleton

export default _prox
