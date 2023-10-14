import { CircuitStorage, IndexedDBDataSource } from '@0xpolygonid/js-sdk';

export class CircuitStorageService {
  static instance;

  static async init() {
    const ds = new IndexedDBDataSource("circuits");
    const instance = new CircuitStorage(ds);
    try {
      console.time("check loading circuits from DB");
      await instance.loadCircuitData("authV2");
      console.timeEnd("check loading circuits from DB");
    } catch (e) {
      const data = await this.fetchCircuitsData(instance);
      await this.saveCircuitData(instance, data);
    }
    return instance;
  }

  static async fetchCircuitsData(instance) {
    console.time("CircuitStorageService.fetchCircuits");
    const auth_w = await fetch("./AuthV2/circuit.wasm")
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const mtp_w = await fetch("./credentialAtomicQueryMTPV2/circuit.wasm")
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const sig_w = await fetch("./credentialAtomicQuerySigV2/circuit.wasm")
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const auth_z = await fetch("./AuthV2/circuit_final.zkey")
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const mtp_z = await fetch("./credentialAtomicQueryMTPV2/circuit_final.zkey")
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const sig_z = await fetch("./credentialAtomicQuerySigV2/circuit_final.zkey")
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const auth_j = await fetch("./AuthV2/verification_key.json")
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const mtp_j = await fetch(
      "./credentialAtomicQueryMTPV2/verification_key.json"
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    const sig_j = await fetch(
      "./credentialAtomicQuerySigV2/verification_key.json"
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
    console.timeEnd("CircuitStorageService.fetchCircuits");
    return { auth_w, mtp_w, sig_w, auth_z, mtp_z, sig_z, auth_j, mtp_j, sig_j };
  }

  static async saveCircuitData(
    instance,
    { auth_w, mtp_w, sig_w, auth_z, mtp_z, sig_z, auth_j, mtp_j, sig_j }
  ) {
    console.time("CircuitStorageService.saveCircuitData");
    await instance.saveCircuitData("authV2", {
      circuitId: "authV2".toString(),
      wasm: auth_w,
      provingKey: auth_z,
      verificationKey: auth_j,
    });
    await instance.saveCircuitData("credentialAtomicQueryMTPV2", {
      circuitId: "credentialAtomicQueryMTPV2".toString(),
      wasm: mtp_w,
      provingKey: mtp_z,
      verificationKey: mtp_j,
    });
    await instance.saveCircuitData("credentialAtomicQuerySigV2", {
      circuitId: "credentialAtomicQuerySigV2".toString(),
      wasm: sig_w,
      provingKey: sig_z,
      verificationKey: sig_j,
    });
    console.timeEnd("CircuitStorageService.saveCircuitData");
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = this.init();
    }
    return this.instance;
  }
}
