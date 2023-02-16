import React, { useState } from 'react';
import { createAccount } from '../utils';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FullLogo from '../ui/icons/Primary_ Logo.svg';
import { useNavigate } from 'react-router-dom';
export const NewAccount = ()=> {
	const [input, setInput] = useState({
		account: '',
	});
	const navigate = useNavigate();
	const onInputChange = (e,val) => {
		const { name, value } = e.target;
		setInput(prev => ({
			...prev,
			[name]: value
		}));
	}
	function handleClickCancel(){
		navigate('/');
	}
	function handleClickCreateAccount() {
		createAccount().then(result=> {
			let existingAccounts = JSON.parse(localStorage.getItem("accounts"));
			if(existingAccounts !== null || existingAccounts.length !==0){
				existingAccounts.push({name: input.account, did: result.did.toString()});
				localStorage.setItem("accounts", JSON.stringify(existingAccounts));
			}
			else {
				localStorage.setItem('accounts',JSON.stringify([{name: input.account, did: result.did.toString()}]));
			}
			window.dispatchEvent(new Event("storage"));
			navigate('/');
		});
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