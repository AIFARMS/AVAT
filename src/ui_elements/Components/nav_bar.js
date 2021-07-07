import React from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { NavDropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'

export default function CustomNavBar(props){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
      <Navbar bg="dark" variant="dark" className="bg-5">
          <Navbar.Brand href="#home">Annotation Tool</Navbar.Brand>
          <Nav className="mr-auto">
              <Nav.Link onClick={handleShow}>Instructions</Nav.Link>



              <NavDropdown disabled={props.disable_buttons} title="Export" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={props.downloadFile}>JSON</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item >CSV</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Divider />
                Frame Rate: <input type="number" defaultValue="15"></input>
                <NavDropdown.Divider />
                Horizontal Res: <input type='number' defaultValue={props.video_width}></input>
                <NavDropdown.Divider />
                Vertical Res: <input type='number' defaultValue={props.video_height}></input>
                <NavDropdown.Divider />
                Skip Value: <input type='number' defaultValue="1" onChange={(event) => {props.skip_value = parseInt(event.target.value)}}></input>
                <NavDropdown.Divider />
                Annotator Name: <input type='text' defaultValue="" onChange={(event) => {props.ANNOTATOR_NAME = (event.target.value)}}></input>
              </NavDropdown>

              <Nav.Link onClick={props.handle_link_open}>Report</Nav.Link>
          </Nav>

          <div>
            <Form style={{float: "left", width: 80}}>
              <Form.File disabled={props.disable_buttons} id="file" label="Annotation Upload" custom type="file" onChange={props.handleOldAnnotation}/>
            </Form>
            <Form style={{float: "left", width: 80}}>
              <Form.File id="file" label="Video Upload" accept=".mp4" custom type="file" onChange={props.handleVideoUpload} />
            </Form>
            <Button variant="secondary" disabled={true}>{props.display_frame_num}</Button>{' '}
            <Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_backward}>Prev</Button>{' '}
            <Button variant="primary" disabled={props.disable_buttons} onClick={props.handlePlaying}>{props.play_button_text}</Button>{' '}
            <Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_forward}>Next</Button>{' '}
            <Button variant="success" disabled={props.disable_buttons} onClick={props.addToCanvas} style={{position:"relative"}}>Add</Button>{' '}
            {/*<Button variant="danger" onClick={remove} disabled={disable_buttons} style={{position:"relative"}}>Remove</Button>{' '}*/}
          </div>
      </Navbar>
        </div>
    )
}