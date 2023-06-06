import React, { useEffect, useState } from "react";
import { HeaderWrapper, ModelHeader, BottomLine } from "./User.styles";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_USERS, LOAD_ASSESSMENTS_ADMIN, UPDATE_USERSUBSCRIPTION } from "../../query";
import DataTable from "../DataTable/DataTable";
import MenuData from "../MenuData/Menudata";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DropdownAssessment from "../Dropdown/DropdownAssessment";
import DialogBox from "../DialogBox/DialogBox";
import Typography from "@mui/material/Typography";
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

    const {
        data: usersData,
        loading: isLoading,
        error
    } = useQuery(GET_ALL_USERS);

    const {
        data: allAssessmentData,
        loading,
    } = useQuery(LOAD_ASSESSMENTS_ADMIN);

    const [
        updateUser,
        {data: updateUserData, error: updateUserError, updateLoading}
     ] = useMutation(UPDATE_USERSUBSCRIPTION);

    useEffect(() => {
        if (usersData?.getAllUser?.length > 0) {

            const rows = [];

            usersData?.getAllUser.forEach((allUser) => {

                const options = {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                };

                const date = new Date(allUser.birthDate)
                const formattedBirthDate = date.toLocaleString('en-US', options);

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
        {
            id: "action",
            label: "Action",
            minWidth: 170,
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

    function createData(id, firstname, lastname, email, birthdate, state, country, pincode) {

        const more = <MenuData id={id} handleDialogOpen={handleDialogOpen} optionList={optionList} />;
        return { id, firstname, lastname, email, birthdate, state, country, pincode, action: more };
    }

    const assessementTitle = allAssessmentData?.getAllAssessmentsForAdmin?.filter(current => assessmentId.includes(current?._id))?.map(curdata => curdata?.name);

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
                <DataTable rows={allUserData} columns={columns} />
                <DialogBox
                    open={openDialog}
                    onClose={handleDialogClose}
                    content={modalContent}
                />
            </>)}
        </>
    );
}