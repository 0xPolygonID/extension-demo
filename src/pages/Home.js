import React, { useEffect } from 'react';
import { HeaderComponent } from '../components/app-header';
import { AccountInfo } from '../components/account-info';
import { CredentialsInfo } from '../components/credentials';
import { useNavigate } from 'react-router-dom';
export const Home = (props) => {
	const navigate = useNavigate();
	let _accounts = props.account.toString();
	
	useEffect(()=> {
		if(!props.account)
			navigate('/welcome');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])
	
	
	return (
		 <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
			<HeaderComponent account={_accounts} />
			<AccountInfo account={_accounts}/>
			<CredentialsInfo account={_accounts}/>
		</div>
	);
}