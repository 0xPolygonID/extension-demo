import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FullLogo from '../ui/icons/Primary_ Logo.svg';
import { useNavigate } from 'react-router-dom';
import { WalletService } from '../services/Wallet.service';
export const NewAccount = ()=> {
	const [input, setInput] = useState({
		account: '',
	});
	const navigate = useNavigate();
	const onInputChange = (e) => {
		const { name, value } = e.target;
		setInput(prev => ({
			...prev,
			[name]: value
		}));
	}
	function handleClickCancel(){
		navigate('/');
	}
	async function handleClickCreateAccount() {
		const { did } = await WalletService.createWallet();
		let existingAccounts = JSON.parse(localStorage.getItem("accounts"));
		
		if(existingAccounts !== null || existingAccounts.length !==0){
			existingAccounts.push({name: input.account, did: did.toString()});
			localStorage.setItem("accounts", JSON.stringify(existingAccounts));
		}
		else {
			localStorage.setItem('accounts',JSON.stringify([{name: input.account, did: did.toString()}]));
		}
		window.dispatchEvent(new Event("storage"));
		navigate('/');
	}
	return(<div className={'create-new-account'}>
		<img src={FullLogo} alt={''}/>
		<h2 style={{textAlign: 'left'}}>Create new account</h2>
		<TextField
			className={'pas-input'}
			name='account'
			id="outlined-error-helper-text"
			label="Account name"
			type="text"
			value={input.account}
			onChange={onInputChange}
		/>
		<div className={'button-section'}>
			<Button
				className={'blue-button blue-button-outlined'}
				color="primary"
				size="large"
				variant="outlined"
				onClick={handleClickCancel}
			>Cancel</Button>
			<Button
				className={'blue-button'}
				color="primary"
				size="large"
				variant="outlined"
				onClick={handleClickCreateAccount}
			>Create</Button>
		</div>
	</div>);
}