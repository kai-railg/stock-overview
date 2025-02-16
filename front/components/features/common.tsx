import { ListItemButton, ListItemText } from "@mui/material"
export function ListButton(
    { text, selected, handleOnClick }:
        {
            text: string,
            selected: boolean,
            handleOnClick: () => void
        }) {
    return (
        <ListItemButton
            selected={selected}
            onClick={() => handleOnClick()}>
            {/* <ListItemIcon>
                <InboxIcon />
            </ListItemIcon> */}
            <ListItemText primary={text} />
        </ListItemButton>
    )
}
