import React from "react";
import { LoaderWrapper } from "./Loader.styles";
import { FadeLoader } from "react-spinners";
const Loader = ({ isLoading }) => {
    return (
        <>
            <LoaderWrapper>
                <FadeLoader
                    color="#2f50b1"
                    cssOverride={{}}
                    height={20}
                    loading={isLoading}
                    margin={7}
                    radius={18}
                    speedMultiplier={4}
                    width={8}
                />
            </LoaderWrapper>
        </>
    );
};
export default Loader;