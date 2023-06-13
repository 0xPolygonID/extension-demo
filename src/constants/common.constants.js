export const RHS_URL = '';
export const RPC_URL = '';

export const chainIDResolvers = Map({
	80001: ''
});

export const defaultEthConnectionConfig = {
	url: RPC_URL,
	defaultGasLimit: 600000,
	minGasPrice: '0',
	maxGasPrice: '100000000000',
	confirmationBlockCount: 5,
	confirmationTimeout: 600000,
	contractAddress: '0x66277D6E1Ad434772AF2A88de2901e3435Dbb8E6',
	receiptTimeout: 600000,
	rpcResponseTimeout: 5000,
	waitReceiptCycleTime: 30000,
	waitBlockCycleTime: 3000
};

export const INIT = 'Init';

export const DEFAULT_ACCOUNT_NAME = 'Polygon Account';
