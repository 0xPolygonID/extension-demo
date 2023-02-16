import React from 'react';
import { NetworkItem } from './NetworkItem';
import './styles.css';
export const NetworkPopover = (props) => {
	function onItemClick(id){
		props.handleitemClick(id);
	}
	return (
		<div className={'network-dropdown-header'}>
			<div className={'network-dropdown-title'}>Networks</div>
			<div className={'network-dropdown-content'}>
				{props.options.map((network, index)=> <NetworkItem data={network} selectedIndex={props.selectedIndex} handleClick={onItemClick} key={index}/>)}
			</div>
		</div>);
}