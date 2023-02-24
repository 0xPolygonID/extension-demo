import { BrowserDataStorage } from './BrowserDataStorage';
import { defaultEthConnectionConfig } from '../constants';

const {
	LocalStoragePrivateKeyStore,
	IdentityStorage,
	MerkleTreeLocalStorage,
	CredentialStorage,
	BrowserDataSource,
	BjjProvider,
	KmsKeyType,
	IdentityWallet,
	CredentialWallet,
	KMS,
	EthStateStorage
} = window.PolygonIdSdk;

export class WalletService {
	static async createWallet() {
		const keyStore = new LocalStoragePrivateKeyStore();
		const bjjProvider = new BjjProvider(KmsKeyType.BabyJubJub, keyStore);
		const kms = new KMS();
		kms.registerKeyProvider(KmsKeyType.BabyJubJub, bjjProvider);
		
		let dataStorage = {
			credential: new CredentialStorage(
				new BrowserDataSource(BrowserDataStorage.getBrowserDaraSourceInstance().credentialStorage)
			),
			identity: new IdentityStorage(
				new BrowserDataSource(BrowserDataStorage.getBrowserDaraSourceInstance().identitiesStorage),
				new BrowserDataSource(BrowserDataStorage.getBrowserDaraSourceInstance().profilesStorageKey)
			),
			// credential: new CredentialStorage(new InMemoryDataSource()),
			// identity: new IdentityStorage(
			// 	new InMemoryDataSource(),
			// 	new InMemoryDataSource()
			// ),
			mt: new MerkleTreeLocalStorage(40),
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