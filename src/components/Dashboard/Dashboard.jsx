import React, { useState } from "react";
import { MainWrapper, LeftContent, RightContent, LeftImg, LeftItem } from "./Dashboard.styles";

export default function Dashboard() {

    const [set, doneset] = useState(["Dashboard", "Assement", "Users", "System Setting", "Completed Sessions"]);
    return (
        <>
            <MainWrapper>
                <LeftContent>
                    <LeftImg>NDT</LeftImg>
                    {/* <LeftItem>
                        {set.map((local, index) => (
                            <ul><li key={index}>{local}</li></ul>
                        ))}
                    </LeftItem> */}
                </LeftContent>
                {/* <RightContent>
                    <h2>Hello2</h2>
                </RightContent> */}
            </MainWrapper>
        </>
    )
}