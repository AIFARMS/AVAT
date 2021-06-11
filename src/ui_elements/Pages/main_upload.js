import React, { useEffect, useState } from "react"; 
import ReactDOM from 'react-dom'
import ReactPlayer from 'react-player'
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'


import AnnotationProcessing from '../../backend_processing/annotation-processing'
import ChangeTable from '../Components/change_table'
import { NavDropdown } from "react-bootstrap";

//Custom implemented classes
import { BoundingBox } from '../../backend_processing/bounding_box'
import { FrameBoundingBox } from '../../backend_processing/frame_bounding_box'
import { KeyPoint } from '../../backend_processing/key_point'
import { Segmentation } from '../../backend_processing/segmentation'
import { Annotation } from '../../backend_processing/annotation'

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {behaviors} from '../../static_data/behaviors'
import {posture} from '../../static_data/posture'


const columns = [{
  dataField: "id",
  text: "ID"
},{
  dataField: "behavior",
  text: "Beh",
  editor: {
      type: Type.SELECT,
      options: behaviors
    }
},{
  dataField: "is_hidden",
  text: "Hid"
},{
  dataField: "posture",
  text: "Pos",
  editor: {
      type: Type.SELECT,
      options: posture
    }
}]


const fabric = require("fabric").fabric;
const createReactClass = require('create-react-class');


//TODO ADD DYNAMIC SOLUTION 
var frame_rate = 15;
var num_frames = 7200;
const scaling_factor_height = 1080;
const scaling_factor_width = 1920;
var skip_value = 1;

// globally accessable fabricCanvas instance
var fabricCanvas = new fabric.Canvas('c', {uniScaleTransform: true});


