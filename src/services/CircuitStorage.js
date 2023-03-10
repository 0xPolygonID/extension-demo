const { CircuitStorage, InMemoryDataSource, CircuitExtensionStorage, IndexedDBCircuitStorage } = window.PolygonIdSdk;


export class CircuitStorageInstance {
	static async getCircuitStorageInstance() {
		const circuitsIds = ['authV2', 'credentialAtomicQueryMTPV2', 'credentialAtomicQuerySigV2'];
		if (!this.instanceCS) {
			this.instanceCS = new CircuitStorage(new InMemoryDataSource());
			try {
				console.time('check loading circuits from DB');
				await this.instanceCS.loadCircuitData(circuitsIds[0]);
				console.timeEnd('check loading circuits from DB');
				return this.instanceCS;
			} catch (e) {
				console.log('error', e);

				console.time('loading circuits from files');
				const circuits = await Promise.all(circuitsIds.map(circuitId => this.#loadCircuitsDataFromFile(circuitId)));
				console.timeEnd('loading circuits from files');

				console.time('saving circuits to DB');
				await Promise.all(circuits.map(circuit => this.#saveCircuitData(circuit.circuitId, circuit)));
				console.timeEnd('saving circuits to DB');
				return this.instanceCS;
			}
		}

		return this.instanceCS;
	}

	static async #loadCircuitsDataFromFile(circuitId) {
		const [wasm, provingKey, verificationKey] = await Promise.all([
			fetch(`./${circuitId}/circuit.wasm`)
				.then(response => response.arrayBuffer())
				.then(buffer => Array.from(new Uint8Array(buffer))),
			fetch(`./${circuitId}/circuit_final.zkey`)
				.then(response => response.arrayBuffer())
				.then(buffer => Array.from(new Uint8Array(buffer))),
			fetch(`./${circuitId}/verification_key.json`)
				.then(response => response.arrayBuffer())
				.then(buffer => Array.from(new Uint8Array(buffer)))
		]);

		return {
			circuitId,
			wasm,
			provingKey,
			verificationKey
		};

	}

	static async #saveCircuitData(circuitId, data) {
		await this.instanceCS.saveCircuitData(circuitId, data);
	}
}
