import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import PersonIcon from '@mui/icons-material/Person';
import DataTable from '../DataTable/DataTable';
import { CreateButton, HeaderWrapper, BottomLine, ModelHeader } from './MainDrawer.styles';
import SearchBar from '../SearchBar/SearchBar';
import DialogBox from '../DialogBox/DialogBox';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { read } from 'xlsx';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    p: 4,
    display: "flex",
    flexDirection: "column",
    borderRadius: "2%",
};
const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: 'rgba(1, 49, 113, 1)',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
        '& .sticky-item': {
            position: 'absolute',
            width: '100%',
            bottom: 0,
        }
    }),
);

export default function MainDrawer() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    // const [file, setFile] = useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const csvRef = React.useRef();
    const docRef = React.useRef();
    const [fileinput, setFileInput] = React.useState('');

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                const data = event.target.result;
                const workbook = read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const headers = {};
                const rows = [];

                for (const cell in worksheet) {
                    if (cell[0] === '!') continue;
                    const col = cell.substring(0, 1);
                    const row = parseInt(cell.substring(1));
                    const value = worksheet[cell].v;

                    if (row === 1) {
                        headers[col] = value;
                        continue;
                    }

                    if (!rows[row]) rows[row] = {};
                    rows[row][headers[col]] = value;
                }

                resolve(rows);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };

            fileReader.readAsBinaryString(file);
        });
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        readFile(file)
            .then((rows) => {
                console.log(rows);

                const questionsArray = [];
                for (let i = 0; i < rows?.length; i++) {
                    let optionsArray = [];
                    const obj = rows[i];
                    if (obj !== null && obj !== undefined && obj !== '' && obj !== {}) {
                        for (let key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                if (key.startsWith('option')) {
                                    optionsArray.push(obj[key]);
                                }
                            }
                        }
                        questionsArray.push({
                            options: optionsArray,
                            questionInstruction: obj.questionInstruction,
                            correctAnswer: obj.correctAnswer,
                        })
                    }
                }
                console.log({ questionsArray })
            })
            .catch((error) => {
                console.error(error);
            });
    }


    const IconsArray = [<DashboardIcon />, <AssessmentIcon />, <GroupIcon />, <SettingsSuggestIcon />]
    // console.log({ file })
    const modalContent = <Box sx={style}>
        <ModelHeader>
            <Typography variant="h6" component="h2" style={{ color: "#163356", fontSize: '22px', fontWeight: '600' }}>
                Assignment
            </Typography>
            <CloseIcon onClick={handleDialogClose} style={{ cursor: 'pointer' }} />
        </ModelHeader>
        <BottomLine />
        <Typography sx={{ mt: 2 }} style={{ color: "#000000", fontWeight: "600", fontSize: '14px' }}>
            Assignment Title
        </Typography>
        <TextField
            margin="normal"
            fullWidth
            id="title"
            label="Enter Title"
            autoFocus
            size="small"
        />
        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ color: "#000000", fontWeight: "600", fontSize: '14px' }}>
            Assignment csv
            <Button
                variant="contained"
                color="grey"
                onClick={() => csvRef.current.click()}
                style={{ marginLeft: "15px", color: "#000000", fontWeight: "600", fontSize: '14px' }}
            >
                upload
                <input
                    ref={csvRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                />
            </Button>
        </Typography>

        <Typography sx={{ mt: 2 }} style={{ color: "#000000", fontWeight: "600", fontSize: '14px' }}>
            Extra Document
            <Button
                variant="contained"
                color="grey"
                onClick={() => docRef.current.click()}
                style={{ marginLeft: "15px", color: "#000000", fontWeight: "600", fontSize: '14px' }}
            >
                upload
            </Button>
            <input
                ref={docRef}
                type="file"
                style={{ display: 'none' }}
            // onChange={(e) => {
            //     if (e?.target.files?.length) setFile(e?.target.files[0]);
            // }}
            />
        </Typography>
        <Button variant="contained"
            color="primary"
            style={{ alignSelf: "end" }}
        >
            Submit</Button>
    </Box>

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        NDT Quality Tests
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {['Dashboard', 'Assessment', 'Users', 'System Settings'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {IconsArray[index]}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <List
                    className='sticky-item'
                >
                    {['Admin', 'Logout'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {index % 2 === 0 ? <PersonIcon /> : <LogoutIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <HeaderWrapper>
                    Assessments List
                    <Button className="create-button" variant="contained" onClick={handleDialogOpen} >Create Assessment</Button>
                </HeaderWrapper>
                <DialogBox open={openDialog} onClose={handleDialogClose} content={modalContent} />
                <CreateButton>
                    <SearchBar />
                </CreateButton>
                <DataTable />
            </Box>
        </Box>
    );
} 