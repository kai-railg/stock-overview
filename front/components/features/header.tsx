import { AppBar, Box, Button, Toolbar } from "@mui/material"

export default function Header() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit">自选</Button>
                    <Button color="inherit">发现</Button>
                    <Button color="inherit">搜索</Button>
                </Toolbar>
            </AppBar>
        </Box>

    )
}