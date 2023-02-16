import React from 'react';
import Chip from '@mui/material/Chip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Popover from '@mui/material/Popover';
import { NetworkPopover } from '../NetworkPopover';

const options = [
	{name: 'Polygon mumbai', status: 'active', id: 1},
];

 export const NetworkDropDown =()=> {
	 const [anchorEl, setAnchorEl] = React.useState(null);
	 const [selectedIndex, setSelectedIndex] = React.useState(1);
	 const open = Boolean(anchorEl);
	 const id = open ? 'simple-popover' : undefined;
	 const handleOpenNetwork = (event)=>{
		 setAnchorEl(event.currentTarget);
	 }
	 const handleClose = () => {
		 setAnchorEl(null);
	 };
	
	 const itemClick = (itemId) => {
		 setSelectedIndex(itemId);
	 }
	 const getSelectedItem = ()=> {
		 let item = options.find(item=> item.id === selectedIndex);
		 return item.name;
	 }
	 return (
		 <div>
			 <Chip
				 className={'network-display'}
				 variant="outlined"
				 deleteIcon={<KeyboardArrowDownIcon />}
				 onDelete={handleOpenNetwork}
				 avatar={<div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'green'}}> </div>}
				 label={getSelectedItem()}
			 >
			 </Chip>
			 <Popover
				 id={id}
				 open={open}
				 anchorEl={anchorEl}
				 onClose={handleClose}
				 anchorOrigin={{
					 vertical: 'bottom',
					 horizontal: 'left',
				 }}
				 transformOrigin={{
					 vertical: 'top',
					 horizontal: 'center',
				 }}
			 >
				 <NetworkPopover options={options} selectedIndex={selectedIndex} handleitemClick={itemClick}/>
			 </Popover>
		 </div>
	 );
 }
