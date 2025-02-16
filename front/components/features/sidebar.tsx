import {
    Box,
    List,
    ListItemButton,
    ListItemText
} from '@mui/material';
import React from 'react';
import { ListButton } from './common';

export default function Sidebar() {
    const [selectedIndex, setSelectedIndex] = React.useState(1);


    const buttons = [
        { text: "自选", index: 0 },
        { text: "个股", index: 1 },
        { text: "行情", index: 2 }
    ];
    return (
        <Box>
            <List>
                {buttons.map((button) => (
                    <ListButton
                        key={button.index}
                        text={button.text}
                        selected={selectedIndex === button.index}
                        handleOnClick={() => { setSelectedIndex(button.index)}}
                    />
                ))}
            
            </List>
        </Box>
    )
}
