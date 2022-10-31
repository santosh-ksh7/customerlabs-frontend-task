import "./Component1.css"
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
// MUI Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { TextField } from '@mui/material';

function Component1() {
  // Available Options for users to build schema subjected to updation
  const[arr, setArr] = useState([{Label: "First Name", Value: "first_name"}, 
    {Label: "Last Name", Value: "last_name"},
    {Label: "Gender", Value: "gender"},
    {Label: "Age", Value: "age"},
    {Label: "Account Name", Value: "account_name"},
    {Label: "City", Value: "city"},
    {Label: "State", Value: "state"}
  ])
  
  // Tracker for show/hide the dropdown menu
  const[show, setShow] = useState(false);

  // Options selected by users from available options
  const[usersel, setUsersel] = useState([])

  // track user input for name of the segment
  const[userip, setUserip] = useState("")

    // To track opening / closing of dialog
    const[open, setOpen] = useState(false);

    // Handler function to open the dialog
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    // Handler function to close the dialog
    const handleClose = () => {
      setOpen(false);
    };

    // Function to remove your selection from your schema
    function remsel(arg){
      // Remove from usersel
      let updated_usersel = usersel.filter((ele) => ele.param !== arg.param);
      setUsersel(updated_usersel);
      // Adiing the removed option back to available option array
      switch(arg.param){
        case "First Name" : return setArr([...arr, {Label: "First Name", Value: "first_name"}]); 
        case "Last Name" : return setArr([...arr, {Label: "Last Name", Value: "last_name"}]); 
        case "Gender" : return setArr([...arr, {Label: "Gender", Value: "gender"}]); 
        case "Age" : return setArr([...arr, {Label: "Age", Value: "age"}]); 
        case "Account Name" : return setArr([...arr, {Label: "Account Name", Value: "account_name"}]); 
        case "City" : return setArr([...arr, {Label: "City", Value: "city"}]); 
        case "State" : return setArr([...arr, {Label: "State", Value: "state"}]); 
      }
    }

    // Function to send data to the server i.e.. make an API call on submit
    function api_call(){
      if(userip && usersel[0]){
        // Building the schema in desired format
        let build_schema_in_desired_format = [];
        for(let x of usersel){
          switch(x.param){
            case "First Name" : build_schema_in_desired_format.push({first_name: x.param}); break;
            case "Last Name" : build_schema_in_desired_format.push({last_name: x.param}); break;
            case "Gender" : build_schema_in_desired_format.push({gender: x.param}); break;
            case "Age" : build_schema_in_desired_format.push({age: x.param}); break;
            case "Account Name" : build_schema_in_desired_format.push({account_name: x.param}); break;
            case "City" : build_schema_in_desired_format.push({city: x.param}); break;
            case "State" : build_schema_in_desired_format.push({state: x.param}); break;
          }
        }
        // Now making the data to send
        let data2send = {
          segment_name: userip,
          schema: build_schema_in_desired_format
        }
        // Making the api call to webhook site to post the data with http method
        fetch("https://webhook.site/a41fbc3e-2980-4d5d-904d-023b411f8246", {
          method: "POST",
          body: JSON.stringify(data2send),
          headers: {
            "content-type" : "Application/json"
          }
        }).then(() => {
          handleClose();
          alert("Made the API call and posted the data");
        });
      }else{
        alert("Both the segment name & schema is must to send the data to the server")
      }
    }


  return (
    <div>
      <h2>View Audience</h2>
      {/* Some dummy data */}
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <h4 style={{color: "red", textAlign: "center"}}>### Important Notice ###### <br></br>Please make sure that you check the CORS header checkbox in webhook.site to avoid any CORS error.</h4>
      {/* Button to open Dialog / popup */}
      <Button className='openpopup' variant="contained" onClick={handleClickOpen}>Save Segment</Button>
      {/* The Dialog/popup content */}
      <Dialog fullScreen sx={{width: "50%", left: "50%"}} open={open} onClose={handleClose} >
        {/* Dialog/popup heading */}
        <DialogTitle>Saving segment</DialogTitle>
        {/* Dialog/popup content */}
        <DialogContent>
          <h3>Enter the name of the segment</h3>
          <input style={{width: "80%"}} autoFocus className="ipname" name="name" placeholder="Name of the segment" type="text" onChange={(e) => setUserip(e.target.value)} />
          <h4>To save your segment, you need to add the schema to build your query</h4>
          <div className="legend">
            <div className="leg">
              <div className="legendcolor1"></div>
              <p style={{margin: "0px"}}>User traits</p>
            </div>
            <div className="leg">
              <div className="legendcolor2"></div>
              <p style={{margin: "0px"}}>Group traits</p>
            </div>
          </div>
          {/* The container to display user selection only if user has added atleast 1 schema */}
          <div className="usersel">
            {usersel[0] ? 
              usersel.map((ele,index) => <li key={index}>{ele.param} <span onClick={() => remsel(ele)} title="click to remove from your schema" className="delbtn"><DeleteIcon sx={{fontSize: "15px"}} /></span></li>) 
              : 
              <p style={{color: "red"}}>No schema added by the user. Start adding by clicking add new schema below.</p>
            }
          </div>
          {/* To show the dropdown with updated option on click */}
          <p onClick={() => setShow(true)} style={{color: "blue", cursor: "pointer"}}>+ Add new schema</p>
          {/* Dropdown container section */}
          <div className="dropdown">
            {show ? <Dropdown arr={arr} setArr={setArr} setShow={setShow} usersel={usersel} setUsersel={setUsersel} /> : null}
          </div>
        </DialogContent>
        <DialogActions sx={{justifyContent: "flex-start"}}>
          <Button variant="contained" onClick={api_call}>Save the Segment</Button>
          <Button variant="outlined" color="error" onClick={() => window.location.reload()}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Component1



function Dropdown({arr, setArr, setShow, usersel, setUsersel}){

  // Object mapping to match the label from the selected user value
  const obj={
    first_name: "First Name",
    last_name: "Last Name",
    gender: "Gender",
    age: "Age",
    account_name: "Account Name",
    city: "City",
    state: "State"
  }

  // Function to modify the options & save the response whenever a valid option is selected from the dropdowm
  function run(param){
    if(param){
      let updated_choice = arr.filter((ele) => ele.Value !== param);
      setArr(updated_choice);
      setUsersel([...usersel, {param : obj[param]}]);
      setShow(false);
    }else{
      alert("You should select a valid option from dropdown. Add schema to segment is not a valid option.")
    }
  }

  return(
    <div>
      {arr[0] ? 
        <select onChange={(e) => run(e.target.value)}>
        <option value="">Add schema to segment</option>
        {arr.map((ele,index) => <option key={index} value={ele.Value}>{ele.Label}</option>)}
        </select>
          :
        <p style={{color: "red"}}>You have selected all the available options for building schema.</p>
      }
    </div>
  )
}