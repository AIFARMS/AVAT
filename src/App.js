/**
 * @author Pradeep Senthil (pks3@illinois.edu)
 */

 import React, { useState } from "react"; 
 import ReactDOM from 'react-dom'
 import './App.css';
 import ReactPlayer from 'react-player'
 import 'bootstrap/dist/css/bootstrap.min.css';
 
 import FrontEnd from './ui_elements/Pages/main_upload'
 import SelectionScreen from './ui_elements/Pages/selection_screen'
 
 //<FrontEnd></FrontEnd>
 function App() {
   return (
     <div>
       <SelectionScreen></SelectionScreen>    
     </div>
   );
 }
       //<ActiveObject />
       //<input type="file" onChange={handleVideoUpload1} />
       //<div>
         //<ReactPlayer url={videoFilePath1} width="50%" height="50%" controls={true} style={{position:'relative', float:'left'}}/>
         //<Fabric/>
       //</div>
 
 export default App;