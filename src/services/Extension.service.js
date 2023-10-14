import * as JWZ from '@iden3/js-jwz/dist/esm_esbuild/index';
import { CircuitStorageService } from "./CircuitStorage";
import { WalletService } from './Wallet.service';
import { defaultEthConnectionConfig } from '../constants';


import {
	ProofService,
	PlainPacker,
	ZKPPacker,
	DataPrepareHandlerFunc,
	VerificationHandlerFunc,
	PackageManager,
	EthStateStorage,
	AuthHandler,
} from '@0xpolygonid/js-sdk';

export class ExtensionService {
	static instance;
	
	static async init() {
		const circuitStorage = await CircuitStorageService.getInstance();
		const { idenWallet, credWallet, dataStorage } = WalletService.createWallet();
		const proofService = new ProofService(
			idenWallet,
			credWallet,
			circuitStorage,
			new EthStateStorage(defaultEthConnectionConfig[0]),
			{ ipfsGatewayURL: "https://ipfs.io" }
		);
		const packageMgr = await ExtensionService.getPackageMgr(
			await circuitStorage.loadCircuitData("authV2"),
			proofService.generateAuthV2Inputs.bind(proofService),
			proofService.verifyState.bind(proofService)
		);
		const authHandler = new AuthHandler(packageMgr, proofService, credWallet);
		const instance = {
      packageMgr,
      proofService,
      idenWallet,
      credWallet,
      dataStorage,
      authHandler,
    };
		console.log('Extension services has been initialized', instance);
		return instance;
	}

	static async getPackageMgr(circuitData, prepareFn, stateVerificationFn){
		const authInputsHandler = new DataPrepareHandlerFunc(prepareFn);
		const verificationFn = new VerificationHandlerFunc(stateVerificationFn);
		const mapKey = JWZ.proving.provingMethodGroth16AuthV2Instance.methodAlg.toString();
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
	
	static getInstance() {
		if (!this.instance) {
			this.instance = this.init();
		};
		return this.instance;
	}
	
}
