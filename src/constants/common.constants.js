export const RHS_URL = '';
export const RPC_URL = '';

export const defaultEthConnectionConfig = {
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

export const INIT = 'Init';

export const identitiesStorageKey = 'identities';

export const DEFAULT_ACCOUNT_NAME = 'Polygon Account';
