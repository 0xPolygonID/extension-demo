const { BrowserDataSource, IdentityStorage, CredentialStorage } = window.PolygonIdSdk;
export class BrowserDataStorage {
	static instance;
	static getBrowserDaraSourceInstance() {
		if(!this.instance) {
			this.instance =  {
				identitiesStorage:new BrowserDataSource(IdentityStorage.identitiesStorageKey),
				profilesStorageKey: new BrowserDataSource(IdentityStorage.profilesStorageKey),
				credentialStorage: new BrowserDataSource(CredentialStorage.storageKey),
			}
		}
		return this.instance
	}
	
}