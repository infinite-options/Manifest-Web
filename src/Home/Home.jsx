import React from "react"
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

/* Custom Hook to make styles */
const useStyles = makeStyles({

   
});

/* Navigation Bar component function */
 export function Home(){

    const classes = useStyles(); 

    return(

        <div style={{width:'100%', height:'100vh', backgroundColor:'#000000'}}>
            HOME
        </div>
     
    )
}

