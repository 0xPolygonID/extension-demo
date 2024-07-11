import  {proving} from '@iden3/js-jwz';
import { CircuitStorageInstance } from './CircuitStorage';
import { WalletService } from './Wallet.service';
import { defaultEthConnectionConfig, INIT } from '../constants';


import {
	ProofService,
	PlainPacker,
	ZKPPacker,
	DataPrepareHandlerFunc,
	VerificationHandlerFunc,
	PackageManager,
	EthStateStorage,
	AuthHandler,
	JWSPacker,
} from '@0xpolygonid/js-sdk';


// const { proving } = JWZ;
export class ExtensionService {
	static instanceES;
	static async init() {
		await CircuitStorageInstance.init();
		let accountInfo = await WalletService.createWallet();
		const { wallet, credWallet, dataStorage, kms } = accountInfo;
		
		const circuitStorage = CircuitStorageInstance.getCircuitStorageInstance();
		
		let proofService = new ProofService(wallet, credWallet, 
			circuitStorage, new EthStateStorage(defaultEthConnectionConfig[0]),
			{ipfsGatewayURL:"https://ipfs.io"});
		
		let packageMgr = await ExtensionService.getPackageMgr(
			await circuitStorage.loadCircuitData('authV2'),
			proofService.generateAuthV2Inputs.bind(proofService),
			proofService.verifyState.bind(proofService),
			kms
		);
		
		let authHandler = new AuthHandler(packageMgr, proofService, credWallet);
		
		if(!this.instanceCS) {
					this.instanceES = {
				packageMgr,
				proofService,
				credWallet,
				wallet,
				dataStorage,
				authHandler,
				status: INIT,
				kms
			}
		}
		console.log('Extension services has been initialized',this.instanceES);
		return this.instanceES;
	}
	static async getPackageMgr(circuitData, prepareFn, stateVerificationFn, kms){
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

		const recoveryDIDDocument = {
			resolve: async (did)  => {
				const data = await fetch(`http://localhost:8080/1.0/identifiers/${did}`)
				return data.json();
			}
		  };
		  
		const jswPacker = new JWSPacker(kms, recoveryDIDDocument);
		mgr.registerPackers([packer, plainPacker, jswPacker]);
		
		return mgr;
	}
	
	static getExtensionServiceInstance() {
		return this.instanceES;
	}
	
}
