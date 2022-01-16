import { Button, Checkbox, Dialog, DialogContent, DialogContentText, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiRevision } from "react-icons/bi";
import { IoIosPaper,IoIosSearch,IoIosDocument } from "react-icons/io";
import  apiBase from "../config.json";

const {apiBaseUrl} = apiBase;
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
// search query interface 
interface SearchQueryInterface {
    name: string,
    nameisused: boolean,
    phone: string,
    phoneisused: boolean,
    mobile: string,
    mobileisused:boolean,
    email: string,
    emailisused: boolean,
    website:string,
    websiteisused:boolean,
    address: string,
    addressisused: boolean,
    jobtitle: string,
    jobtitleisused: boolean,
    title: string,
    titleisused: boolean,
    iscompany: boolean | undefined,
    iscompanyisused: boolean,
    iscustomer: boolean | undefined,
    iscustomerisused:boolean,
    status: boolean | null,
    statusisused: boolean,
}
  // initial searchquery
const initialSearchQuery:SearchQueryInterface = {
    name: "",
    nameisused: false,
    phone: "",
    phoneisused: false,
    mobile:"",
    mobileisused: false,
    email: "",
    emailisused: false,
    website:"",
    websiteisused: false,
    address:"",
    addressisused: false,
    jobtitle:"",
    jobtitleisused:false,
    title:"",
    titleisused:false,
    iscompany: undefined,
    iscompanyisused:false,
    iscustomer: undefined,
    iscustomerisused: false,
    status: null,
    statusisused: false,
}
interface Props {
    changeView: React.Dispatch<React.SetStateAction<number>>,
    setSentContact: React.Dispatch<React.SetStateAction<ContactInterface | null>>,
}

