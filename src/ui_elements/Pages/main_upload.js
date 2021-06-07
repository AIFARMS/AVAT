import React, { useState } from "react"; 
import ReactDOM from 'react-dom'
import ReactPlayer from 'react-player'
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

//import Custon_Nav_Bar from '../backend_processing/nav_bar'

import Annotation from '../../backend_processing/annotation'
import ChangeTable from '../Components/change_table'
import { NavDropdown } from "react-bootstrap";

import { BoundingBox } from '../../backend_processing/bounding_box'
import { wait } from "@testing-library/dom";

const fabric = require("fabric").fabric;
const Nuclear = require("nuclear-js");
const createReactClass = require('create-react-class');


//TODO ADD DYNAMIC SOLUTION 
var frame_rate = 15;
var scaling_factor = .8

var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret[key] = key;
    }
  }
  return ret;
};

var reactor = new Nuclear.Reactor({ debug: true });
var keys = keyMirror({ fabricData: null, activeObject: null });

// globally accessable fabricCanvas instance
var fabricCanvas = new fabric.Canvas();

// A place to put fabric data
var fabricStore = Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({
    	fabricData: {
      	objects: [],
      },
      activeObject: false,
    })
  },
  initialize() {
    this.on(keys.fabricData, this.saveFabricData)
    this.on(keys.activeObject, this.saveActiveObject)
  },
  saveFabricData(state, fabricData) {
		return state.set('fabricData', Nuclear.toImmutable(fabricData));
	},
  saveActiveObject(state, value) {
		return state.set('activeObject',value);
	}
});

reactor.registerStores({
  'fabricStore': fabricStore,
});

var Fabric = createReactClass({
	componentDidMount() {
  	var el = ReactDOM.findDOMNode(this);
    
    // Here we have the canvas so we can initialize fabric
    fabricCanvas.initialize(el, {
    	height: window.innerHeight* scaling_factor,
      width: window.innerWidth * scaling_factor,
      backgroundColor : null,
    });
    
    // on mouse up lets save some state
    fabricCanvas.on('mouse:up', () => {
      frame_data[global_currFrame] = fabricCanvas.toJSON()
      reactor.dispatch(keys.fabricData, fabricCanvas.toObject());
      reactor.dispatch(keys.activeObject, !!fabricCanvas.getActiveObject());
    });
    
    // an event we will fire when we want to save state
    fabricCanvas.on('saveData', () => {
    	reactor.dispatch(keys.fabricData, fabricCanvas.toObject());
      reactor.dispatch(keys.activeObject, !!fabricCanvas.getActiveObject());
      fabricCanvas.renderAll(); // programatic changes we make will not trigger a render in fabric
    });
  }, 
  render() {
    return <canvas></canvas>
  }
});



var NewObjects = createReactClass({
	mixins: [reactor.ReactMixin],
  getDataBindings() {
  	return {
    	fabricData: ['fabricStore', 'fabricData'],
    	activeObject: ['fabricStore', 'activeObject'],
    };
  },
  render: function() {
  	if (this.state.fabricData.get('objects').size === 0) {
    	// no object is on the canvas so show interface to add one
      //<input type="file" id="video_submit" value="none"/> //onClick={this.addKanalImg}/>
      return (
      <div style={{float: "right"}}>
        <Button onClick={this.addGroup} style={{position:"relative"}}>Add Square</Button>{' '}
        <Button onClick={this.remove} style={{position:"relative"}}>Remove</Button>{' '}
      </div>
      );
    } else {
    	// an object is selected so lets interact with it
    	return (
        <div style={{float: "right"}}>
          <Button onClick={this.addGroup} style={{position:"relative"}}>Add Square</Button>{' '}
          <Button onClick={this.remove} style={{position:"relative"}}>Remove</Button>{' '}
        </div>
      );
    }//else {
    	// if there is an object but it is not selected then remove the buttons
    	//return null;
    //}
  },
  addSquare() {
    var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
    var bounding_box = new fabric.Rect({
      hasRotatingPoint: false,
      uniScaleTransform: true,
    	height: 50,
    	width: 50,
      originX: 'center',
      originY: 'center',
      fill: color,
      borderColor: '#000',
      opacity: '.4',
      top: fabricCanvas.height / 2,
      left: fabricCanvas.width / 2,
    }, function(drop){
        console.log(drop)
    })
  	fabricCanvas.add(bounding_box);
    fabricCanvas.setActiveObject(bounding_box);
    fabricCanvas.fire('saveData');
  },
  addGroup(){
    var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
    var new_bbox = new BoundingBox(fabricCanvas, color, 1, "id: 1").generate_no_behavior()
    fabricCanvas.add(new_bbox);
    fabricCanvas.setActiveObject(new_bbox);
    fabricCanvas.fire('saveData');
  },
  remove() {
    fabricCanvas.remove(fabricCanvas.getActiveObject());
    fabricCanvas.fire('saveData');
  }
});

