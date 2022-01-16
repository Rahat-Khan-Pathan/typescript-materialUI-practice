import { Button, Collapse, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup, Switch, TextField } from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { useEffect } from 'react';
import  apiBase from "../config.json";
import axios from 'axios';

const {apiBaseUrl} = apiBase;
// View Modes
const viewModesView = "VIEW";
const viewModesNew = "NEW";
const viewModesEdit = "EDIT";
const viewModesEditable = "EDITABLE";

// itital Contact interface
interface ContactInterface {
    _id?: string,
    name: string,
    companyref:ContactInterface | null,
    iscompany:boolean,
    iscustomer:boolean,
    status:boolean,
    phone:string,
    mobile:string,
    email:string,
    website:string,
    address:string,
    jobtitle:string,
    title:string,
}
// converted Contact 
interface ConvertedContactInterface {
    name: string,
    companyref:string | undefined,
    iscompany:boolean,
    iscustomer:boolean,
    status:boolean,
    phone:string,
    mobile:string,
    email:string,
    website:string,
    address:string,
    jobtitle:string,
    title:string,
}
const initialContact:ContactInterface = {
    _id:"",
    name: "",
    companyref:null,
    iscompany: true,
    iscustomer: true,
    status:true,
    phone: "",
    mobile:"",
    email:"",
    website:"",
    address:"",
    jobtitle:"",
    title:"",
}
interface Props {
    sentContact: ContactInterface | null,
    setSentContact: React.Dispatch<React.SetStateAction<ContactInterface | null>>,
}
const ManageContacts = ({sentContact,setSentContact}:Props) => {
    const [currentView, setCurrentView] = useState<string>(viewModesView);
    const [message,setMessage] = useState<string>("");
    const [openSuccess,setOpenSuccess] = useState<boolean>(false);
    const [openFailure,setOpenFailure] = useState<boolean>(false);
    const [currentContact,setCurrentContact] = useState<ContactInterface>(initialContact);
    const [allCompanies,setAllCompanies] = useState<ContactInterface[]>([]);
    //clear fields function
    const clearFields = ()=> {
        setCurrentContact(initialContact);
        setCurrentView(viewModesView);
    }
    // convert contact data before sending to the backend
    const convertedContact = ()=> {
        const convertedContact:ConvertedContactInterface = {...currentContact,companyref:(currentContact?.companyref?._id === undefined)? "": currentContact?.companyref?._id}
        // return currentContact;
        return convertedContact;
    }
    // function to get the companies
    const getAllCompanies = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/contact/get_all_populated`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                iscompanyisused: true,
                iscompany: true,
            })
          })
          .then((res)=> {
            (res.data.result)? setAllCompanies(res.data.result) : setAllCompanies([]);
          })
          .catch((err)=> {
            console.log(err);
          })
    }
    // function to add a new contact
    const addNewContact = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/contact/new`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(convertedContact())
          })
          .then((res)=> {
            setMessage("Created successfully");
            setOpenSuccess(true);
            clearFields();
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Something went wrong!");
            setOpenFailure(true);
          })
    }
    // function to modify a contact
    const modifyContact = ()=> {
        axios({
            method: "PUT",
            url: `${apiBaseUrl}/contact/modify/${currentContact._id}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(convertedContact())
          })
          .then((res)=> {
            setMessage("Modified successfully");
            setOpenSuccess(true);
            clearFields();
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Something went wrong!");
            setOpenFailure(true);
          })
    }
    useEffect(()=>{
        getAllCompanies();
        clearFields();
        if (sentContact) {
          setCurrentContact(sentContact);
          setSentContact(null);
          setCurrentView(viewModesEditable);
        } 
        else {
          setCurrentView(viewModesView);
        }
    },[])
    return (
        <div>
            <div style={{marginBottom: '1rem',display:'flex',alignItems:'center'}}>
                <Button
                    disabled={currentView !== viewModesView}
                    onClick={() => {
                        setCurrentView(viewModesNew)
                        setOpenFailure(false);
                        setOpenSuccess(false);
                    }}
                    variant="contained" color="secondary" style={{marginRight: "1rem"}}
                > CREATE NEW
                </Button>
                <Button
                    disabled={currentView !== viewModesEditable}
                    onClick={() => {
                        setCurrentView(viewModesEdit);
                        setCurrentView(viewModesEdit);
                    }}
                    variant="contained" color="primary" style={{marginRight: "1rem"}}
                >
                    EDIT
                </Button>
                <Button
                    disabled={ currentView !== viewModesNew && currentView !== viewModesEdit }
                    variant="contained" color="primary" style={{marginRight: "1rem"}}
                    onClick={()=>{
                        setOpenSuccess(false);
                        setOpenFailure(false);
                        currentView === viewModesEdit ? modifyContact() : addNewContact();
                    }}
                >
                    SAVE 
                </Button>
                <Button 
                    onClick={() => {
                        clearFields();
                        setOpenFailure(false);
                        setOpenSuccess(false);
                    }}
                    variant="contained"
                    style={{marginRight: "1rem"}}
                    >
                    CANCEL
                </Button>
            </div>
            <div style={{ marginTop: "1rem",marginBottom:"1rem" }}>
                <Collapse in={openSuccess}>
                    <Alert
                        action={
                        <IconButton aria-label="close" color="inherit" onClick={() => {setOpenSuccess(false)}}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                        }
                    >{message}
                    </Alert>
                </Collapse>
                <Collapse in={openFailure}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton aria-label="close" color="inherit" onClick={() => { setOpenFailure(false)}}>
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    > {message}
                    </Alert>
                </Collapse>
            </div>
            <Paper elevation={3} style={{padding:"1rem",textAlign:"center"}}>
                <Grid container spacing={2} style={{display:"flex",justifyContent:"center"}}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                            <Switch
                                disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                                checked={currentContact.status}
                                onChange={(e)=> setCurrentContact({...currentContact,status:e.target.checked})}
                                name="checkedB"
                                color="primary"
                            />
                            }
                            label="Active"
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Contact Name"
                            variant="outlined"
                            required
                            value={currentContact.name}
                            onChange={(e) =>setCurrentContact({ ...currentContact, name: e.target.value})}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit || currentContact.iscompany===true}
                            value={currentContact.companyref}
                            onChange={(event, newValue) => {
                                setCurrentContact({...currentContact,companyref:newValue});
                            }}
                            id="controllable-states-demo"
                            fullWidth
                            options={allCompanies}
                            getOptionLabel={(option) => option?.name}
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Company"
                                variant="outlined"
                            />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl component="fieldset" disabled={currentView !== viewModesNew && currentView !== viewModesEdit}>
                            <FormLabel component="legend">Customer or Supplier</FormLabel>
                                <RadioGroup aria-label="gender" name="gender1" value={currentContact.iscustomer} onChange={(e)=>
                                {
                                    setCurrentContact({...currentContact,iscustomer: (e.target.value==="true")? true:false})
                                }}>
                                    <FormControlLabel value={false} control={<Radio />} label="Supplier" />
                                    <FormControlLabel value={true} control={<Radio />} label="Customer" />
                                </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl component="fieldset" disabled={currentView !== viewModesNew && currentView !== viewModesEdit}>
                            <FormLabel component="legend">Company or Individual</FormLabel>
                                <RadioGroup aria-label="gender" name="gender1" value={currentContact.iscompany} onChange={(e)=> {
                                    setCurrentContact({...currentContact,iscompany:(e.target.value==="true")? true:false,companyref:(e.target.value==="true")? null : currentContact.companyref});
                                }}>
                                    <FormControlLabel value={true} control={<Radio />} label="Company" />
                                    <FormControlLabel value={false} control={<Radio />} label="Individual" />
                                </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Phone"
                            variant="outlined"
                            value={currentContact.phone}
                            onChange={(e) =>setCurrentContact({ ...currentContact, phone: e.target.value})}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Mobile"
                            variant="outlined"
                            value={currentContact.mobile}
                            onChange={(e) =>setCurrentContact({ ...currentContact, mobile: e.target.value})}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            value={currentContact.email}
                            onChange={(e) =>setCurrentContact({ ...currentContact, email: e.target.value})}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Website"
                            variant="outlined"
                            value={currentContact.website}
                            onChange={(e) =>setCurrentContact({ ...currentContact, website: e.target.value})}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Address"
                            variant="outlined"
                            value={currentContact.address}
                            onChange={(e) =>setCurrentContact({ ...currentContact, address: e.target.value})}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit || currentContact.iscompany===true}
                            id="outlined-basic"
                            label="Job Title"
                            variant="outlined"
                            value={currentContact.jobtitle}
                            onChange={(e) =>setCurrentContact({ ...currentContact, jobtitle: e.target.value})}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit || currentContact.iscompany===true}
                            id="outlined-basic"
                            label="Title"
                            variant="outlined"
                            value={currentContact.title}
                            onChange={(e) =>setCurrentContact({ ...currentContact, title: e.target.value})}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default ManageContacts;