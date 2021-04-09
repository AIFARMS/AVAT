import React, { useState } from "react"; 
import ReactDOM from 'react-dom'
import './App.css';
import ReactPlayer from 'react-player'

const fabric = require("fabric").fabric;
const Nuclear = require("nuclear-js");
const createReactClass = require('create-react-class');

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
    	height: window.innerHeight * .75,
      width: window.innerWidth-200 * .75,
      backgroundColor : null,
    });
    
    // on mouse up lets save some state
    fabricCanvas.on('mouse:up', () => {
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

var player_add;

var NewObjects = createReactClass({
	mixins: [reactor.ReactMixin],
  getDataBindings() {
  	return {
    	fabricData: ['fabricStore', 'fabricData'],
    	activeObject: ['fabricStore', 'activeObject'],
    };
  },
  render: function() {
  	if (this.state.fabricData.get('objects').size == 0) {
    	// no object is on the canvas so show interface to add one
      //<input type="file" id="video_submit" value="none"/> //onClick={this.addKanalImg}/>
      return (
      <div style={{float: "right"}}>
        <br></br>
        <button onClick={this.addSquare} style={{position:"relative"}}>Add Square</button>
        <br></br>
        <button onClick={this.remove} style={{position:"relative"}}>Remove</button>
      </div>
      );
    } else {
    	// an object is selected so lets interact with it
    	return (
        <div style={{float: "right"}}>
          <br></br>
          <button onClick={this.addSquare} style={{position:"relative"}}>Add Square</button>
          <br></br>
          <button onClick={this.remove} style={{position:"relative"}}>Remove</button>
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
    	height: 50,
    	width: 50,
      originX: 'center',
      originY: 'center',
      fill: color,
      borderColor: '#000',
      opacity: '.4',
      top: fabricCanvas.height / 2,
      left: fabricCanvas.width / 2,
    })
  	fabricCanvas.add(bounding_box);
    fabricCanvas.setActiveObject(bounding_box);
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
    console.log(fabricCanvas.getActiveObject())
  	if (this.state.fabricObject) {
    	// if an object exists in state we can acess the data from any where in the app
    	var fill = this.state.fabricObject.get('fill');
      console.log((fabricCanvas.getObjects()))
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

function App() {
  const [videoFilePath, setVideoFileURL] = useState(null);
  const handleVideoUpload = (event) => {
    setVideoFileURL(URL.createObjectURL(event.target.files[0]));
    };
  const [videoFilePath1, setVideoFileURL1] = useState(null);
  const handleVideoUpload1 = (event) => {
    setVideoFileURL(URL.createObjectURL(event.target.files[0]));
    };
  return (
    <div className="App">
      <div style={{ float: 'right' , position:'relative'}}>
    		<ActiveObject />
    		<NewObjects />
      </div>
      <input type="file" onChange={handleVideoUpload} />
      <ReactPlayer url={videoFilePath} width="75%" height="75%" controls={false} style={{position:'absolute'}}/>
      <Fabric/>
    </div>
  );
}

export default App;
