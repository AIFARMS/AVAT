import React from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { NavDropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import { ButtonGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'

import Instructions from './instructions';
import { downloadFile } from '../../processing/misc';

export default function CustomNavBar(props){
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [uploadShow, setUploadShow] = useState(false);
	const handleUploadClose = () => setUploadShow(false)
	const handleUploadShow = () => setUploadShow(true)

	const handleDownload = () => {
		downloadFile(props.ANNOTATION_VIDEO_NAME, props.ANNOTATOR_NAME, props.frame_data, props.annotation_data, props.VIDEO_METADATA)
	}

	return (
		<div>
		<Modal show={show} onHide={handleClose} size='lg'>
			<Modal.Header closeButton>
			<Modal.Title>Instructions</Modal.Title>
			</Modal.Header>
			<Modal.Body><Instructions></Instructions></Modal.Body>
			<Modal.Footer>
			<Button variant="secondary" onClick={handleClose}>Close</Button>
			</Modal.Footer>
		</Modal>
		<Modal show={uploadShow} onHide={handleUploadClose} size='lg'>
			<Modal.Header closeButton>
			<Modal.Title>Uplaod</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div style={{display: "grid"}}>
					<Form style={{float: "left",gridColumn: 1, gridRow:1}}>
						<Form.File disabled={props.disable_buttons} accept=".json" id="file" label="Annotation Upload" custom type="file" onChange={props.handleOldAnnotation}/>
					</Form>
					<Form style={{float: "left",gridColumn: 1, gridRow:2}}>
						<Form.File id="file" label="Video Upload" accept=".mp4" custom type="file" onChange={props.handleVideoUpload} />
					</Form>
				</div>
			</Modal.Body>
			<Modal.Footer>
			<Button variant="secondary" onClick={handleUploadClose}>Close</Button>
			</Modal.Footer>
		</Modal>
		<Navbar bg="dark" variant="dark" className="bg-5">
				<Navbar.Brand href="#home">Annotation Tool</Navbar.Brand>
				<Nav className="mr-auto">
						<Nav.Link onClick={handleShow}>Instructions</Nav.Link>
						<NavDropdown disabled={props.disable_buttons} title="Export" id="basic-nav-dropdown">
							<NavDropdown.Item onClick={handleDownload}>JSON</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item >CSV</NavDropdown.Item>
						</NavDropdown>

						<NavDropdown title="Video" id="basic-nav-dropdown">
							<NavDropdown.Divider />
							Frame Rate: <input type="number" defaultValue="15"></input>
							<NavDropdown.Divider />
							Horizontal Res: <input type='number' defaultValue={props.video_width}></input>
							<NavDropdown.Divider />
							Vertical Res: <input type='number' defaultValue={props.video_height}></input>
							<NavDropdown.Divider />
							Skip Value: <input type='number' defaultValue="1" onChange={(event) => {props.change_skip_value(parseInt(event.target.value))}}></input>
						</NavDropdown>
						<NavDropdown title="Settings" id="basic-nav-dropdown">
							<NavDropdown.Divider />
							Annotator Name: <input type='text' defaultValue="" onChange={(event) => {props.change_annotator_name(event.target.value)}}></input>
						</NavDropdown>

						<Nav.Link onClick={props.handle_link_open}>Report</Nav.Link>
				</Nav>
			
				<div>
					<Button onClick={handleUploadShow}>hi</Button>

					<Button variant="secondary" disabled={true}>{props.display_frame_num}</Button>{' '}
					<Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_backward}>Prev</Button>{' '}
					<Button variant="primary" disabled={props.disable_buttons} onClick={props.handlePlaying}>{props.play_button_text}</Button>{' '}
					<Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_forward}>Next</Button>{' '}
					<Dropdown as={ButtonGroup} drop='left'>
						<Button variant="success" onClick={props.addToCanvas}>Add</Button>
						<Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
						<Dropdown.Menu>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("1")}}>Behavior Annotation</Dropdown.Item>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("2")}}>BoundingBox</Dropdown.Item>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("3")}}>KeyPoint</Dropdown.Item>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("4")}}>Segmentation</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					{/*<Button variant="danger" onClick={remove} disabled={disable_buttons} style={{position:"relative"}}>Remove</Button>{' '}*/}
				</div>
		</Navbar>
		</div>
	)
}