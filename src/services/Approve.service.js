import { createWallet } from '../utils';
import * as JWZ from '@iden3/js-jwz/dist/esm_esbuild/index';
import { Base64 } from 'js-base64';
import axios from 'axios';
import { RPC_URL } from '../constants';

const {
	IdentityWallet,
	CredentialWallet,
	ProofService,
	CircuitStorage,
	InMemoryDataSource,
	PlainPacker,
	ZKPPacker,
	AuthHandler,
	DataPrepareHandlerFunc,
	VerificationHandlerFunc,
	PackageManager,
	EthStateStorage,
} = window.IdenPolygonIdSdk;

const { proving } = JWZ;

const defaultEthConnectionConfig = {
	url: RPC_URL,
	defaultGasLimit: 600000,
	minGasPrice: '0',
	maxGasPrice: '100000000000',
	confirmationBlockCount: 5,
	confirmationTimeout: 600000,
	contractAddress: '0x134B1BE34911E39A8397ec6289782989729807a4',
	receiptTimeout: 600000,
	rpcResponseTimeout: 5000,
	waitReceiptCycleTime: 30000,
	waitBlockCycleTime: 3000
};

/*
const mockStateStorage = {
	getLatestStateById: async () => {
	},
	publishState: async () => {
		return '';
	},
	getGISTProof: Promise => {
		return Promise.resolve({
			root: 0n,
			existence: false,
			siblings: [],
			index: 0n,
			value: 0n,
			auxExistence: false,
			auxIndex: 0n,
			auxValue: 0n
		});
	},
	getGISTRootInfo: Promise => {
		return Promise.resolve({
			root: 0n,
			replacedByRoot: 0n,
			createdAtTimestamp: 0n,
			replacedAtTimestamp: 0n,
			createdAtBlock: 0n,
			replacedAtBlock: 0n
		});
	}
};
*/

export async function approveMethod(urlParam) {
	const f1 = await fetch('./circuit.wasm')
		.then(response => response.arrayBuffer())
		.then(buffer => new Uint8Array( buffer ))
	const f2 = await fetch('./circuit_final.zkey')
		.then(response => response.arrayBuffer())
		.then(buffer => new Uint8Array( buffer ))
	const f3 = await fetch('./verification_key.json')
		.then(response => response.arrayBuffer())
		.then(buffer => new Uint8Array( buffer ))
	const getPackageMgr = async (circuitData, prepareFn, stateVerificationFn) => {
		const authInputsHandler = new DataPrepareHandlerFunc(prepareFn);
		const verificationFn = new VerificationHandlerFunc(stateVerificationFn);
		const mapKey = proving.provingMethodGroth16AuthV2Instance.methodAlg.toString();
		const verificationParamMap = new Map([
			[
				mapKey,
				{
					key: circuitData.verificationKey,
					verificationFn
				}
			]
		]);
		
		const provingParamMap = new Map();
		provingParamMap.set(mapKey, {
			dataPreparer: authInputsHandler,
			provingKey: circuitData.provingKey,
			wasm: circuitData.wasm
		});
		
		const mgr = new PackageManager();
		const packer = new ZKPPacker(provingParamMap, verificationParamMap);
		const plainPacker = new PlainPacker();
		mgr.registerPackers([packer, plainPacker]);
		
		return mgr;
	};
	let accountInfo = await createWallet();
	const { dataStorage, did, kms } = accountInfo;
	
	let circuitStorage = new CircuitStorage(new InMemoryDataSource());
	await circuitStorage.saveCircuitData('authV2', {
		circuitId: 'authV2'.toString(),
		wasm: f1,
		provingKey: f2,
		verificationKey: f3
	});
	
	let credWallet = new CredentialWallet(dataStorage);
	let idWallet = new IdentityWallet(kms, dataStorage, credWallet);
	
	let proofService = new ProofService(idWallet, credWallet, circuitStorage, new EthStateStorage(defaultEthConnectionConfig));
	let packageMgr = await getPackageMgr(
		await circuitStorage.loadCircuitData('authV2'),
		proofService.generateAuthV2Inputs.bind(proofService),
		proofService.verifyState.bind(proofService)
	);
	let authHandler = new AuthHandler(packageMgr, proofService);

	let byteEncoder = new TextEncoder()
	const msgBytes = byteEncoder.encode(Base64.decode(urlParam));
	const authRes = await authHandler.handleAuthorizationRequest(did, msgBytes);
	
	console.log(authRes);
	
	return await axios.post(`${authRes.authRequest.body.callbackUrl}`,authRes.token)
		.then(response=>response)
		.catch(error=>error.toJSON())
	// return did;
}