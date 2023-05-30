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
	IndexedDBPrivateKeyStore
} from '@0xpolygonid/js-sdk';

export class WalletService {
	static async createWallet() {
		const keyStore = new IndexedDBPrivateKeyStore();
		const bjjProvider = new BjjProvider(KmsKeyType.BabyJubJub, keyStore);
		const kms = new KMS();
		kms.registerKeyProvider(KmsKeyType.BabyJubJub, bjjProvider);
		let dataStorage = {
			credential: new CredentialStorage(
				new IndexedDBDataSource(CredentialStorage.storageKey)
			),
			identity: new IdentityStorage(
				new IndexedDBDataSource(IdentityStorage.identitiesStorageKey),
				new IndexedDBDataSource(IdentityStorage.profilesStorageKey)
			),
			mt: new MerkleTreeIndexedDBStorage(40),
			states: new EthStateStorage(defaultEthConnectionConfig)

		};
		const credWallet = new CredentialWallet(dataStorage);
		let wallet = new IdentityWallet(kms, dataStorage, credWallet);

		return {
			wallet: wallet,
			credWallet: credWallet,
			kms: kms,
			dataStorage: dataStorage
		}
	}
}
