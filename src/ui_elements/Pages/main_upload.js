import React, { useEffect, useState } from "react"; 
import ReactDOM from 'react-dom'
import ReactPlayer from 'react-player'
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Toast from 'react-bootstrap/Toast'


import ExtractingAnnotation from '../../backend_processing/annotation-processing'
import ChangeTable from '../Components/change_table'
import { NavDropdown } from "react-bootstrap";

//Custom implemented classes
import { BoundingBox } from '../../backend_processing/bounding_box'
import { FrameBoundingBox } from '../../backend_processing/frame_bounding_box'
import { KeyPoint } from '../../backend_processing/key_point'
import { Segmentation } from '../../backend_processing/segmentation'
import { Annotation } from '../../backend_processing/annotation'
import Instructions from "../Components/instructions";

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { CSVExport } from 'react-bootstrap-table2-toolkit';

import {behaviors} from '../../static_data/behaviors_LPS'
import {posture} from '../../static_data/posture'
import {status} from '../../static_data/status'
//import {columns} from '../../static_data/columns' //TODO re-add columns

//TODO add local storage functionality to auto-save
if (typeof(Storage) === "undefined") {
  // Code for localStorage/sessionStorage.
  alert('Your browser does not support local storage. \nSome autosaving features of the app will not work as intended.\nPlease see the documentation to find supported browsers and their versions')
}

const ANNOTATION_FRAME = "1"
const ANNOTATION_BBOX = "2"
const ANNOTATION_KEYPOINT = "3"
const ANNOTATION_SEG = "4"

const fabric = require("fabric").fabric;
const createReactClass = require('create-react-class');



//TODO ADD DYNAMIC SOLUTION 
var frame_rate = 15;
var num_frames = -1;
var scaling_factor_width = 1920;
var scaling_factor_height = 1080;
var skip_value = 1;

console.log(window.screen.width)
console.log(window.screen.height)

var current_screen_width = window.screen.width;
var current_screen_height = window.screen.height;

//Mappings are based off of https://en.wikipedia.org/wiki/List_of_common_resolutions make sure to use 1:1 and 16:9 aspect ratio
if (current_screen_height >= 1440){
  scaling_factor_width = 1920;
  scaling_factor_height = 1080;
}else if(current_screen_height >= 1080){
  scaling_factor_width = 1280;
  scaling_factor_height = 720;
}else if(current_screen_height >= 1024){
  scaling_factor_width = 1152;
  scaling_factor_height = 648;
}else if(current_screen_height >= 768){
  scaling_factor_width = 1024;
  scaling_factor_height = 576;
}


// globally accessable fabricCanvas instance
var fabricCanvas = new fabric.Canvas('c', {uniScaleTransform: true});

var video_width = 0;
var video_height = 0;

function get_player_metadata(){

}

var Fabric = createReactClass({
	componentDidMount() {
  	var el = ReactDOM.findDOMNode(this);

    //alert("Loaded player: \nHorizontal Resolution = " + scaling_factor_width + "\nVertical Resolution = " + scaling_factor_height)
    // Here we have the canvas so we can initialize fabric
    fabricCanvas.initialize(el, {
    	height: scaling_factor_height,
      width: scaling_factor_width,
      backgroundColor : null,
    });
    
    // on mouse up lets save some state
    fabricCanvas.on('mouse:up', () => {
      save_data(currentFrame)
    });

    fabricCanvas.on('object:added', save_data(currentFrame));
    fabricCanvas.on('object:removed', save_data(currentFrame));
    fabricCanvas.on('object:modified', save_data(currentFrame));
    
    // an event we will fire when we want to save state
    fabricCanvas.on('saveData', () => {
      fabricCanvas.renderAll(); // programatic changes we make will not trigger a render in fabric
    });
  }, 
  render() {
    return <canvas></canvas>
  }
});

var frame_data = [[]];
var annotation_data = [[]];
var upload = false;
var disable_buttons = true;
var currentFrame = 0;
var sliderPercent = 0
var toast_text = ""
var previous_annotation = []
var previous_canvas_annotation = []
var ANNOTATOR_NAME = ""
var ANNOTATION_VIDEO_NAME = ""


