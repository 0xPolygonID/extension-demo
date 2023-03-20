import * as JWZ from '@iden3/js-jwz/dist/esm_esbuild/index';
import { CircuitStorageInstance } from './CircuitStorage';
import { WalletService } from './Wallet.service';
import { defaultEthConnectionConfig, INIT } from '../constants';


const {
	ProofService,
	PlainPacker,
	ZKPPacker,
	DataPrepareHandlerFunc,
	VerificationHandlerFunc,
	PackageManager,
	EthStateStorage,
	AuthHandler,
} = window.PolygonIdSdk;


const { proving } = JWZ;
export class ExtensionService {
	static instanceES;
	static async init() {
		await CircuitStorageInstance.init();
		let accountInfo = await WalletService.createWallet();
		const { wallet, credWallet, dataStorage } = accountInfo;
		
		const circuitStorage = CircuitStorageInstance.getCircuitStorageInstance();
		
		let proofService = new ProofService(wallet, credWallet, circuitStorage, new EthStateStorage(defaultEthConnectionConfig));
		
		let packageMgr = await ExtensionService.getPackageMgr(
			await circuitStorage.loadCircuitData('authV2'),
			proofService.generateAuthV2Inputs.bind(proofService),
			proofService.verifyState.bind(proofService)
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
			}
		}
		console.log('Extension services has been initialized',this.instanceES);
		return this.instanceES;
	}
	static async getPackageMgr(circuitData, prepareFn, stateVerificationFn){
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
	}
	
	static getExtensionServiceInstance() {
		return this.instanceES;
	}
	
}
