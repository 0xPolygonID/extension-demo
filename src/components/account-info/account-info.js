import React from 'react';
import './styles.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
export const AccountInfo = (props)=> {
	let currentAccount = props.accounts[0]
	let finalString = `${currentAccount.did.slice(0, 6)} ... ${currentAccount.did.slice(-6)}`;
	return (
		<div className={'menu-bar'}>
			<div className={'account-info'}>
				<button className="connected-status-indicator" onClick={()=>{}}>
					<div className={'color-indicator'}>
						<span className="color-indicator__inner-circle" />
					</div>
					<div className="connected-status-indicator__text">Connected</div>
				</button>
			</div>
			<div className={'selected-account'}>
				<div style={{display: 'inline'}}>
					<Tooltip disableFocusListener title="Copy to clipboard">
						<button className="selected-account__clickable" onClick={()=>{
							navigator.clipboard.writeText(currentAccount.did);
						}}>
							<div className={'selected-account__name'}>{currentAccount.name}</div>
							<div className="selected-account__address">
								{finalString}
								<div className={'selected-account__copy'}>
									<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H1H9V1H1V9H0V0ZM2 2H11V11H2V2ZM3 3H10V10H3V3Z" fill="#535a61"></path></svg>
								</div>
							</div>
						</button>
					</Tooltip>
				</div>
			</div>
			<div className={'menu-bar__account-options'}>
				<Icon component={MoreVertIcon} color={'red'} />
			</div>
		</div>
	);
}

