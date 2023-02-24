import React from 'react';
import appLogo from '../../ui/icons/Logo.svg';
import { NetworkDropDown } from '../NetworkDropDown';
import AccountMenu from '../AccountMenu/AccountMenu';
export const HeaderComponent = ()=> {
	return (
		<div className={'app-header'}>
			<div className={'app-header-contents'}>
				<div className={'app-logo'}>
					<img src={appLogo} alt={''}/>
				</div>
				<div className={'network-section'}>
					<NetworkDropDown/>
				</div>
				<AccountMenu/>
			</div>
		</div>
	);
}