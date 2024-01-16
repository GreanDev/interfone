import logo from './logo.svg';
import './App.scss';
import { encrypt } from './encryptor';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { UseState, useEffect }  from 'react';
import { Box, Container, ThemeProvider, Typography, createTheme, Button, IconButton, TextField, SvgIcon, Alert, Drawer } from '@mui/material';
import './firebaseController';
import { logoff, sendMessage, Messages, SelfMessages } from './firebaseController';

function open(){

}

function beforeUnload(beforeUnloadEvent){
  beforeUnloadEvent.preventDefault();
  return (beforeUnloadEvent.returnValue = '');
}

function App() {  
  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    console.log("Caught!");
    logoff();
    event.returnValue = '';
    });
  });

  
  let notifPerm = false
  if (Notification.permission === 'granted'){
    notifPerm = true;
  }
  return <Box sx={{
    height: '100vh',
    bgcolor: 'background.main',
    color: 'text.main',
  }}>
    <Box sx={{ position: 'sticky', top: 0, borderBottom: 'solid 1px',borderColor: 'primary.main', width: '100vw', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'space-between',  }}>
    <Box sx={{display: 'flex', alignItems: 'center', margin:'5px'}}>
    <SvgIcon><path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"></path><path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"></path></SvgIcon>
    <Typography variant='h5' fontWeight={'bold'} >InterFone</Typography>
    </Box>
    <IconButton aria-label='settings' color="primary.main">
      <SvgIcon><path d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z"></path><path d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z"></path></SvgIcon>
    </IconButton>
    </Box>
    <Button size='large' variant='contained' sx={{ 
      right: 0,
      bottom: 0,
      position: 'absolute',
      margin: '0.6em',
      marginRight: '0.2em',
      width: '4.5vw'
     }}
     onClick={async function(){
      await sendMessage(document.getElementById('MessageBox').value);
      document.getElementById('MessageBox').value = '';
     }}
     >Send</Button>

  <TextField onKeyDown={async function(ev){
        console.log(`Pressed keyCode ${ev.key}`);
      if (ev.key === 'Enter'){
      await sendMessage(document.getElementById('MessageBox').value);
      document.getElementById('MessageBox').value = '';
      }
     }} className="messageBox" id="MessageBox" label="Message" variant="outlined" sx={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '95vw',
    margin: '0.2em'
  }}/>
  {!notifPerm && <Alert  sx={{cursor: 'pointer', left: '1vw', top: '5px', position: 'absolute', width: '96.5vw'}} severity='error'
  action={
    <Button variant='contained' onClick={function(){
      Notification.requestPermission().then(function(permission) {
        window.location.reload(false);
      });
        
    }}>
      enable
    </Button>
  }
  >Notifications Not Allowed</Alert>}
  <Box id="msgsBox" className='msgsContainer' sx={{
    position: 'absolute',
    bgcolor: 'transparent',
    width: '100vw',
    height: '88vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
    overflowX: 'hidden',
    alignItems: 'flex-start',

  }}>
    <Messages />
  </Box>
  <Box id="smsgsBox" onScroll={function(){
    console.log('Scroll');
    document.getElementById('msgsBox').scrollTop = document.getElementById('smsgsBox').scrollTop
  }} className='msgsContainer' sx={{
    position: 'absolute',
    bgcolor: 'transparent',
    width: '100vw',
    height: '88vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
    overflowX: 'hidden',
    alignItems: 'flex-end',
  }}>
    <SelfMessages />
  </Box>
  </Box>
}



function checkNotif() {

}

export default App;