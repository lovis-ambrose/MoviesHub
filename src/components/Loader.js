import React from 'react';
import {BounceLoader} from "react-spinners";

export const LoaderBounce = ({ loading = true, size = 60, color = '#36d7b7', cssOverride = {} }) => {
    return (
        <div className="loader-container" style={{ ...cssOverride, textAlign: 'center', padding: '20px' }}>
            <BounceLoader loading={loading} size={size} color={color} />
        </div>
    );
};


