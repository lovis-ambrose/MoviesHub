import React from "react";
import { useNavigate} from "react-router-dom";

const MovieListHeading = (props) => {
    const handleNavigation = useNavigate();

    // Handle login redirect
    const handleHomeRedirect = () => {
        handleNavigation('/');
    };

    return(
        <>
            <div className="col pointer" onClick={handleHomeRedirect}>
                <h1>{props.heading}</h1>
            </div>
        </>
    );
};

export default MovieListHeading;