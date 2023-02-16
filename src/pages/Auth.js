import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Base64 } from 'js-base64';
import Button from '@mui/material/Button';
import { approveMethod } from '../services';
import FullLogo from '../ui/icons/Primary_ Logo.svg';
import { useNavigate } from 'react-router-dom';

export const Auth = ()=> {
	const navigate = useNavigate();
	const [error, setError ] = useState(null);
	const [data, setData ] = useState(null);
	const [isReady, setIsReady] = useState(true);
	const [originalUrl, setOriginalUrl ] = useState(null);
	useEffect(()=> {
		let urlData = window.location.hash.split('?i_m=')[1]
		let decodedString = Base64.decode(urlData);
		let objFromDecodedString = JSON.parse(decodedString);
		setOriginalUrl(urlData);
		setData(objFromDecodedString);
	},[])
	
	function handleClickReject() {
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
	
	return (
		<div className={'auth-wrapper'}>
			<img src={FullLogo} alt={''}/>
			<h2>Authorization</h2>
			{ data && data.type ?
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
			</div> : <div>
				<h2>Authorization method is not supported </h2>
			</div>}
		</div>
	);
}
