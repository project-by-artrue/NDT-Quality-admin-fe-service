import React, { useEffect, useState } from "react";
import { HeaderWrapper, ModelHeader, BottomLine, CreateButton } from "./User.styles";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_USERS, LOAD_ASSESSMENTS_ADMIN, UPDATE_USERSUBSCRIPTION } from "../../query";
import DataTable from "../DataTable/DataTable";
import MenuData from "../MenuData/Menudata";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TextField, IconButton, Select, MenuItem, InputLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DropdownAssessment from "../Dropdown/DropdownAssessment";
import DialogBox from "../DialogBox/DialogBox";
import Typography from "@mui/material/Typography";
import { Search } from '@mui/icons-material';
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    p: 4,
    display: "flex",
    flexDirection: "column",
    borderRadius: "2%",
};

export default function User() {
    const [allUserData, setAllUserData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [assessmentId, setAssessmentId] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [sortType, setSortType] = useState('ASC'); 
    const [sortField, setSortField] = useState("")
    const {
        data: usersData,
        loading: isLoading,
        error
    } = useQuery(GET_ALL_USERS);

    const {
        data: allAssessmentData,
        loading,
    } = useQuery(LOAD_ASSESSMENTS_ADMIN);

    const handleChangeField =(e)=> {
        setSortField(e.target.value)
    }

    const [
        updateUser,
        {data: updateUserData, error: updateUserError, updateLoading}
     ] = useMutation(UPDATE_USERSUBSCRIPTION);

    const sort = (data) => {

        const rows = [];

        data.forEach((allUser) => {

            const options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };

            const birthDate = new Date(allUser.birthDate)
            const userCreat = new Date(allUser.createdAt)
            const formattedBirthDate = birthDate.toLocaleString('en-US', options);
            const createdAt = userCreat.toLocaleString('en-US', options);
            rows.push(
                createData(
                    allUser._id,
                    allUser.firstName,
                    allUser.lastName,
                    allUser.email,
                    formattedBirthDate,
                    allUser.state,
                    allUser.country,
                    allUser.pinCode,
                    createdAt,
                    allUser.subscribedAssessment
                )
            );
        });
        setAllUserData(rows)
    }
    const handleSort = (e) =>{
        const data = [...usersData?.getAllUser]
        if(sortField === "date"){
            if (sortType === "ASC") {
                data.sort(function (a, b) {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
                sort(data)
            } else {
                data.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                sort(data)
            }
        }
        if (sortField === "name"){
            if (sortType === "ASC") {
                data.sort(function (a, b) {
                    return a.firstName.localeCompare(b.firstName)
                });
                sort(data)
            } else {
                data.sort((a, b) => {
                    return b.firstName.localeCompare(a.firstName)
                });
                sort(data)
            }
        }
        
    }
    useEffect(()=>{
        if (sortField.length > 0){
            handleSort()
        }
    },[sortField,sortType])
   
    useEffect(() => {
        if (usersData?.getAllUser?.length > 0) {

            const rows = [];

            usersData?.getAllUser.forEach((allUser) => {

                const options = {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                };

                const birthDate = new Date(allUser.birthDate)
                const userCreat = new Date(allUser.createdAt)
                const formattedBirthDate = birthDate.toLocaleString('en-US', options);
                const createdAt = userCreat.toLocaleString('en-US', options);
                rows.push(
                    createData(
                        allUser._id,
                        allUser.firstName,
                        allUser.lastName,
                        allUser.email,
                        formattedBirthDate,
                        allUser.state,
                        allUser.country,
                        allUser.pinCode,
                        createdAt,
                        allUser.subscribedAssessment
                    )
                );
            });
            setAllUserData(rows)
        }

    }, [usersData]);

    const columns = [
        { id: "firstname", label: "FirstName", minWidth: 170 },
        { id: "lastname", label: "LastName", minWidth: 170 },
        { id: "email", label: "Email", minWidth: 170 },
        { id: "birthdate", label: "BirthDate", minWidth: 170 },
        { id: "state", label: "State", minWidth: 170 },
        { id: "country", label: "Country", minWidth: 170 },
        { id: "pincode", label: "PinCode", minWidth: 70 },
        { id: "createdat", label: "Created At", minWidth: 140, align: "center", },
        {
            id: "action",
            label: "Action",
            minWidth: 70,
            align: "right",
            format: (value) => value.toFixed(2),
        },
    ];

    const handleDialogOpen = ({ name }, id, setAnchorEl) => {
        if (name === "Edit") {
            setAnchorEl(null);
            setOpenDialog(true);
            const newValue = usersData?.getAllUser.find(
                (user) => user._id === String(id)
            );
            setUserId(newValue._id);
            setFirstName(newValue.firstName);
            setLastName(newValue.lastName);
            setAssessmentId(newValue.subscribedAssessment);
        }
    }
    const handleChangeSortType = () => {
        setSortType((prev) => prev === "ASC" ? "DES" : "ASC")
    }
    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    async function handleUserUpdate() {
        await updateUser(
            {
                variables: {
                    updateUserViaAdminInput: {
                        id: String(userId),
                        subscribedAssessment: assessmentId,
                    }
                }
            }).then((data) => {
                handleDialogClose()
                if (data) {
                    toast.success("User Assessment updated successfully.")
                    setUserId('')
                    setAssessmentId('')
                }
            })
    }

    const optionList = [
        {
            name: "Edit",
        },
    ];

    function createData(id, firstname, lastname, email, birthdate, state, country, pincode, createdat) {

        const more = <MenuData id={id} handleDialogOpen={handleDialogOpen} optionList={optionList} />;
        return { id, firstname, lastname, email, birthdate, state, country, pincode, createdat, action: more };
    }

    const assessementTitle = allAssessmentData?.getAllAssessmentsForAdmin?.filter(current => assessmentId.includes(current?._id))?.map(curdata => curdata?.name);

    let fillterUserData = allUserData?.filter(users => {
        // if search is empty and if "all" or nothing is selected return the entire array
        if (name === "") {
            return users
            // if the filter is not selected, return whats included with the search term 
        } else if (users.firstname.toLowerCase().includes(name.toLowerCase())) {
            return users
        }
    })
    const modalContent = (
        <Box sx={style}>
            <ModelHeader>
                <Typography
                    variant="h6"
                    component="h2"
                    style={{ color: "#163356", fontSize: "22px", fontWeight: "600" }}
                >
                    User Details
                </Typography>
                <CloseIcon onClick={handleDialogClose} style={{ cursor: "pointer" }} />
            </ModelHeader>
            <BottomLine />
            <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                    sx={{ mt: 2 }}
                    style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
                >
                    Name
                </Typography>
                <TextField
                    margin="normal"
                    id="time"
                    size="small"
                    value={firstName + lastName}
                    disabled
                    sx={{ width: "50%", ml: "89px" }}
                />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                    sx={{ mt: 2 }}
                    style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
                >
                    Subscription
                </Typography>
                <div style={{ width: "40%", marginLeft: "41px" }}>
                    <DropdownAssessment
                        items={allAssessmentData?.getAllAssessmentsForAdmin}
                        setSelection={setAssessmentId}
                        selectedItem={assessmentId}
                        itemsTitle={assessementTitle}
                    />
                </div>
            </div>
            <Button
                variant="contained"
                color="primary"
                style={{ alignSelf: "end" }}
                onClick={handleUserUpdate}
            >
                Update
            </Button>
        </Box>
    );

    return (
        <>
            {isLoading ? (<Loader isLoading={isLoading} />) : (<>
                <HeaderWrapper>
                    <h4>Users Details</h4>
                </HeaderWrapper>
                <CreateButton>
                    <TextField
                        variant="outlined"
                        placeholder="Search by User Name"
                        style={{
                            width: '100%',
                            maxWidth: '500px'
                        }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton>
                                    <Search />
                                </IconButton>
                            )
                        }}
                    />
                    <div style={{display:"flex", justifyItems:"center", alignItems:"center", gap:"10px", cursor:"pointer"}} >
                        <div style={{border : "1px solid black", padding:"0px 3px", borderRadius:"10px"}} onClick={handleChangeSortType}>
                            {sortType === "ASC" ? <div style={{ width: "30px"}}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                            </svg>
                            </div> : <div style={{ width: "30px" }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                            </svg>
                        </div>}
                        </div>
                        <Select
                            name="country"
                            value={sortField}
                            onChange={handleChangeField}
                            displayEmpty
                            fullWidth
                            sx={{height:"40px"}}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem disabled value="">
                               Select Sort Field
                            </MenuItem>
                            <MenuItem value="name" selected>Name</MenuItem>
                            <MenuItem value="date" selected>Date</MenuItem>
                        </Select>
                    </div>
                </CreateButton>
                <DataTable rows={fillterUserData} columns={columns} />
                <DialogBox
                    open={openDialog}
                    onClose={handleDialogClose}
                    content={modalContent}
                />
            </>)}
        </>
    );
}