import React, { useEffect } from 'react';
import { HeaderComponent } from '../components/app-header';
import { AccountInfo } from '../components/account-info';
import { useNavigate } from 'react-router-dom';
import { CircuitStorageInstance } from '../services';
export const Home = (props) => {
	const navigate = useNavigate();
	let _accounts = props.account.toString();
	
	useEffect(()=> {
		if(!props.account)
			navigate('/welcome');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])
	
	
	return (
		 <div>
			<HeaderComponent account={_accounts} />
			<AccountInfo account={_accounts}/>
			 <button onClick={()=> {console.log(CircuitStorageInstance.getCircuitStorageInstance())}}> test</button>
		</div>
	);
}