function save_data(frame_num){
  frame_data[frame_num] = fabricCanvas.toJSON()
  console.log("SAVED")
}


//Current frame counter
function MainUpload() {
  const columns = [{
    dataField: "id",
    text: "ID",
    headerStyle: () => { return { width: "40px", left: 0 }; }
  },{
    dataField: "global_id",
    text: "Glo",
    headerStyle: () => { return { width: "50px", left: 0}; },
    editCellStyle: (cell, row, rowIndex, colIndex) => {
      const backgroundColor = cell > 2101 ? '#00BFFF' : '#00FFFF';
      return { backgroundColor };
    }
  },{
    dataField: "status",
    text: "Status",
    editor: {
        type: Type.SELECT,
        options: status
      }
  },{
    dataField: "current",
    text: "Curr",
    editor: {
      type: Type.CHECKBOX,
      value: 'Start:Stop'
    },
    headerStyle: () => { return { width: "60px", left: 0}; },
  },{
    dataField: "behavior",
    text: "Behavior",
    editor: {
        type: Type.SELECT,
        options: behaviors,
    }
  },{
    dataField: "remove",
    text: "Del",
    editable: false,
    headerStyle: () => { return { width: "50px", left: 0}; },
    formatter: (cellContent, row) => {
      return (
        <button
          className="btn btn-danger btn-xs"
            onClick={() => remove_table_index(row.id)}
            label="Del"
          >
        </button>
      );
    },
  }
  ]
  
  const remove_table_index = (index) => {
    var index_num = 0;

    for(var i = 0; i < annotation_data[currentFrame].length; i++){
      if(annotation_data[currentFrame][i]['id'] == index){
        index_num = i
        break;
      }
    }

    if(index.substring(index.length-1, index.length) !== "f"){
      for(var i = 0; i < fabricCanvas.getObjects().length; i++){
        if(fabricCanvas.getObjects()[i]['_objects'][1]['text'] === index){
          fabricCanvas.remove(fabricCanvas.getObjects()[i]);
          fabricCanvas.fire('saveData');
          break;
        }
      }
    }
    console.log(annotation_data[currentFrame])
    annotation_data[currentFrame].splice(index_num, 1)
    console.log(annotation_data[currentFrame])
    save_data(currentFrame)
    //TODO make this more elegant - Currently makes a random number since the state change using an incremental update to the integer caused a stop of state updates and did not respond to any changes. This forces the values to be changed on random and should not have any dependence of the previous value of the visual toggle state.
    setVisualToggle(Math.floor(Math.random() * 999999999999))
  }
  
  const [visualToggle, setVisualToggle] = useState(0);
  
  console.log(visualToggle)

  const save_previous_data = () => {
    if(annotation_data[currentFrame].length == 0){
      return;
    }
    console.log(annotation_data[currentFrame].length === 0)
    console.log("saved annotation")
    previous_annotation = annotation_data[currentFrame]
    previous_canvas_annotation = frame_data[currentFrame]
  }

  const [annotationType, setAnnotationType] = useState("1")
  const handleAnnotationType = (event) => {
    console.log(event.target.value)
  }
  
  const [boxCount, setBoxCount] = useState(0)
  const addToCanvas = () =>{
    var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
    
    if(annotation_data[currentFrame] == null){
      annotation_data[currentFrame] = []
    }
    
    if (annotationType === ANNOTATION_BBOX){
      annotation_data[currentFrame].push({id: boxCount+'b', global_id: null,status: "None", current: "Start", behavior: "None"})
      var new_bbox = new BoundingBox(fabricCanvas.height/2, fabricCanvas.width/2, 50, 50, color, boxCount+'b', "None").generate_no_behavior(fabricCanvas)
      fabricCanvas.add(new_bbox)
    }else if (annotationType === ANNOTATION_KEYPOINT){
      //TODO fix KeyPoint
      alert("KeyPoint annotation are currently unavailable")
      //annotation_data[currentFrame].push({id: boxCount+'k', behavior: "None", is_hidden: 0, posture: "None"})
      //var keyp = new KeyPoint().generate_stick(fabricCanvas)
    }else if (annotationType === ANNOTATION_SEG){
      alert("Segmentation annotation is currently under development")
      //TODO Fix segmentation issues
      //annotation_data[currentFrame].push({id: boxCount+'s', global_id:null, status: "None", current: "Start", behavior: "None"})
      //var segment = new Segmentation().generate_polygon(fabricCanvas, boxCount+'s')
    }else if(annotationType === ANNOTATION_FRAME){
      //TODO Add annotation frame datapoint
      annotation_data[currentFrame].push({id: boxCount+'f', global_id: null,status: "None", current: "Start", behavior: "None"})
    }
    save_data(currentFrame)
    setBoxCount(boxCount + 1);
    fabricCanvas.fire('saveData');
  }

  const remove = () => {
    setBoxCount(boxCount + 1)
    if(fabricCanvas.getActiveObject() === null){
      console.log(fabricCanvas.getObjects())
      alert("Please select a bounding box / segmentation from the screen to delete.")
      //return
    }
    console.log(fabricCanvas.getActiveObject())
    var index = fabricCanvas.getActiveObject().toJSON()['local_id']
    for(var i = 0; i < annotation_data[currentFrame].length; i++){
      if (annotation_data[currentFrame][i]['id'] === index){
        annotation_data[currentFrame].splice(i, 1)
        break;
      }
    }
    fabricCanvas.remove(fabricCanvas.getActiveObject());
    fabricCanvas.fire('saveData');
  }

  const [videoFilePath, setVideoFileURL] = useState(null);
  const handleVideoUpload = (event) => {
    setVideoFileURL(URL.createObjectURL(event.target.files[0]));
    console.log(event.target.files[0])
    ANNOTATION_VIDEO_NAME = event.target.files[0]['name']
    upload = true;
  };

  //Code for dual video upload option. Currently disabled
  const [videoFilePath1, setVideoFileURL1] = useState(null);
  const handleVideoUpload1 = (event) => {
    setVideoFileURL1(URL.createObjectURL(event.target.files[0]));
  };
  
  //ASYNC Function  - To note that the data that comes out of this will be a bit delayed and this could cause some issues.
  const [oldAnnotation, setOldAnnotation] = useState(null)
  const handleOldAnnotation = (event) => {
      var promise = downloadOldAnnotation(event)
      promise.then(function (result) {
        if(result != null){
          setOldAnnotation(new ExtractingAnnotation(result));
        }else{
          console.log("ERROR in upload old_annotation")
        }
      })
  }

  useEffect(() => {
    //TODO Find a more elegant solution. This is a temporay patch work.
    if(oldAnnotation == null){
      return;
    }
    alert("Annotation upload processed.\nAny existing annotations will be deleted and replaced with uploaded ones.")
    console.log(oldAnnotation)
    console.log(oldAnnotation.get_frame_data());
    frame_data = oldAnnotation.get_frame_data();
    annotation_data = oldAnnotation.get_annotation_data();
    handle_visual_toggle()
  }, oldAnnotation);

  const downloadOldAnnotation = (file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function(e) {
         resolve((JSON.parse(e.target.result)));
      }
      reader.readAsText(file.target.files[0])
    })
  }
  

  const [playing, setPlaying] = useState(false);
  const handlePlaying = (event) => {
    setPlaying(!playing)
  }

  var play_button_text = "ERROR"
  if(playing === true){
    play_button_text = "Pause"
  }else{
  play_button_text = "Play"
  }

  const [seeking, setSeeking] = useState(false)


  const handleSeekChange = e => {
    sliderPercent = (parseFloat(e.target.value))
  }

  const handleSeekMouseDown = e => {
    setSeeking(true)
  }

  const handleSeekMouseUp = e => {
    setSeeking(false)
    player.seekTo(parseFloat(e.target.value))
  }

  const [player, setPlayer] = useState(null)
  const handleSetPlayer = val => {
    //console.log(val)
    if(val != null){
      if(val['player'] != null){
        if(val['player']['player'] != null){
          if(val['player']['player'] != null){
            video_width = val['player']['player']['player'].videoWidth
            video_height = val['player']['player']['player'].videoHeight
            var duration = val['player']['player']['player'].duration
            //alert("*Loaded player* \nHorizontal Resolution = " + video_width + "\nVertical Resolution = " + video_height + "\nFrame Rate: " + frame_rate + " FPS\nDuration: " + duration + " seconds")
          }
        }
      }
    }
    setPlayer(val)
  }

  //TODO Autoset resolution
  


  const [duration, setDuration] = useState(0);
  const handleSetDuration = val => {
    if(upload === true && player != null){      
      console.log("Initializing...")
      num_frames = Math.round(val * frame_rate);

      frame_data = new Array(num_frames)
      annotation_data = new Array(num_frames)

      //TODO Update this later
      for (var i = 0; i < num_frames; i++){
        frame_data[i] = []
        annotation_data[i] = []
      }
      upload = false;
      disable_buttons = false
    }
    setDuration(parseInt(val))
    console.log(val)
  }


  const handleSetCurrentFrame = val => {
    save_data(currentFrame)
    var total_frames = duration * frame_rate
    currentFrame = (val['played']/total_frames)
    currentFrame = (Math.round(val['played']*total_frames))
    handle_visual_toggle()
    /*if(oldAnnotation != null){ //ANNOTATIONS FOR MCPT (Multi Camera Pig Tracking) additions. TODO add in another class to process all instead of doing per-frame basis which is slow and inefficient.)
      //fabricCanvas.clear();
      var bbox = new FrameBoundingBox(oldAnnotation.getAllObjectByFrame(currentFrame), scaling_factor_width, scaling_factor_height).generate_frame()
      for(var i = 0; i < bbox.length; i++){
        var curr_obj = bbox[i]
        console.log(curr_obj)
        fabricCanvas.add(curr_obj);
        fabricCanvas.setActiveObject(curr_obj);
        fabricCanvas.fire('saveData');
      }
    }*/

  }

  const [scrubbing, setScrubbing] = useState(true);

  const skip_frame_forward = e =>{
    save_previous_data()
    if(scrubbing === false){
      if (annotation_data[currentFrame+skip_value].length == 0){
        annotation_data[currentFrame+skip_value] = JSON.parse(JSON.stringify(annotation_data[currentFrame]));
        frame_data[currentFrame+skip_value] = frame_data[currentFrame];
        console.log("Carryover annotation")
      }
    }

    var total_frames = duration * frame_rate
    console.log((((player.getCurrentTime()/duration)*total_frames))/(total_frames) + (skip_value/total_frames))
    player.seekTo((((player.getCurrentTime()/duration)*total_frames))/(total_frames) + (skip_value/total_frames))
  }

  const skip_frame_backward = e => {
    save_previous_data()
    var total_frames = duration * frame_rate
    player.seekTo((((player.getCurrentTime()/duration)*total_frames))/(total_frames) - (skip_value/total_frames))
  }

  const downloadFile = async () => {
    var fileName = "generated_annotations";
    if(ANNOTATION_VIDEO_NAME !== "" && ANNOTATOR_NAME !== ""){
      fileName = ANNOTATION_VIDEO_NAME.split('.').slice(0, -1).join('.') + "_" +  ANNOTATOR_NAME
    }
    //const json = JSON.stringify(fabricCanvas.getObjects());
    const json = JSON.stringify({"annotations": frame_data, "behavior_data": annotation_data})
    //var json = JSON.stringify(frame_data);
    var blob = new Blob([json],{type:'application/json'});
    var href = await URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [save, changeSave] = useState(false);
  
  const [keyCheck, changeKeyCheck] = useState(true)
  const handle_key_check = (event) => {
    changeKeyCheck(!keyCheck)
    console.log("Changing keyCheck to: " + keyCheck)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onKeyPress = (event) =>{
    //Making sure input for textbox doesnt get counted as a mode change
    if(keyCheck == false){
      return;
    }
    //TODO Add keystroke disabling when typing in values in other parts

    if (event.key === ANNOTATION_BBOX){
      toast_text = "Mode Switch: Bounding Box"
      changeSave(true)
      setAnnotationType(ANNOTATION_BBOX)
    }else if (event.key === ANNOTATION_KEYPOINT){
      toast_text = "Mode Switch: Key Point"
      changeSave(true)
      setAnnotationType(ANNOTATION_KEYPOINT)
    }else if(event.key === ANNOTATION_SEG) {
      toast_text = "Mode Switch: Segmentation"
      changeSave(true)
      setAnnotationType(ANNOTATION_SEG)
    }else if(event.key === ANNOTATION_FRAME){
      toast_text = "Mode Switch: Behavior Annotation"
      changeSave(true)
      setAnnotationType(ANNOTATION_FRAME)
    }else if (event.key === "a"){
      var annotext = ""
      if(annotationType === ANNOTATION_BBOX){
        annotext = "Bounding Box"
      }else if(annotationType === ANNOTATION_FRAME){
        annotext = "Behavior Data"
      }else if (annotationType === ANNOTATION_KEYPOINT){
        annotext = "Keypoint"
      }else if (annotationType === ANNOTATION_SEG){
        annotext = "Segmentation"
      }
      toast_text = "Added Annotation - " + annotext
      changeSave(true)
      addToCanvas()
    }else if (event.key === "r"){
      //TODO Determine if having a remove key is efficient or the deletion can be done directly from UI
      //toast_text = "Removed Annotation"
      //changeSave(true)
      //remove()
    }else if (event.key === "q"){
      skip_frame_backward()
    }else if (event.key === "w"){
      handlePlaying()
    }else if (event.key === "e"){
      skip_frame_forward()
    }else if (event.key === "s"){
      toast_text = "Annotation Saved"
      changeSave(true)
      frame_data[currentFrame] = fabricCanvas.toJSON()
    }else if (event.key === "f"){
      if(scrubbing === false){
        toast_text = "Scrubbing Mode Activated"
        setScrubbing(true)
        changeSave(true)
      }else{
        toast_text = "Scrubbing Mode Deactivated"
        setScrubbing(false)
        changeSave(true)
      }
    }else if(event.key === "c"){
      toast_text = "Copying previous frame annotation"
      annotation_data[currentFrame] = JSON.parse(JSON.stringify(previous_annotation))
      frame_data[currentFrame] = JSON.parse(JSON.stringify(previous_canvas_annotation))
      changeSave(true)
    }
  }  

  const [test, changeTest] = useState(false);
 
  useEffect(() => {
    document.addEventListener("keydown", onKeyPress);
    return () => document.removeEventListener("keydown", onKeyPress);
  }, [onKeyPress]);
  
  fabricCanvas.loadFromJSON(frame_data[currentFrame], function() {
    fabricCanvas.renderAll();
  });

  const handle_link_open = () => {
    window.open("https://forms.gle/CrJuYEoT39uFgnR17", "_blank")
  }

  /*
    <NavDropdown disabled={disable_buttons} title="Mode" id="basic-nav-dropdown">
    <NavDropdown.Item onClick={setAnnotationType(ANNOTATION_BBOX)} >Square Box</NavDropdown.Item>
    <NavDropdown.Divider />
    <NavDropdown.Item onClick={setAnnotationType(ANNOTATION_KEYPOINT)}>Key Point</NavDropdown.Item>
    <NavDropdown.Divider />
    <NavDropdown.Item onClick={setAnnotationType(ANNOTATION_SEG)}>Segmentation</NavDropdown.Item>
  </NavDropdown>
  */ 
  const handle_visual_toggle = () => {
    setVisualToggle(visualToggle+1)
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" className="bg-5">
          <Navbar.Brand href="#home">Annotation Tool</Navbar.Brand>
          <Nav className="mr-auto">
              <Nav.Link onClick={handleShow}>Instructions</Nav.Link>



              <NavDropdown disabled={disable_buttons} title="Export" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={downloadFile}>JSON</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item >CSV</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Divider />
                Frame Rate: <input type="number" defaultValue="15"></input>
                <NavDropdown.Divider />
                Horizontal Res: <input type='number' defaultValue={video_width}></input>
                <NavDropdown.Divider />
                Vertical Res: <input type='number' defaultValue={video_height}></input>
                <NavDropdown.Divider />
                Skip Value: <input type='number' defaultValue="1" onChange={(event) => {skip_value = parseInt(event.target.value)}}></input>
                <NavDropdown.Divider />
                Annotator Name: <input type='text' defaultValue="" onChange={(event) => {ANNOTATOR_NAME = (event.target.value)}}></input>
              </NavDropdown>

              <Nav.Link onClick={handle_link_open}>Report</Nav.Link>
          </Nav>

          <div>
            <Form style={{float: "left", width: 80}}>
              <Form.File disabled={disable_buttons} id="file" label="Annotation Upload" custom type="file" onChange={handleOldAnnotation}/>
            </Form>
            <Form style={{float: "left", width: 80}}>
              <Form.File id="file" label="Video Upload" accept=".mp4" custom type="file" onChange={handleVideoUpload} />
            </Form>
            <Button variant="secondary" disabled={true}>Frame # {parseInt(currentFrame)+' / '+parseInt(duration * frame_rate)}</Button>{' '}
            <Button variant="primary" disabled={disable_buttons} onClick={skip_frame_backward}>Prev</Button>{' '}
            <Button variant="primary" disabled={disable_buttons} onClick={handlePlaying}>{play_button_text}</Button>{' '}
            <Button variant="primary" disabled={disable_buttons} onClick={skip_frame_forward}>Next</Button>{' '}
            <Button variant="success" disabled={disable_buttons} onClick={addToCanvas} style={{position:"relative"}}>Add</Button>{' '}
            {/*<Button variant="danger" onClick={remove} disabled={disable_buttons} style={{position:"relative"}}>Remove</Button>{' '}*/}
          </div>
      </Navbar>
      <Toast onClose={() => changeSave(false)} show={save} delay={500} autohide
          style={{
            position: 'absolute',
            top: 0,
            left: '40%',
            zIndex: 100
          }}>
        <Toast.Header>
          <strong className="mr-auto">{toast_text}</strong>
        </Toast.Header>
      </Toast>
      <Modal show={show} onHide={handleClose} size='lg'>
          <Modal.Header closeButton>
          <Modal.Title>Instructions</Modal.Title>
          </Modal.Header>
          <Modal.Body><Instructions></Instructions></Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
      </Modal>
      <div style={{display: "grid"}}>
        <div style={{gridColumn: 1, gridRow:1, position: "relative", width: scaling_factor_width, height: scaling_factor_height, top: 0, left: 0}}>
          <ReactPlayer 
            onProgress={handleSetCurrentFrame} 
            ref={handleSetPlayer} 
            onDuration={handleSetDuration} 
            url={videoFilePath} 
            width='100%'
            height='99.999%'
            playing={playing} 
            controls={false} 
            style={{position:'absolute', float:'left', top:0, left:0}}
            volume={0}
            muted={true}
            pip={false}
          />
        </div>
        <div style={{gridColumn: 1, gridRow:1, position: "relative",  top: 0, left: 0}}>
          <Fabric/>
        </div>
        <div style={{gridColumn: 1, gridRow:2, position: "relative", width: scaling_factor_width, top: 0, left: 0}}>

          <input
            style={{width: scaling_factor_width}}
            type='range' min={0} max={0.999999} step='any'
            value={sliderPercent}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
        <div style={{gridColumn: 2, gridRow:1, position: "relative",width: scaling_factor_width*.4, height: scaling_factor_height, top: 0, left: 0}}>
          <div>
            <BootstrapTable
              keyField='id'
              data={annotation_data[currentFrame]} 
              columns={ columns }
              table
              noDataIndication={ () => <div>No recorded annotations or behaviors for this frame<br/>Please add an annotation or behavior tag to start.</div> }
              cellEdit={
                cellEditFactory({ mode: 'click', blurToSave: true,
                  afterSaveCell: (oldValue, newValue, row, column) => {
                    //console.log(annotation_data[currentFrame][row['id']])
                    annotation_data[currentFrame][row['id']] = row
                    changeKeyCheck(true)
                  },
                  onStartEdit: (row, column, rowIndex, columnIndex) => {
                    changeKeyCheck(false)
                  }
                }) 
              }
              pagination={ paginationFactory() }
            />
            </div>
        </div>
      </div>
    </div>
  );
}


export default MainUpload;