import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";

const RemoveFavorites = () => {
    return (
        <>
            <button className="btn btn-danger">
                <span>Delete Movie <FontAwesomeIcon icon={faTrash} color="white"/></span>
            </button>
        </>
    );
}

export default RemoveFavorites;