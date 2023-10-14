import { defaultEthConnectionConfig } from '../constants';

import {
	IdentityStorage,
	CredentialStorage,
	IndexedDBDataSource,
	BjjProvider,
	KmsKeyType,
	IdentityWallet,
	CredentialWallet,
	KMS,
	EthStateStorage,
	MerkleTreeIndexedDBStorage,
	IndexedDBPrivateKeyStore,
	CredentialStatusResolverRegistry,
	CredentialStatusType,
	RHSResolver,
	OnChainResolver,
	IssuerResolver,
	AgentResolver
} from '@0xpolygonid/js-sdk';

export class WalletService {
	static createWallet() {
		const keyStore = new IndexedDBPrivateKeyStore();
		const bjjProvider = new BjjProvider(KmsKeyType.BabyJubJub, keyStore);
		const kms = new KMS();
		kms.registerKeyProvider(KmsKeyType.BabyJubJub, bjjProvider);
		const dataStorage = {
			credential: new CredentialStorage(
				new IndexedDBDataSource(CredentialStorage.storageKey)
			),
			identity: new IdentityStorage(
				new IndexedDBDataSource(IdentityStorage.identitiesStorageKey),
				new IndexedDBDataSource(IdentityStorage.profilesStorageKey)
			),
			mt: new MerkleTreeIndexedDBStorage(40),
			states: new EthStateStorage(defaultEthConnectionConfig[0])
		};
		const resolvers = new CredentialStatusResolverRegistry();
		resolvers.register(
			CredentialStatusType.SparseMerkleTreeProof,
			new IssuerResolver()
		);
    	resolvers.register(
			CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
			new RHSResolver(dataStorage.states)
		);
		resolvers.register(
			CredentialStatusType.Iden3OnchainSparseMerkleTreeProof2023,
			new OnChainResolver(defaultEthConnectionConfig)
		);
		resolvers.register(
			CredentialStatusType.Iden3commRevocationStatusV1,
			new AgentResolver()
		);
		const credWallet = new CredentialWallet(dataStorage, resolvers);
		const idenWallet = new IdentityWallet(kms, dataStorage, credWallet);
		return { idenWallet, credWallet, kms, dataStorage };
	}
}
