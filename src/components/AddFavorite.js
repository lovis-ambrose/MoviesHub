import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";

const AddFavorite = () => {
    return (
        <>
            <button className="btn btn-primary">
                <span>Save Movie <FontAwesomeIcon icon={faHeart} color="red"/></span>
            </button>
        </>
    );
};

export default AddFavorite;