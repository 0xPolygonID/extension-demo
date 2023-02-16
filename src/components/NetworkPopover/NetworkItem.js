import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import './styles.css';
export const NetworkItem = ({data, handleClick, selectedIndex})=> {
	return(
		<div className={'network-indicator-item'} onClick={()=> handleClick(data.id)}>
			<div className={'network-check-icon'}>
				{selectedIndex === data.id && <DoneIcon color={'success'} fontSize={'small'}/> }
			</div>
			
			{data.name}
		</div>
	)
}


