const { CircuitStorage, InMemoryDataSource } = window.PolygonIdSdk;


class ChromeStorageDataSource {
	constructor() {
		this.storage = chrome.storage.local;
	}

	async get(key) {
		return new Promise(resolve => {
			this.storage.get(key, result => {
				resolve(result[key]);
			});
		});
	}

	async set(key, value) {
		return new Promise(resolve => {
			this.storage.set({ [key]: value }, () => {
				resolve();
			});
		});
	}
}

export class CircuitStorageInstance {
	static async getCircuitStorageInstance() {
		if (!this.instanceCS) {
			this.instanceCS = new CircuitStorage(new ChromeStorageDataSource());
			const auth = await this.#getCircuitData('authV2');
			const mtp = await this.#getCircuitData('credentialAtomicQueryMTPV2');
			const sig = await this.#getCircuitData('credentialAtomicQuerySigV2');

			await this.#saveCircuitData('authV2', auth);
			await this.#saveCircuitData('credentialAtomicQueryMTPV2', mtp);
			await this.#saveCircuitData('credentialAtomicQuerySigV2', sig);
		}

		return this.instanceCS;
	}

	static async #getCircuitData(circuitId) {
		const [wasm, provingKey, verificationKey] = await Promise.all([
			fetch(`./${circuitId}/circuit.wasm`)
				.then(response => response.arrayBuffer())
				.then(buffer => new Uint8Array(buffer)),
			fetch(`./${circuitId}/circuit_final.zkey`)
				.then(response => response.arrayBuffer())
				.then(buffer => new Uint8Array(buffer)),
			fetch(`./${circuitId}/verification_key.json`)
				.then(response => response.arrayBuffer())
				.then(buffer => new Uint8Array(buffer))
		]);

		return {
			circuitId,
			wasm,
			provingKey,
			verificationKey
		};

	}

	static async #saveCircuitData(data) {
		await this.instanceCS.saveCircuitData(data.circuitId, {
			circuitId: data.circuitId,
			wasm: data.wasm,
			provingKey: data.provingKey,
			verificationKey: data.verificationKey
		});
	}
}
