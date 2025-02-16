import { Groups, StockGroupData, StockTableRows } from '@/types/groupStock';
import AddIcon from '@mui/icons-material/Add';
import {
    Button, Dialog, DialogActions,
    DialogContent,
    DialogTitle, Fab, Stack, TableCell,
    TextField
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';

function GroupComponent(
    {
        groupStockName,
        setGroupStockName
    }: {
        groupStockName: string,
        setGroupStockName: (groupStockName: string) => void
    }
    ) {
    const [open, setOpen] = useState(false);
    const { data: groups } = useSWR<Groups>('http://localhost:8000/api/stock/groups', fetcher)

    const handleAddGroupDialogSubmit = async (groupName: string) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/stock/group/${groupName}`,
            );
            console.log('创建成功:', response.data);
        } catch (error) {
            console.error('提交失败:', error);
        }
    };
    return (
        <Stack direction="row">
            {groups?.data?.map((group) => (
                <Button key={group.id} variant={group.name === groupStockName ? "contained" : "outlined"} onClick={() => setGroupStockName(group.name)}>
                    {group.name}
                </Button>

            ))}
            <TableRow>
                <Fab color="primary" aria-label="add" size="small" onClick={() => { setOpen(true) }}><AddIcon /> </Fab >
            </TableRow>
            <Dialog
                open={open}
                onClose={() => { setOpen(false) }}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        setOpen(false);
                        handleAddGroupDialogSubmit(formJson.group_name)
                    },
                }}

            >
                <DialogTitle>添加分组</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>请输入代码或者名称</DialogContentText> */}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="group_name"
                        name="group_name"
                        label="分组名称"
                        type="string"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">确认</Button>
                    <Button onClick={() => setOpen(false)}>取消</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}

const fetcher = (url: string) => fetch(url).then(res => res.json());
export default function StockTable() {

    const [groupStockName, setGroupStockName] = useState("自选股");
    const { data: groupStocks } = useSWR<StockGroupData>(`http://localhost:8000/api/stock/group/${groupStockName}`, fetcher)
    const [open, setOpen] = useState(false);

    const handleAddStockDialogSubmit = async (stock_iden: string) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/stock/group/${groupStockName}/${stock_iden}`,
            );
            console.log('创建成功:', response.data);
        } catch (error) {
            console.error('提交失败:', error);
        }
    };


    return (
        <>
            <GroupComponent groupStockName={groupStockName} setGroupStockName={setGroupStockName}></GroupComponent>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {StockTableRows.map((row) => (
                                <TableCell key={row}>{row}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupStocks?.data?.stock_info?.map((stock) => (
                            <TableRow key={stock.id}>

                                {Object.values(stock.realtime_data).map((value) => (
                                    <TableCell>{value}</TableCell>
                                ))}

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>
            </TableContainer>
            <TableRow>
                <Fab color="primary" aria-label="add" size="small" onClick={() => { setOpen(true)}}><AddIcon/> </Fab >
            </TableRow>
            <Dialog
                open={open}
                onClose={() => { setOpen(false) }}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        setOpen(false);
                        handleAddStockDialogSubmit(formJson.stock_iden)
                    },
                }}

            >
                <DialogTitle>添加分组</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>请输入代码或者名称</DialogContentText> */}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="group_name"
                        name="group_name"
                        label="分组名称"
                        type="string"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">确认</Button>
                    <Button onClick={() => setOpen(false)}>取消</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}