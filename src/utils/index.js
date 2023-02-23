import { BrowserDataStorage } from '../services';
import { RHS_URL, RPC_URL } from '../constants';

const {
	LocalStoragePrivateKeyStore,
	IdentityStorage,
	MerkleTreeLocalStorage,
	CredentialStorage,
	// W3CCredential,
	BrowserDataSource,
	BjjProvider,
	KmsKeyType,
	IdentityWallet,
	CredentialWallet,
	KMS,
	core,
	// InMemoryDataSource,
	EthStateStorage
} = window.PolygonIdSdk;

export const createAccount = async () => {
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
	// console.log(wallet);
	
	const seedPhrase = new TextEncoder().encode('seedseedseedseedseedseedseedseed');
	return await wallet.createIdentity(
		'http://metamask.com/',
		RHS_URL,
		{
			method: core.DidMethod.Iden3,
			blockchain: core.Blockchain.Polygon,
			networkId: core.NetworkId.Mumbai,
			seed: seedPhrase
		}
	);
	// console.log(did.toString());
	// return await did;
	// console.assert(did.toString() === 'did:iden3:polygon:mumbai:wzokvZ6kMoocKJuSbftdZxTD6qvayGpJb3m4FVXth');
	
};

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
export const createWallet = async () => {
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
	// console.log(wallet);
	
	const seedPhrase = new TextEncoder().encode('seedseedseedseedseedseedseedseed');
	const identity = await wallet.createIdentity(
		'http://metamask.com/',
		RHS_URL,
		{
			method: core.DidMethod.Iden3,
			blockchain: core.Blockchain.Polygon,
			networkId: core.NetworkId.Mumbai,
			seed: seedPhrase
		}
	);
	return {
		credential: identity.credential,
		did: identity.did,
		wallet: wallet,
		credWallet: credWallet,
		kms: kms,
		dataStorage: dataStorage

	}
	// console.log(did.toString());
	// return await did;
	// console.assert(did.toString() === 'did:iden3:polygon:mumbai:wzokvZ6kMoocKJuSbftdZxTD6qvayGpJb3m4FVXth');
	
};
export const hideString = (input, first = 15, second = -10) => {
	return `${input.slice(0, first)} ... ${input.slice(second)}`;
};