const ViewContacts = ({changeView,setSentContact}: Props) => {
    //states 
    const [allContacts,setAllContacts] = useState<ContactInterface[]>([]);
    const [individuals,setIndividuals] = useState<ContactInterface[]>([]);
    const [searchQuery,setSearchQuery] = useState<SearchQueryInterface>(initialSearchQuery);
    const [updateContacts,setUpdateContacts] = useState<boolean>(false);
    const [open,setOpen] = useState<boolean>(false);
    // function to change status
    const changeStatus = (id:string | undefined,statusBool:boolean)=> {
        const status = statusBool? "inactive" : "active";
        axios({
            method: "PUT",
            url: `${apiBaseUrl}/contact/set_status/${id}/${status}`,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({})
        })
        .then(()=> {
            setUpdateContacts(!updateContacts);
        })
        .catch((err)=> {
            console.log(err);
        })
    }
    // function to get all contacts
    const getAllContacts = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/contact/get_all_populated`,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(searchQuery)
        })
        .then((res)=> {
            (res.data.result)? setAllContacts(res.data.result) : setAllContacts([]);
        })
        .catch((err)=> {
            console.log(err);
        })
    }
    // function to get individuals of a company
    const getIndividuals = (id:string | undefined)=> {
        if(id === undefined) return;
        axios({
            method: "POST",
            url: `${apiBaseUrl}/contact/get_all_populated`,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                companyrefisused: true,
                companyref: id,
            })
        })
        .then((res)=> {
            (res.data.result)? setIndividuals(res.data.result) : setIndividuals([]);
            setOpen(true);
        })
        .catch((err)=> {
            console.log(err);
        })
    }

    useEffect(()=>{
        getAllContacts();
    },[updateContacts,searchQuery])
    useEffect(()=>{
        getAllContacts();
        setSearchQuery(initialSearchQuery);
    },[])
    return (
        <div>
            <Dialog
                fullWidth
                open={open}
                onClose={()=> setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <TableContainer component={Paper} elevation={2}>
                            <Table aria-label="a simple table">
                                <TableHead style={{backgroundColor:"#aaa"}}>
                                <TableRow hover>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Phone</TableCell>
                                    <TableCell align="right">Mobile</TableCell>
                                    <TableCell align="right">Email</TableCell>
                                    <TableCell align="right">Type</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {   individuals?.map((row) => (
                                    <TableRow key={row._id} hover>
                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                        <TableCell align="right">{row.phone}</TableCell>
                                        <TableCell align="right">{row.mobile}</TableCell>
                                        <TableCell align="right">{row.email}</TableCell>
                                        <TableCell align="right">{(row.iscustomer)? "Customer": "Supplier"}</TableCell>
                                        <TableCell align="right" style={row.status === true ? { color: "green"} : {color:'red'}}>{(row.status)? "Active" : "Inactive"}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <Grid container spacing={2} style={{marginBottom:'1rem'}}>
                <Grid item xs={3}>
                    <TextField
                        size="small"
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        value={searchQuery.name}
                        onChange={(e) =>{
                            setSearchQuery({...searchQuery,name:e.target.value,nameisused: Boolean(e.target.value)})
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size="small"
                        id="outlined-basic"
                        label="Phone"
                        variant="outlined"
                        value={searchQuery.phone}
                        onChange={(e) =>{
                            setSearchQuery({...searchQuery,phone:e.target.value,phoneisused: Boolean(e.target.value)})
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size="small"
                        id="outlined-basic"
                        label="Mobile"
                        variant="outlined"
                        value={searchQuery.mobile}
                        onChange={(e) =>{
                            setSearchQuery({...searchQuery,mobile:e.target.value,mobileisused: Boolean(e.target.value)})
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size="small"
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        value={searchQuery.email}
                        onChange={(e) =>{
                            setSearchQuery({...searchQuery,email:e.target.value,emailisused: Boolean(e.target.value)})
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size="small"
                        id="outlined-basic"
                        label="Website"
                        variant="outlined"
                        value={searchQuery.website}
                        onChange={(e) =>{
                            setSearchQuery({...searchQuery,website:e.target.value,websiteisused: Boolean(e.target.value)})
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size="small"
                        id="outlined-basic"
                        label="Address"
                        variant="outlined"
                        value={searchQuery.address}
                        onChange={(e) =>{
                            setSearchQuery({...searchQuery,address:e.target.value,addressisused: Boolean(e.target.value)})
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={1}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={searchQuery.iscompany}
                            onChange={(e)=> {
                                setSearchQuery({...searchQuery,iscompany:e.target.checked,iscompanyisused: e.target.checked})
                            }}
                            name="checkedB"
                            color="primary"
                        />
                        }
                        label="Company"
                    />
                </Grid>
                <Grid item xs={1}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={searchQuery.iscustomer}
                            onChange={(e)=> {
                                setSearchQuery({...searchQuery,iscustomer:e.target.checked,iscustomerisused: e.target.checked})
                            }}
                            name="checkedB"
                            color="primary"
                        />
                        }
                        label="Customer"
                    />
                </Grid>
                <Grid item xs={2}>
                    <FormControl variant="outlined" style={{minWidth: 180,margin: 0}} size="small">
                        <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={(searchQuery.status===true)? "ACTIVE": (searchQuery.status===false)? "INACTIVE" : "NONE"}
                                onChange={(e)=> {
                                    if(e.target.value === "NONE") {
                                        setSearchQuery({...searchQuery,status:null,statusisused:false})
                                    }
                                    else {
                                        setSearchQuery({...searchQuery,status:(e.target.value==="ACTIVE")? true:false,statusisused:true})
                                    }
                                }}
                                label="Status"
                            >
                                <MenuItem value={"NONE"}>NONE</MenuItem>
                                <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
                                <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
                            </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={1} style={{display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={()=> {
                            setUpdateContacts(!updateContacts)
                        }}
                        >
                        <IoIosSearch></IoIosSearch>
                    </Button>
                </Grid>
            </Grid>
            <TableContainer component={Paper} elevation={2}>
                <Table aria-label="a simple table">
                    <TableHead style={{backgroundColor:"#aaa"}}>
                    <TableRow hover>
                        <TableCell>Actions</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Phone</TableCell>
                        <TableCell align="right">Mobile</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {   allContacts?.map((row) => (
                        <TableRow key={row._id} hover>
                            <TableCell component="th" scope="row">
                                <Grid container spacing={2} xs={10}>
                                    <Grid item xs={3}>
                                        <Tooltip title="view this contact">
                                            <Button
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                onClick={()=> {
                                                    changeView(0);
                                                    setSentContact(row);
                                                }}
                                                >
                                                <IoIosPaper></IoIosPaper>
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip title="change status of this contact">
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={()=> {
                                                    changeStatus(row._id,row.status);
                                                }}
                                                >
                                                <BiRevision></BiRevision>
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip title="view individuals of this company">
                                            <Button
                                                disabled={row.iscompany===false}
                                                variant="contained"
                                                size="large"
                                                style={row.iscompany === true ?  {backgroundColor:'orange',color:'white'} : {backgroundColor:'#E0E0E0'}}
                                                onClick={()=> {
                                                    getIndividuals(row?._id);
                                                }}
                                                >
                                                <IoIosDocument></IoIosDocument>
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell align="right">{row.iscompany? row.name + " (C)" : row.name}</TableCell>
                            <TableCell align="right">{row.phone}</TableCell>
                            <TableCell align="right">{row.mobile}</TableCell>
                            <TableCell align="right">{row.email}</TableCell>
                            <TableCell align="right">{(row.iscustomer)? "Customer": "Supplier"}</TableCell>
                            <TableCell align="right" style={row.status === true ? { color: "green"} : {color:'red'}}>{(row.status)? "Active" : "Inactive"}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ViewContacts;