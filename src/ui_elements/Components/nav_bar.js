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
import { InputGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';

import Instructions from './instructions';
import { downloadFileJSON , downloadFileCSV} from '../../processing/download';

export default function CustomNavBar(props){
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [uploadShow, setUploadShow] = useState(false);
	const handleUploadClose = () => setUploadShow(false)
	const handleUploadShow = () => setUploadShow(true)

	const handleDownloadJSON = () => {
		downloadFileJSON(props.ANNOTATION_VIDEO_NAME, props.ANNOTATOR_NAME, props.frame_data, props.annotation_data, props.VIDEO_METADATA)
	}

	const handleDownloadCSV = () => {
		downloadFileCSV(props.ANNOTATION_VIDEO_NAME, props.ANNOTATOR_NAME, props.annotation_data, props.columns)
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
			<Modal.Title>Upload</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div style={{display: "grid"}}>
					<div style={{float: "left",gridColumn: 1, gridRow:1}}>Annotator Name: <input type='text' defaultValue={props.ANNOTATOR_NAME} onChange={(event) => {props.change_annotator_name(event.target.value)}}></input><NavDropdown.Divider /></div>
					
					<Form style={{float: "left",gridColumn: 1, gridRow:2}}>
						<Form.File id="file" label="Video Upload" accept=".mp4" custom type="file" onChange={props.handleVideoUpload} />
					</Form>
					<Form style={{float: "left",gridColumn: 1, gridRow:3}}>
						<Form.File disabled={props.disable_buttons} accept=".json" id="file" label="Annotation Upload" custom type="file" onChange={props.handleOldAnnotation}/>
					</Form>
						<NavDropdown.Divider />
						Frame Rate: <input type="number" defaultValue="15"></input>
						<NavDropdown.Divider />
						Skip Value: <input type='number' defaultValue="1" onChange={(event) => {props.change_skip_value(parseInt(event.target.value))}}></input>
						Playback Rate: <input type='number' defaultValue="1" onChange={(event) => {props.handleSetPlaybackRate(parseInt(event.target.value))}}></input>
						<NavDropdown.Divider />
						Horizontal Res: <input type='number' defaultValue={props.video_width}></input>
						Vertical Res: <input type='number' defaultValue={props.video_height}></input>
						<NavDropdown.Divider />
						
				</div>
			</Modal.Body>
			<Modal.Footer>
			<Button variant="secondary" onClick={handleUploadClose}>Close</Button>
			</Modal.Footer>
		</Modal>
		<Navbar bg="dark" variant="dark" className="bg-5">
				<Navbar.Brand href="#home">Annotation Tool</Navbar.Brand>
				<Nav className="mr-auto">
						<NavDropdown disabled={props.disable_buttons} title="Export" id="basic-nav-dropdown">
							<NavDropdown.Item onClick={handleDownloadJSON}>JSON</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item onClick={handleDownloadCSV}>CSV</NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="Help" id="basic-nav-dropdown">
							<NavDropdown.Item onClick={props.handle_link_open}>Report</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item onClick={handleShow}>Instructions</NavDropdown.Item>
						</NavDropdown>
				</Nav>
				<div>
					<Button variant="outline-success" onClick={handleUploadShow}>Upload</Button>{' '}
					<Dropdown as={ButtonGroup}>
						<Button variant="secondary" disabled={true}>{props.display_frame_num}</Button>{' '}
						<Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
						<Dropdown.Menu>
							Skip Value: <input type='number' defaultValue="1" onChange={(event) => {props.change_skip_value(parseInt(event.target.value))}}></input>
							Playback Rate: <input type='number' defaultValue="1" onChange={(event) => {props.handleSetPlaybackRate(parseInt(event.target.value))}}></input>
						</Dropdown.Menu>
					</Dropdown>{' '}
					
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