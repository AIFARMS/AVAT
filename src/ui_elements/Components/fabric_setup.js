import React, { useState } from "react"; 
import ReactDOM from 'react-dom'

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

var NewObjects = createReactClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {
            fabricData: ['fabricStore', 'fabricData'],
            activeObject: ['fabricStore', 'activeObject'],
        };
    },
  render: function() {
  	//if (this.state.fabricData.get('objects').size == 0) {
    	// no object is on the canvas so show interface to add one
      //<input type="file" id="video_submit" value="none"/> //onClick={this.addKanalImg}/>
      return (
      <div style={{float: "right"}}>
        <br></br>
        <button onClick={this.addSquare} style={{position:"absolute"}}>Add Square</button>
        <br></br>
      </div>
      );
    /*} else if (this.state.activeObject) {
    	// an object is selected so lets interact with it
    	return (<div>
      	<div style={{ border: '1px solid', padding: '10px 5px 5px', margin: '15px 10px 0 0' }}>
          Set Color:
          <button onClick={this.setRed}>Red</button>
          <button onClick={this.setGreen}>Green</button>
          <button onClick={this.setBlue}>Blue</button>
        </div>
        <br />
        <button onClick={this.remove}>Delete Object</button>
      </div>);
    } *///else {
    	// if there is an object but it is not selected then remove the buttons
    	//return null;
    //}
  },
  addPlayer(){
    var val = document.getElementById('og:image').value,
                src = 'http://webpage.com/images/' + val +'.png',
                img = document.createElement('img');

            img.src = src;
            document.body.appendChild(img);
  },
  addCircle() {
  	// all our action handler can just talk directly to fabric
  	fabricCanvas.add(new fabric.Circle({
    	radius: 50,
      originX: 'center',
      originY: 'center',
      fill: '#FFF',
      top: fabricCanvas.height / 2,
      left: fabricCanvas.width / 2,
    }));
    fabricCanvas.setActiveObject(fabricCanvas.getObjects()[0]);
    
    // when we are done makeing changes send the state from fabric
    fabricCanvas.fire('saveData');
  },
  addSquare() {
    var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
  	fabricCanvas.add(new fabric.Rect({
    	height: 100,
    	width: 100,
      originX: 'center',
      originY: 'center',
      fill: color,
      borderColor: '#000',
      opacity: '.4',
      top: fabricCanvas.height / 2,
      left: fabricCanvas.width / 2,
    }));
    fabricCanvas.setActiveObject(fabricCanvas.getObjects()[0]);
    fabricCanvas.fire('saveData');
  },
  addKanalImg(){/*
    fabric.Image.fromURL('https://vignette.wikia.nocookie.net/rainbowsix/images/8/8f/Kanal_1st_floor_227430.png/revision/latest?cb=20151202214817', function(image) {
      image.set({
        left: 0,
        top: 0,
        angle: 0
      })
      .scale(.8)
      .setCoords();

      fabricCanvas.add(image);
    });*/
    fabric.Image.fromURL('https://vignette.wikia.nocookie.net/rainbowsix/images/8/8f/Kanal_1st_floor_227430.png/revision/latest?cb=20151202214817', function(img) {
      // add background image
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
         scaleX: fabricCanvas.width / img.width,
         scaleY: fabricCanvas.height / img.height
      });
   });
  },
  addSmokeImg(){
    fabricCanvas.setBackgroundColor(null, fabricCanvas.renderAll.bind(fabricCanvas));
    fabric.Image.fromURL('https://www.vhv.rs/dpng/d/579-5793740_rainbow-six-operator-icons-hd-png-download.png', function(image) {
      image.set({
        left: 0,
        top: 0,
        angle: 0
      })
      .scale(.05)
      .setCoords();

      fabricCanvas.add(image);
    });
  },
  
  setRed() {
  	// another instance where we are just talking to fabric directly
  	fabricCanvas.getActiveObject().fill = 'red';
    fabricCanvas.fire('saveData');
  },
  setGreen() {
  	fabricCanvas.getActiveObject().fill = 'green';
    fabricCanvas.fire('saveData');
  },
  setBlue() {
  	fabricCanvas.getActiveObject().fill = 'blue';
    fabricCanvas.fire('saveData');
  },
  remove() {
    fabricCanvas.remove(fabricCanvas.getActiveObject());
    fabricCanvas.fire('saveData');
  }
});
export default NewObjects