var Fabric = createReactClass({
	componentDidMount() {
  	var el = ReactDOM.findDOMNode(this);
    
    // Here we have the canvas so we can initialize fabric
    fabricCanvas.initialize(el, {
    	height: 1080,
      width: 1920,
      backgroundColor : null,
    });
    
    // on mouse up lets save some state
    fabricCanvas.on('mouse:up', () => {
      frame_data[global_currFrame] = fabricCanvas.toJSON()
    });

    
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
var global_currFrame = 0;

//Current frame counter
function MainUpload() {
  
  const [annotationType, setAnnotationType] = useState(0)
  const handleAnnotationType = (event) => {
    console.log(event.target.value)
  }
  
  const [boxCount, setBoxCount] = useState(0)
  const addToCanvas = () =>{
    var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
    
    if(annotation_data[currentFrame] == null){
      annotation_data[currentFrame] = []
    }

    if (annotationType === 0){
      var new_bbox = new BoundingBox(fabricCanvas.height/2, fabricCanvas.width/2, 50, 50, color, boxCount, "None").generate_no_behavior()
      //annotation_data[currentFrame].push(new Annotation(boxCount, "None", "None", 0,0, new_bbox))
      annotation_data[currentFrame].push({id: boxCount, behavior: "None", is_hidden: 0, posture: "None"})
      fabricCanvas.add(new_bbox)
      fabricCanvas.setActiveObject(new_bbox);
    }else if (annotationType === 1){
      var keyp = new KeyPoint().generate_stick(fabricCanvas)
      annotation_data[currentFrame].push(new Annotation(boxCount, "None", "None", 0,1, keyp))
    }else if (annotationType === 2){
      var segment = new Segmentation().generate_polygon(fabricCanvas, boxCount)
      annotation_data[currentFrame].push(new Annotation(boxCount, "None", "None", 0,2, segment))
    }

    setBoxCount(boxCount + 1);
    fabricCanvas.fire('saveData');
  }

  const remove = () => {
    setBoxCount(boxCount + 1)
    fabricCanvas.remove(fabricCanvas.getActiveObject());
    fabricCanvas.fire('saveData');
  }

  const [videoFilePath, setVideoFileURL] = useState(null);
  const handleVideoUpload = (event) => {
    //console.log(oldAnnotation)
    setVideoFileURL(URL.createObjectURL(event.target.files[0]));
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
          setOldAnnotation(new AnnotationProcessing(result));
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
    console.log(oldAnnotation)
    console.log(oldAnnotation.getAllObjectByFrame(2));
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
  const [sliderPercent, setSliderPercent] = useState(0)

  const handleSeekChange = e => {
    setSliderPercent(parseFloat(e.target.value))
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
    setPlayer(val)
    if(upload === true && player != null){      
      console.log("RESET VALUES")
      frame_data = new Array(num_frames)
      annotation_data = new Array(num_frames)
      //TODO Update this later
      for (var i = 0; i < 7200; i++){
        frame_data[i] = []
        annotation_data[i] = []
      }
      upload = false;
      disable_buttons = false
    }
  }

  const [duration, setDuration] = useState(0);
  const handleSetDuration = val => {
    setDuration(parseInt(val))
    console.log(val)
  }


  const [currentFrame, setCurrentFrame] = useState(0)
  const handleSetCurrentFrame = val => {
    frame_data[currentFrame] = fabricCanvas.toJSON()
    console.log(currentFrame)

    var total_frames = duration * frame_rate
    setSliderPercent(currentFrame/total_frames)
    setCurrentFrame(Math.round(val['played']*total_frames))
    global_currFrame = currentFrame



    if(oldAnnotation != null){ 
      fabricCanvas.clear();
      var bbox = new FrameBoundingBox(oldAnnotation.getAllObjectByFrame(currentFrame), scaling_factor_width, scaling_factor_height).generate_frame()
      for(var i = 0; i < bbox.length; i++){
        var curr_obj = bbox[i]
        console.log(curr_obj)
        fabricCanvas.add(curr_obj);
        fabricCanvas.setActiveObject(curr_obj);
        fabricCanvas.fire('saveData');
      }
    }

  }

  const skip_frame_forward = e =>{
    var total_frames = duration * frame_rate
    player.seekTo((((player.getCurrentTime()/duration)*total_frames)+skip_value)/(total_frames))
  }

  const skip_frame_backward = e => {
    var total_frames = duration * frame_rate
    player.seekTo((((player.getCurrentTime()/duration)*total_frames)-skip_value)/(total_frames))
  }

  //frame_data[currentFrame] = fabricCanvas.toJSON()

  const downloadFile = async () => {
    const fileName = "generated_annotations";
    //const json = JSON.stringify(fabricCanvas.getObjects());
    const json = JSON.stringify(frame_data);
    const blob = new Blob([json],{type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSquareBox = () => {
    setAnnotationType(0);
  }

  const handleKeyPoint = () => {
    setAnnotationType(1);
  }

  const handleSegmentation = () => {
    setAnnotationType(2);
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onKeyPress = (event) =>{
    if(event.key === "s") {
      handleSegmentation()
    }else if (event.key === "b"){
      handleSquareBox()
    }else if (event.key === "k"){
      handleKeyPoint()
    }else if (event.key === "a"){
      addToCanvas()
    }else if (event.key === "r"){
      remove()
    }else if (event.key === "q"){
      skip_frame_backward()
    }
    else if (event.key === "w"){
      handlePlaying()
    }
    else if (event.key === "e"){
      skip_frame_forward()
    }
  }  
 
  useEffect(() => {
    document.addEventListener("keydown", onKeyPress);
    return () => document.removeEventListener("keydown", onKeyPress);
  }, [onKeyPress]);
  
  useEffect(() => {
    fabricCanvas.clear()
    console.log(currentFrame)
    fabricCanvas.loadFromJSON(frame_data[currentFrame], function() {
      console.log(frame_data[currentFrame])
      fabricCanvas.renderAll();
    });
  }, [currentFrame]);

  return (
    <div>
      <Navbar bg="dark" variant="dark" className="bg-5">
          <Navbar.Brand href="#home">Annotation Tool</Navbar.Brand>
          <Nav className="mr-auto">
              <Nav.Link onClick={handleShow}>Instructions</Nav.Link>

              <NavDropdown disabled={disable_buttons} title="Annotation Type" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleSquareBox} >Square Box</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleKeyPoint}>Key Point</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleSegmentation}>Segmentation</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown disabled={disable_buttons} title="Export" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={downloadFile}>JSON</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item >CSV</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown disabled={disable_buttons} title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Divider />
                Frame Rate: <input type="number" defaultValue="15"></input>
                <NavDropdown.Divider />
                Horizontal Res: <input type='number' defaultValue="3840"></input>
                <NavDropdown.Divider />
                Vertical Res: <input type='number' defaultValue="2178"></input>
                <NavDropdown.Divider />
                Skip Value: <input type='number' defaultValue="1" onChange={(event) => {skip_value = event.target.value}}></input>
              </NavDropdown>
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
            <Button variant="success" onClick={remove} disabled={disable_buttons} style={{position:"relative"}}>Remove</Button>{' '}
          </div>
      </Navbar>
      <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Instructions</Modal.Title>
          </Modal.Header>
          <Modal.Body>TODO: Add instructions</Modal.Body>
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
        <div style={{gridColumn: 1, gridRow:1, position: "relative", width: scaling_factor_width, height: scaling_factor_height, top: 0, left: 0}}>
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
        <div style={{gridColumn: 2, gridRow:1, position: "relative", width: scaling_factor_width, height: scaling_factor_height, top: 0, left: 0}}>
          <div style={{width: "15%"}}>
              <BootstrapTable 
                keyField='id' 
                data={annotation_data[currentFrame]} 
                columns={ columns } 
                cellEdit={ 
                  cellEditFactory({ mode: 'click', blurToSave: true, afterSaveCell: (oldValue, newValue, row, column) => {
                    annotation_data[currentFrame][row['id']] = row
                  } }) 
                }
              />
          </div>
        </div>
      </div>
    </div>
  );
}


export default MainUpload;