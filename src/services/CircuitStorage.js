const { CircuitStorage, InMemoryDataSource } =  window.PolygonIdSdk;
export class CircuitStorageInstance {
	static instanceCS;
	static async init(){
		const f1 = await fetch('./circuit.wasm')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const f2 = await fetch('./circuit_final.zkey')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const f3 = await fetch('./verification_key.json')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		if(!this.instanceCS) {
			this.instanceCS = new CircuitStorage(new InMemoryDataSource());
			await this.instanceCS.saveCircuitData('authV2', {
				circuitId: 'authV2'.toString(),
				wasm: f1,
				provingKey: f2,
				verificationKey: f3
			});
		}
	}
	static getCircuitStorageInstance(){
		return this.instanceCS;
	}
}