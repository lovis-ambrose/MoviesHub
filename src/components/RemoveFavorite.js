import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";

const RemoveFavorites = () => {
    return (
        <>
            <span>Delete Movie <FontAwesomeIcon icon={faTrash} color="red"/></span>
        </>
    );
}

export default RemoveFavorites;