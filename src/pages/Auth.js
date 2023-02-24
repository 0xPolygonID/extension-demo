import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Base64 } from 'js-base64';
import Button from '@mui/material/Button';
import { approveMethod, receiveMethod } from '../services';
import FullLogo from '../ui/icons/Primary_ Logo.svg';
import { useNavigate } from 'react-router-dom';
import { ExtensionService } from '../services/Extension.service';
export const Auth = ()=> {
	const navigate = useNavigate();
	const [error, setError ] = useState(null);
	const [pageType, setPageType ] = useState('');
	const [data, setData ] = useState(null);
	const [isReady, setIsReady] = useState(true);
	const [originalUrl, setOriginalUrl ] = useState(null);
	
	useEffect(()=> {
		const fetchData = async () => {
			const {packageMgr} =  await ExtensionService.init();
			let urlData = window.location.hash.split('?i_m=')[1]
			let decodedString = Base64.decode(urlData);
		    const { unpackedMessage }  = await packageMgr.unpack(new TextEncoder().encode(decodedString));
			console.log('unpackedMessage',unpackedMessage);
			setOriginalUrl(urlData);
			setData(unpackedMessage);
			if(unpackedMessage.type.includes('request'))
				setPageType('auth');
			if(unpackedMessage.type.includes('offer'))
				setPageType('offer');
		};
		
		fetchData()
			.catch(console.error);
		
		
	},[])
	
	async function handleClickReject() {
		navigate('/');
	}
	async function handleClickApprove() {
		setIsReady(false);
		let result = await approveMethod(originalUrl);
		if(result.code !== 'ERR_NETWORK')
			navigate('/');
		else{
			setError(result.message)
			setIsReady(true);
		}
	}
	
	async function handleClickReceive(){
		setIsReady(false);
		let result = await receiveMethod(originalUrl).catch(error=>setError(error));
		if(result === 'SAVED')
			navigate('/');
	}
	
	return (
		<div className={'auth-wrapper'}>
			<img src={FullLogo} alt={''}/>
			<h2>{pageType && pageType === 'auth' ? 'Authorization' : 'Receive Claim'}</h2>
			{ pageType && pageType === 'auth' &&
				<div>
					<p className={'reason'}>Reason : {data.body.reason}</p>
					<p className={'from'}>From : {data.from}</p>
					<div className={'button-section'}>
						<Button
							className={'blue-button'}
							color="primary"
							size="medium"
							variant="outlined"
							onClick={handleClickApprove}
						>Approve</Button>
						<Button
							className={'blue-button blue-button-outlined'}
							color="primary"
							size="medium"
							variant="outlined"
							onClick={handleClickReject}
						>Reject</Button>
					</div>
					<div className={'progress'}>
						{!isReady && <CircularProgress />}
						{error && <p style={{color:'red'}}>{error}</p>}
					</div>
			</div> }
			{ pageType && pageType === 'offer' &&
				<div>
					<p className={'from'}>From : {data.from}</p>
					<h3>Credentails:</h3>
					{data.body.credentials.map(cred=> (
						<div style={{border: '1px solid black',borderRadius: '10px', padding: '5px'}}>
							<p>{cred.description}</p>
							<p>{cred.id}</p>
						</div>
					))}
					<div className={'button-section'}>
						<Button
							className={'blue-button'}
							color="primary"
							size="medium"
							variant="outlined"
							onClick={handleClickReceive}
						>Receive</Button>
						<Button
							className={'blue-button blue-button-outlined'}
							color="primary"
							size="medium"
							variant="outlined"
							onClick={handleClickReject}
						>Decline</Button>
					</div>
					<div className={'progress'}>
						{!isReady && <CircularProgress />}
						{error && <p style={{color:'red'}}>{error}</p>}
					</div>
				</div> }
		</div>
	);
}
