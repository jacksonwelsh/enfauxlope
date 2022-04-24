import React from "react";
import { useState } from 'react'

// const checkForm = ({selectedCategory}) => {
//     console.log(selectedCategory.external)
//     // console.log(ComboBox.event)
//     // if(selectedCategory === undefined){
//     //     console.log("undefined ComboBox value\n")
//     // }
//     // else{
//     //     console.log(selectedCategory)
//     // }
// }

const CatCreateButton = ({ limit, selectedCategory, onClick }) => {
    return(
        <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded" onClick={onClick}>
            Add Limit
        </button>
    )
    
}

export default CatCreateButton;