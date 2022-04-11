import React from 'react';
import ReactDOM from 'react-dom'

export default class FabricRender extends React.Component{
    componentDidMount() {
        var el = ReactDOM.findDOMNode(this);
  
      //alert("Loaded player: \nHorizontal Resolution = " + scaling_factor_width + "\nVertical Resolution = " + scaling_factor_height)
      // Here we have the canvas so we can initialize fabric
      this.props.fabricCanvas.initialize(el, {
          height: this.props.scaling_factor_height,
        width: this.props.scaling_factor_width,
        backgroundColor : null,
      });
      
      // on mouse up lets save some state
      /*this.props.fabricCanvas.on('mouse:up', () => {
        this.props.save_data(this.props.currentFrame)
      });
  
      this.props.fabricCanvas.on('object:added', this.props.save_data(this.props.currentFrame));
      this.props.fabricCanvas.on('object:removed', this.props.save_data(this.props.currentFrame));
      this.props.fabricCanvas.on('object:modified', this.props.save_data(this.props.currentFrame));*/
      
      // an event we will fire when we want to save state
      this.props.fabricCanvas.on('saveData', () => {
        this.props.fabricCanvas.renderAll(); // programatic changes we make will not trigger a render in fabric
      });
    }

    render() {
      return <canvas id="canvas"></canvas>
    }
}