var ActiveObject = createReactClass({
	mixins: [reactor.ReactMixin],
  getDataBindings() {
  	return {
    	fabricObject: ['fabricStore', 'fabricData', 'objects', 0],
      activeObject: ['fabricStore', 'activeObject']
    };
  },
  render: function() {
    //return null;
    console.log(this.state.activeObject)
  	if (this.state.fabricObject) {
    	// if an object exists in state we can acess the data from any where in the app
    	var fill = this.state.fabricObject.get('fill');
      console.log((fabricCanvas.getActiveObject()))
      return (<div>
        <div><b>Active Object</b></div>
        <div>fill: <span style={{ color: fill}}>{this.state.fabricObject.get('fill')}</span></div>
        <div>top: {this.state.fabricObject.get('top')}</div>
        <div>left: {this.state.fabricObject.get('left')}</div>
        <div>angle: {this.state.fabricObject.get('angle')}</div>
        <div>scaleX: {this.state.fabricObject.get('scaleX')}</div>
        <div>scaleY: {this.state.fabricObject.get('scaleY')}</div>
      </div>);
    } else {
      console.log(fabricCanvas.getActiveObject())
    	return null;
    }
  },
});

function draw_annotation(x, y, width, height){

}

function parse_file(file){
  
}

var frame_data = [];
var upload = false;
var global_currFrame = 0;

//Current frame counter
function MainUpload() {
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
        setOldAnnotation(result)
        var test_Annotation = new Annotation(result)
        console.log(test_Annotation.getAllObjectByFrame(2));
      })
  }

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
  }

  const [numBoundingBox, setNumBoundingBox] = useState(0)
  const handleNumBoundingBox = val => {
    setNumBoundingBox(numBoundingBox + 1);
    
  }


  const skip_frame_forward = e =>{
    var total_frames = duration * frame_rate
    frame_data[currentFrame] = fabricCanvas.toJSON()
    console.log(currentFrame)
    console.log(frame_data)
    player.seekTo((((player.getCurrentTime()/duration)*total_frames)+1)/(total_frames))
  }

  const skip_frame_backward = e => {
    var total_frames = duration * frame_rate
    player.seekTo((((player.getCurrentTime()/duration)*total_frames)-1)/(total_frames))
  }

  frame_data[currentFrame] = fabricCanvas.toJSON()

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

  return (
    <div>
      <Navbar bg="dark" variant="dark" class="bg-5">
          <Navbar.Brand href="#home">Annotation Tool</Navbar.Brand>
          <Nav className="mr-auto">
              <Nav.Link onClick={handleShow}>Instructions</Nav.Link>

              <NavDropdown title="Annotation Type" id="basic-nav-dropdown">
                <NavDropdown.Item >Square Box</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item >Key Point</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item >Wire Frame</NavDropdown.Item>
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
            <NewObjects />
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
      <div style={{display: "flex"}}>
        <div style={{position: "relative"}}>
          <ReactPlayer 
            onProgress={handleSetCurrentFrame} 
            ref={handleSetPlayer} 
            onDuration={handleSetDuration} 
            url={videoFilePath} 
            width={window.innerWidth * scaling_factor} height={window.innerHeight * scaling_factor}
            playing={playing} 
            controls={false} 
            style={{position:'realtive', float:'left'}}
            volume={0}
            muted={true}
            pip={false}
          />
          <Fabric/>
          <input
            style={{width: window.innerWidth * scaling_factor}}
            type='range' min={0} max={0.999999} step='any'
            value={sliderPercent}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
        <ChangeTable data={frame_data[currentFrame]} style={{ float: "right"}}/>
      </div>
    </div>
  );
}
      //<ActiveObject />
      //<input type="file" onChange={handleVideoUpload1} />
      //<div>
        //<ReactPlayer url={videoFilePath1} width="50%" height="50%" controls={true} style={{position:'relative', float:'left'}}/>
        //<Fabric/>
      //</div>

export default MainUpload;