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
import { FrameData } from '../../backend_processing/frame_data'
import { Segmentation } from '../../backend_processing/segmentation'

const fabric = require("fabric").fabric;
const Nuclear = require("nuclear-js");
const createReactClass = require('create-react-class');


//TODO ADD DYNAMIC SOLUTION 
var frame_rate = 15;
const scaling_factor_height = 1080;
const scaling_factor_width = 1920;

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

var frame_data = [];
var upload = false;
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
    
    if (annotationType === 0){
      var new_bbox = new BoundingBox(fabricCanvas.height/2, fabricCanvas.width/2, 50, 50, color, 1, "id: 1").generate_no_behavior()+
      fabricCanvas.add(new_bbox)
      fabricCanvas.setActiveObject(new_bbox);
    }else if (annotationType === 1){
      var test = new KeyPoint().generate_stick(fabricCanvas)
    }else if (annotationType === 2){
      var test1 = new Segmentation().generate_polygon(fabricCanvas)
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
      frame_data = new Array(7200)
      //TODO Update this later
      for (var i = 0; i < 7200; i++){
        frame_data[i] = []
      }
      upload = false;
    }
  }

  const [duration, setDuration] = useState(0);
  const handleSetDuration = val => {
    setDuration(parseInt(val))
    console.log(val)
  }

  var tot = 0

  const [currentFrame, setCurrentFrame] = useState(0)
  const handleSetCurrentFrame = val => {
    console.log(val)
    var total_frames = duration * frame_rate
    tot = total_frames
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

  const [numBoundingBox, setNumBoundingBox] = useState(0)
  const handleNumBoundingBox = val => {
    setNumBoundingBox(numBoundingBox + 1);
    
  }


  const skip_frame_forward = e =>{
    var total_frames = duration * frame_rate
    //frame_data[currentFrame] = fabricCanvas.toJSON()
    console.log(currentFrame)
    console.log(frame_data)
    player.seekTo((((player.getCurrentTime()/duration)*total_frames)+1)/(total_frames))
  }

  const skip_frame_backward = e => {
    var total_frames = duration * frame_rate
    player.seekTo((((player.getCurrentTime()/duration)*total_frames)-1)/(total_frames))
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

  return (
    <div>
      <Navbar bg="dark" variant="dark" className="bg-5">
          <Navbar.Brand href="#home">Annotation Tool</Navbar.Brand>
          <Nav className="mr-auto">
              <Nav.Link onClick={handleShow}>Instructions</Nav.Link>

              <NavDropdown title="Annotation Type" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleSquareBox} >Square Box</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleKeyPoint}>Key Point</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleSegmentation}>Segmentation</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Export" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={downloadFile}>JSON</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item >CSV</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Divider />
                <NavDropdown.Item disabled={true}>Input Frame-Rate: <input type="text"></input></NavDropdown.Item>
              </NavDropdown>
          </Nav>
          <div>
            <Button variant="secondary" disabled="true">Frame # {parseInt(currentFrame)+' / '+parseInt(duration * frame_rate)}</Button>
            <Form style={{float: "left", width: 80}}>
              <Form.File id="file" label="Annotation Upload" custom type="file" onChange={handleOldAnnotation}/>
            </Form>
            <Form style={{float: "left", width: 80}}>
              <Form.File id="file" label="Video Upload" custom type="file" onChange={handleVideoUpload} />
            </Form>
            <Button variant="primary" onClick={skip_frame_backward}>Prev</Button>{' '}
            <Button variant="primary" onClick={handlePlaying}>{play_button_text}</Button>{' '}
            <Button variant="primary" onClick={skip_frame_forward}>Next</Button>{' '}
            
            <div style={{float: "right"}}>
              <Button onClick={addToCanvas} style={{position:"relative"}}>Add</Button>{' '}
              <Button onClick={remove} style={{position:"relative"}}>Remove</Button>{' '}
            </div>

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
        </div>
      </div>
    </div>
  );
}

//<ChangeTable data={frame_data[currentFrame]} style={{ float: "right"}}/>

export default MainUpload;