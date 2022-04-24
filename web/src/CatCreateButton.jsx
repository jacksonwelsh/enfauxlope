import React from "react";
import ComboBox from "./ComboBox";
import { useState } from 'react'

const checkForm = () => {
    //console.log(ComboBox.event)
    // if(selectedCategory === undefined){
    //     console.log("undefined ComboBox value\n")
    // }
    // else{
    //     console.log(selectedCategory)
    // }
}

const CatCreateButton = () => {
    return(
        <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded" onClick={() => checkForm()}>
            Button
        </button>
    )
    
}

export default CatCreateButton;