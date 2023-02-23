const { CircuitStorage, InMemoryDataSource } =  window.PolygonIdSdk;
export class CircuitStorageInstance {
	static instanceCS;
	static async init(){
		const auth_w = await fetch('./AuthV2/circuit.wasm')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const mtp_w = await fetch('./credentialAtomicQueryMTPV2/circuit.wasm')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const sig_w = await fetch('./credentialAtomicQuerySigV2/circuit.wasm')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		
		const auth_z = await fetch('./AuthV2/circuit_final.zkey')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const mtp_z = await fetch('./credentialAtomicQueryMTPV2/circuit_final.zkey')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const sig_z = await fetch('./credentialAtomicQuerySigV2/circuit_final.zkey')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		
		const auth_j = await fetch('./AuthV2/verification_key.json')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const mtp_j = await fetch('./credentialAtomicQueryMTPV2/verification_key.json')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		const sig_j = await fetch('./credentialAtomicQuerySigV2/verification_key.json')
			.then(response => response.arrayBuffer())
			.then(buffer => new Uint8Array( buffer ))
		
		if(!this.instanceCS) {
			this.instanceCS = new CircuitStorage(new InMemoryDataSource());
			await this.instanceCS.saveCircuitData('authV2', {
				circuitId: 'authV2'.toString(),
				wasm: auth_w,
				provingKey: auth_z,
				verificationKey: auth_j
			});
			await this.instanceCS.saveCircuitData('credentialAtomicQueryMTPV2', {
				circuitId: 'authV2'.toString(),
				wasm: mtp_w,
				provingKey: mtp_z,
				verificationKey: mtp_j
			});
			await this.instanceCS.saveCircuitData('credentialAtomicQuerySigV2', {
				circuitId: 'authV2'.toString(),
				wasm: sig_w,
				provingKey: sig_z,
				verificationKey: sig_j
			});
		}
	}
	static getCircuitStorageInstance(){
		return this.instanceCS;
	}
}