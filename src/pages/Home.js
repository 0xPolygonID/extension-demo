import React, { useEffect, useState } from 'react';
import { HeaderComponent } from '../components/app-header';
import { AccountInfo } from '../components/account-info';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
	const [accounts, setAccounts] = useState([]);
	const navigate = useNavigate();
	
	useEffect(()=> {
		window.addEventListener('storage', () => {
			console.log("Change to local storage!");
			let accounts = JSON.parse(localStorage.getItem('accounts'));
			setAccounts(accounts);

		})
		let _accounts = JSON.parse(localStorage.getItem('accounts'));
		console.log('ACCOUNTS', _accounts, _accounts.length);
		if(_accounts.length <= 0) {
			navigate('/welcome');
		} else {
			setAccounts(_accounts);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])
	
	return (
		<div>
			{ accounts.length <=0 && <p>Redirecting...</p> }
			{ accounts.length > 0 && <div>
				<HeaderComponent/>
				<AccountInfo accounts={accounts}/>
			</div>
			}
		</div>
	);
}