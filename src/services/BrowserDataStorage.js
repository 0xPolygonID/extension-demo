const { IdentityStorage, CredentialStorage } = window.PolygonIdSdk;
export class BrowserDataStorage {
	static instance;
	static getBrowserDaraSourceInstance() {
		if(!this.instance) {
			this.instance =  {
				identitiesStorage:IdentityStorage.identitiesStorageKey,
				profilesStorageKey: IdentityStorage.profilesStorageKey,
				credentialStorage: CredentialStorage.storageKey,
			}
		}
		return this.instance
	}
	
}