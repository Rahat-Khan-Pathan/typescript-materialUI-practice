import React, { useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import ManageContacts from './ManageContacts';
import  apiBase from "../config.json";
import axios from 'axios';
import ViewContacts from './ViewContacts';

const {apiBaseUrl} = apiBase;

interface ContactsContainerProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}
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


function ContactsContainer(props: ContactsContainerProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  // states for contacts
  const [sentContact,setSentContact] = useState<ContactInterface | null>(null);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Manage Contacts" {...a11yProps(0)} />
          <Tab label="View All Contacts" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <ContactsContainer value={value} index={0} dir={theme.direction}>
          <ManageContacts sentContact={sentContact} setSentContact={setSentContact}></ManageContacts>
        </ContactsContainer>
        <ContactsContainer value={value} index={1} dir={theme.direction}>
          <ViewContacts changeView={setValue} setSentContact={setSentContact}></ViewContacts>
        </ContactsContainer>
      </SwipeableViews>
    </div>
  );
}
