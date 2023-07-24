import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { GetAllUserAssessmentSession } from '../../query';
import DataTable from "../DataTable/DataTable";
import { IconButton, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { CreateButton } from '../AssessmentCreation/AssessmentCreation.styles';
import { HeaderWrapper } from '../DocumentListing/DocumentListing.styles';
const UserSession = () => {
    const [search, setSearch] = useState("")
    const columns = [
        { id: "firstName", label: "First Name", minWidth: 170 },
        { id: "lastName", label: "Last Name", minWidth: 170 },
        { id: "assessmentName", label: "Assessment Name", minWidth: 170 },
        {
            id: "completedAt", label: "Completed At", minWidth: 170, align: "right"
        },
        {
            id: "markObtain", label: "Mark Obtain", minWidth: 170, align: "right",
        },
        {
            id: "percentage", label: "Percentage", minWidth: 170, align: "right",
        },
    ];
    const [data, setData] = useState([])
    const {
        data: userSessionData,
        loading: userSessionDataLoading,
    } = useQuery(GetAllUserAssessmentSession)

    useEffect(() => {
        let rows = [];
        if (userSessionData?.getUserAssessmentSession) {

            userSessionData?.getUserAssessmentSession.forEach((assessment) => {
                rows.push({
                    ...assessment,
                    markObtain: `${assessment.markObtain} / ${assessment.totalMark} `,
                    completedAt: new Date(assessment.completedAt).toUTCString().replace(" GMT", " "),
                    percentage: `${(assessment.markObtain / assessment.totalMark) * 100}` === 100 ? `${(assessment.markObtain / assessment.totalMark) * 100}` : `${(assessment.markObtain / assessment.totalMark) * 100}`.padStart(2, 0),
                });
            });
        }
        setData(rows)
    }, [userSessionData])
    if (data.length <= 0) {
        return <h1>No data</h1>
    }
    return (
        <>
            {userSessionDataLoading ? (<Loader assessmentLoading={userSessionDataLoading} />) : (
                <>
                    <HeaderWrapper>
                        <h4>Users Completed Session</h4>
                    </HeaderWrapper>
                    {/* <CreateButton>
                        <TextField
                            variant="outlined"
                            placeholder="Search"
                            style={{
                                width: '100%',
                                maxWidth: '500px'
                            }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                )
                            }}
                        />
                    </CreateButton> */}
                    {<DataTable rows={data} columns={columns} />}
                </>)}
        </>
    )
}

export default UserSession