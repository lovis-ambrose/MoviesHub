import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";

const AddFavorite = () => {
    return (
        <>
            <span style={{marginRight: 10}}>Delete Movie <FontAwesomeIcon icon={faHeart} color="red"/></span>
        </>
    );
};

export default AddFavorite;