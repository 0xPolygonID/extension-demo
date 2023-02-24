export class LocalStorageServices {
	static getActiveAccount(){
		let allAccounts =  JSON.parse(localStorage.getItem('accounts'));
		console.log('allAccounts',allAccounts);
		
		return allAccounts.filter(acc => acc.isActive);
	}
	static getActiveAccountDid() {
		let activeAccount = LocalStorageServices.getActiveAccount();
		console.log('activeAccount', activeAccount);
		return activeAccount[0].did;
	}
}