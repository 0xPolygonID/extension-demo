import { BrowserDataStorage } from './BrowserDataStorage';
import { RHS_URL, defaultEthConnectionConfig } from '../constants';

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
	core,
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
		
		const seedPhrase = new TextEncoder().encode('seedseedseedseedseedseedseedseed');
		const identity = await wallet.createIdentity(
			'http://polygonID.com/',
			RHS_URL,
			{
				method: core.DidMethod.Iden3,
				blockchain: core.Blockchain.Polygon,
				networkId: core.NetworkId.Mumbai,
				seed: seedPhrase,
				rhsUrl: RHS_URL
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
		// test="iden3comm://?i_m=eyJpZCI6ImQwMjI2NjY3LWE0NmUtNGU1Ni05N2M4LWEyYzU4M2JmNzllMSIsInR5cCI6ImFwcGxpY2F0aW9uL2lkZW4zY29tbS1wbGFpbi1qc29uIiwidHlwZSI6Imh0dHBzOi8vaWRlbjMtY29tbXVuaWNhdGlvbi5pby9jcmVkZW50aWFscy8xLjAvb2ZmZXIiLCJ0aGlkIjoiZDAyMjY2NjctYTQ2ZS00ZTU2LTk3YzgtYTJjNTgzYmY3OWUxIiwiYm9keSI6eyJ1cmwiOiJodHRwOi8vNTIuMjEzLjIzOC4xNTkvYXBpL3YxL2FnZW50IiwiY3JlZGVudGlhbHMiOlt7ImlkIjoiNjg4MDkyY2YtYjI4ZS0xMWVkLWE1MWItMDI0MmFjMTcwMDA3IiwiZGVzY3JpcHRpb24iOiJLWUNBZ2VDcmVkZW50aWFsIn1dfSwiZnJvbSI6ImRpZDpwb2x5Z29uaWQ6cG9seWdvbjptdW1iYWk6MnFIU0hCR1dHSjY4QW9zTUtjTENUcDhGWWRWcnRZRTZNdE5IaHE4eHBLIiwidG8iOiJkaWQ6aWRlbjM6cG9seWdvbjptdW1iYWk6d3pva3ZaNmtNb29jS0p1U2JmdGRaeFRENnF2YXlHcEpiM200RlZYdGgifQ=="
	}
}