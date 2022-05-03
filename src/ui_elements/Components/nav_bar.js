import React from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { NavDropdown, NavLink } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import { ButtonGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'

import "react-datepicker/dist/react-datepicker.css";

import Instructions from './instructions';
import { downloadFileJSON} from '../../processing/download';

import ExportingAnnotation from '../../processing/exporting_annotation';
import ProcessVideo from './process_video';
import store from '../../store' 
import {INPUT_IMAGE, INPUT_VIDEO} from '../../static_data/const'

import {initFrameData, updateFrameData, getFrameData, initAnnotationData, updateAnnotationData, getAnnotationData, initColumnData, setMedia, initMedia, setFrameRate, setMediaType, setSkipValue, getMetaData} from '../../processing/actions'

initMedia(1)
export default function CustomNavBar(props){
	const [show, setShow] = useState(false);
	const [uploadShow, setUploadShow] = useState(true);
	const [videoFormat, setVideoFormat] = useState(INPUT_VIDEO)
	const [process, setProcess] = useState(false)
	const [columnLoad, setColumnLoad] = useState(false)
	const [numStrems, setNumStreams] = useState(1)

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleUploadClose = () => {setUploadShow(false); setProcess(true)}
	const handleUploadShow = () => {
		setUploadShow(true)
	}

	const handleDownloadJSON = () => {
		var converted_annot = new ExportingAnnotation(store.getState().frame_data.data, props.video_width, props.video_height, props.VIDEO_METADATA, store.getState().media_data.data[0]).get_frame_json()
		downloadFileJSON(converted_annot, props.annotation_data, getMetaData())
	}
	const handleVideoFormat = (type) => {
		//TODO Make sure bug is resolved and simply have video format equal type
		//type = parseInt(type)
		if(type === INPUT_VIDEO){
			setVideoFormat(INPUT_VIDEO)
			setMediaType(INPUT_VIDEO)
		}else if (type === INPUT_IMAGE){
			setVideoFormat(INPUT_IMAGE)
			setMediaType(INPUT_IMAGE)
		}else {
			alert("Wrong input detected - please report this bug.")
		}
	}

	const handleMediaUpload = (event) => {
		if(videoFormat == INPUT_VIDEO){
			setMedia(parseInt(event.target.id), event.target.files)
		}else{
			setMedia(parseInt(event.target.id), event.target.files)
		}
	}

	const handleColumnUpload = (event) => {
		var promise = downloadColumn(event)
		promise.then(function (result) {
			if(result != null){
				setColumnLoad(true);
				initColumnData(result)
			}else{
				alert("Error in processing columns")
			}
		})
	}

	const downloadColumn = (file) => {
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.onload = function(e) {
				resolve((JSON.parse(e.target.result)));
			}
			reader.readAsText(file.target.files[0])
		})
	}

	const handleStreamNumChange = (event) => {
		setNumStreams(event.target.value)
		initMedia(event.target.value)
	}

	const generateUploadButtons = () => {
		var uploadButtons = []
		for(var i = 0; i < numStrems; i++){
			let button_image = (
				<Form key={i} style={{float: "left",gridColumn: 1, gridRow:4}}>
					<Form.File multiple id={i+""} key={i} label={"Image Upload " + i} accept="image/*" custom type="file" onChange={(event) => {handleMediaUpload(event)}} />
				</Form>
			)
			let button_video = (
				<Form key={i} style={{float: "left",gridColumn: 1, gridRow:4}}>
					<Form.File id={i+""} key={i} label={"Video Upload " + i} accept=".mp4" custom type="file" onChange={(event) => {handleMediaUpload(event)}} />
				</Form>
			)
			if (videoFormat === INPUT_IMAGE){
				uploadButtons.push(button_image)
			}else if (videoFormat === INPUT_VIDEO){
				uploadButtons.push(button_video)
			}
		}
		return (
			<div>
			{
				uploadButtons.map((but, _) => {
					return (
						but
					)
				})
			}
			</div>
		)
		
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
					{/*onClick and onBlur events are for the sole purpose to stop the eventKeys from firing off*/}
					<Form >
						Media Format: 
						<Form.Control
							as="select"
							id="inlineFormCustomSelect"
							onChange={(event)=>{handleVideoFormat(event.target.value)}}
							defaultValue={videoFormat}
						>
							<option value={INPUT_VIDEO}>Video</option>
							<option value={INPUT_IMAGE}>Image</option>
						</Form.Control>
						<NavDropdown.Divider />
					</Form>
					<div>
						Stream Num: <input type="number" defaultValue={1} onClick={(event) => {props.toggleKeyCheck(false)}} onBlur={(event) => {props.toggleKeyCheck(true)}} onChange={handleStreamNumChange}></input>
					</div>
					<NavDropdown.Divider />
					{
						generateUploadButtons()
					}
					<NavDropdown.Divider />
					<Form >
						<Form.File disabled={props.disable_buttons} accept=".json" id="file" label="Column Upload" custom type="file" onChange={handleColumnUpload}/>
					</Form>
					<Form >
						<Form.File disabled={!columnLoad} accept=".json" id="file" label="Annotation Upload" custom type="file" onChange={props.handleOldAnnotation}/>
					</Form>
					<NavDropdown.Divider />
					Frame Rate: <input type="number" onClick={(event) => {props.toggleKeyCheck(false)}} onBlur={(event) => {props.toggleKeyCheck(true)}} onChange={(event) => {setFrameRate(event.target.value);}}></input>
					<NavDropdown.Divider />
					Skip Value: <input type='number' defaultValue="1" onChange={(event) => {setSkipValue(event.target.value)}}></input>
					<NavDropdown.Divider />
				</div>
			</Modal.Body>
			<Modal.Footer>
			<Button variant="success" onClick={handleUploadClose}>Upload</Button>
			</Modal.Footer>
		</Modal>
		<Navbar sticky="top" bg="dark" variant="dark" className="bg-5">
				<Navbar.Brand href="#home">AVAT</Navbar.Brand>
				<Nav className="mr-auto">
						<NavDropdown disabled={props.disable_buttons} title="Export" id="basic-nav-dropdown">
							<NavDropdown.Item onClick={handleDownloadJSON}>JSON</NavDropdown.Item>
							<NavDropdown.Divider />
						</NavDropdown>
						<NavLink onClick={handleShow}>Instructions</NavLink>
						<NavLink onClick={props.handle_link_open}>Report</NavLink>
				</Nav>
				<div>
					<Button variant="outline-success" onClick={handleUploadShow}>Upload</Button>{' '}
					{' '}
					<Dropdown as={ButtonGroup}>
						<Button variant="secondary" disabled={true}>{props.display_frame_num}</Button>{' '}
						<Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
						<Dropdown.Menu>
							Skip Value: <input type='number' defaultValue="1" onChange={(event) => {setSkipValue(event.target.value)}}></input>
						</Dropdown.Menu>
					</Dropdown>{' '}
					
					<Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_backward}>Prev</Button>{' '}
					{
						videoFormat === INPUT_VIDEO && 
						<Button variant="primary" disabled={props.disable_buttons} onClick={props.handlePlaying}>{props.play_button_text}</Button>
					}
					{' '}
					<Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_forward}>Next</Button>{' '}
					<Dropdown as={ButtonGroup} drop='left'>
						<Button variant="success" onClick={props.addToCanvas}>Add</Button>
						<Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
						<Dropdown.Menu>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("1")}}>Behavior Annotation</Dropdown.Item>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("2")}}>BoundingBox</Dropdown.Item>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("3")}}>Segmentation</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					{/*<Button variant="danger" onClick={remove} disabled={disable_buttons} style={{position:"relative"}}>Remove</Button>{' '}*/}
				</div>
		</Navbar>
		</div>
	)
}