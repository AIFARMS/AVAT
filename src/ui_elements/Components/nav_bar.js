import React, { useEffect } from 'react';
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
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

import "react-datepicker/dist/react-datepicker.css";

import Instructions from './instructions';
import { downloadFileJSON } from '../../processing/download';

import ExportingAnnotation from '../../processing/exporting_annotation';
import ProcessVideo from './process_video';
import store from '../../store'
import { INPUT_IMAGE, INPUT_VIDEO } from '../../static_data/const'
import { useSelector } from "react-redux";
import UploadModal from './upload_modal';

import { initFrameData, updateFrameData, getFrameData, initAnnotationData, updateAnnotationData, getAnnotationData, initColumnData, setMedia, initMedia, setFrameRate, setMediaType, setSkipValue, getMetaData, togglePlay, setTotalFrames } from '../../processing/actions'
import { init } from '../../reducer/frame_data';

initMedia(1)
export default function CustomNavBar(props) {
	const [show, setShow] = useState(false);
	const [uploadShow, setUploadShow] = useState(true);
	const [videoFormat, setVideoFormat] = useState(INPUT_VIDEO)
	const [process, setProcess] = useState(false)
	const [playText, setPlayText] = useState(false)
	const [firstUpload, setFirstUpload] = useState(false)
	const [stateFrameRate, setStateFrameRate] = useState(null)
	const [stateSkipValue, setStateSkipValue] = useState(null)

	const play_redux = useSelector(state => state.play_status.play)

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleUploadToggle = () => {
		setUploadShow(!uploadShow)
	}


	const handleDownloadJSON = () => {
		var converted_annot = new ExportingAnnotation(store.getState().frame_data.data, props.video_width, props.video_height, getMetaData(), store.getState().media_data.data[0]).get_frame_json()
		console.log(converted_annot)
		downloadFileJSON(converted_annot, getMetaData())
	}

	const handlePlaying = (event) => {
		togglePlay()
	}

	useEffect(() => {
		if (play_redux == false) {
			setPlayText("Play")
		} else {
			setPlayText("Pause")
		}
	}, [play_redux])

	return (
		<div>
			<Modal
				show={show}
				onHide={handleClose}
				size='lg'
				backdrop='static'
			>
				<Modal.Header closeButton>
					<Modal.Title>Instructions</Modal.Title>
				</Modal.Header>
				<Modal.Body><Instructions></Instructions></Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>Close</Button>
				</Modal.Footer>
			</Modal>
			<UploadModal
				handleOldAnnotation={props.handleOldAnnotation}
				handleUploadToggle={handleUploadToggle}
				uploadShow={uploadShow}
			/>
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
					<Button variant="outline-success" onClick={handleUploadToggle}>Settings</Button>{' '}
					{' '}
					<Dropdown as={ButtonGroup}>
						<Button variant="secondary" disabled={true}>{props.display_frame_num}</Button>{' '}
						<Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
						<Dropdown.Menu>
							<Form>
								<Form.Label>Skip Value</Form.Label>
								<Form.Control
									placeholder='Skip Value'
									type='number'
									onChange={(event) => { setSkipValue(event.target.value) }}
									onClick={props.toggleKeyCheck(false)}
									onBlur={props.toggleKeyCheck(true)}
									defaultValue={props.skip_value}
								/>
							</Form>
						</Dropdown.Menu>
					</Dropdown>{' '}

					<Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_backward}>Prev</Button>{' '}
					{
						videoFormat === INPUT_VIDEO &&
						<Button variant="primary" disabled={props.disable_buttons} onClick={handlePlaying}>{playText}</Button>
					}
					{' '}
					<Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_forward}>Next</Button>{' '}
					<Dropdown as={ButtonGroup} drop='left'>
						<Button variant="success" onClick={props.addToCanvas}>Add</Button>
						<Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
						<Dropdown.Menu>
							<Dropdown.Item onClick={(event) => { props.change_annotation_type("1") }}>Behavior Annotation</Dropdown.Item>
							<Dropdown.Item onClick={(event) => { props.change_annotation_type("2") }}>BoundingBox</Dropdown.Item>
							<Dropdown.Item onClick={(event) => { props.change_annotation_type("3") }}>Segmentation</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					{/*<Button variant="danger" onClick={remove} disabled={disable_buttons} style={{position:"relative"}}>Remove</Button>{' '}*/}
				</div>
			</Navbar>
		</div>
	)
}
