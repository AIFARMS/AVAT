import React, { useEffect } from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Button from 'react-bootstrap/Button'
import { NavDropdown, NavLink } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

import "react-datepicker/dist/react-datepicker.css";

import { INPUT_IMAGE, INPUT_VIDEO } from '../../static_data/const'
import { useSelector } from "react-redux";

import { initFrameData, updateFrameData, getFrameData, initAnnotationData, updateAnnotationData, getAnnotationData, initColumnData, setMedia, initMedia, setFrameRate, setMediaType, setSkipValue, getMetaData, togglePlay, setTotalFrames } from '../../processing/actions'
import { init } from '../../reducer/frame_data';
import media_data from '../../reducer/media_data';
import default_column from '../../static_data/basic_column_config.json'

export default function UploadModal(props){
	const [show, setShow] = useState(false);
	
	const [videoFormat, setVideoFormat] = useState(INPUT_VIDEO)
	const [firstUpload, setFirstUpload] = useState(false)
	const [stateFrameRate, setStateFrameRate] = useState(null)
	const [stateSkipValue, setStateSkipValue] = useState(null)
    const [stateColumnData, setStateColumnData] = useState(null)
    const [uploadExistingAnnotation, setUploadExistingAnnotation] = useState(false)

	const frame_count = useSelector(state => state.metadata.total_frames)
    const frame_rate = useSelector(state => state.metadata.frame_rate)

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleUpload = () => {
        props.handleUploadToggle()
		setSkipValue(parseInt(stateSkipValue))
		if(!firstUpload && !uploadExistingAnnotation){
			setFirstUpload(true)
            let totalFrames = -1
            if(videoFormat === INPUT_VIDEO){
                setFrameRate(parseInt(stateFrameRate))
                totalFrames = parseInt(parseInt(stateFrameRate) * frame_count)
            }else {
                totalFrames = frame_count
            }
			setTotalFrames(totalFrames)
			initFrameData(totalFrames)
            if (stateColumnData == null) {
                initColumnData(default_column)
            }else{
                initColumnData(stateColumnData)
            }
			initAnnotationData(totalFrames)
		}else if(uploadExistingAnnotation){
            initColumnData(stateColumnData)
            if(videoFormat === INPUT_VIDEO){
                let totalFrames = parseInt(parseInt(frame_rate) * parseInt(frame_count))
                setTotalFrames(totalFrames)
            }
        }
	}

    const toggleUploadExistingAnnotation = (event) => {
        props.handleOldAnnotation(event)
        setUploadExistingAnnotation(true)
    }

    const downloadColumn = (file) => {
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.onload = function (e) {
				resolve((JSON.parse(e.target.result)));
			}
			reader.readAsText(file.target.files[0])
		})
	}

    const handleVideoFormat = (type) => {
		//TODO Make sure bug is resolved and simply have video format equal type
		//type = parseInt(type)
		if (type === INPUT_VIDEO) {
			setVideoFormat(INPUT_VIDEO)
			setMediaType(INPUT_VIDEO)
		} else if (type === INPUT_IMAGE) {
			setVideoFormat(INPUT_IMAGE)
			setMediaType(INPUT_IMAGE)
		} else {
			alert("Wrong input detected - please report this bug.")
		}
	}
	const handleMediaUpload = (event) => {
		if (videoFormat == INPUT_VIDEO) {
			setMedia(parseInt(event.target.id), event.target.files)
		} else {
			setMedia(parseInt(event.target.id), event.target.files)
		}
	}

	const handleColumnUpload = (event) => {
		var promise = downloadColumn(event)
		promise.then(function (result) {
			if (result['columns'] == undefined) {
				alert("Error in processing columns. Please check the file and try again.")
				return;
			}

			if (result != null) {
                setStateColumnData(result)
			} else {
				alert("Error in processing columns. Please check the file and try again.")
				return;
			}
		})
	}

    const generateUploadButtons = () => {
		var uploadButtons = []
		for (var i = 0; i < 1; i++) {
			let button_image = (
				<Form key={i} style={{ float: "left", gridColumn: 1, gridRow: 4 }}>
					<Form.File multiple id={i + ""} key={i} label={"Image Upload"} accept="image/*" custom type="file" onChange={(event) => { handleMediaUpload(event) }} disabled={firstUpload} />
				</Form>
			)
			let button_video = (
				<Form key={i} style={{ float: "left", gridColumn: 1, gridRow: 4 }}>
					<Form.File id={i + ""} key={i} label={"Video Upload"} accept=".mp4" custom type="file" onChange={(event) => { handleMediaUpload(event) }} disabled={firstUpload} />
				</Form>
			)
			if (videoFormat === INPUT_IMAGE) {
				uploadButtons.push(button_image)
			} else if (videoFormat === INPUT_VIDEO) {
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

    return(
        <Modal show={props.uploadShow} size='lg' backdrop='static'>
        <Modal.Header>
            <Modal.Title>Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{ display: "grid" }}>
                {/*onClick and onBlur events are for the sole purpose to stop the eventKeys from firing off*/}
                <Form.Row>
                    <Col>

                        <Form.Control
                            as="select"
                            id="inlineFormCustomSelect"
                            onChange={(event) => { handleVideoFormat(event.target.value) }}
                            defaultValue={videoFormat}
                            htmlSize={2}
                            custom
                            disabled={firstUpload}
                        >
                            <option value={INPUT_VIDEO}>Video</option>
                            <option value={INPUT_IMAGE}>Image</option>
                        </Form.Control>
                    </Col>
                    <Col>
                        {
                            generateUploadButtons()
                        }
                    </Col>

                </Form.Row>

                <NavDropdown.Divider />

                <Form.Row>
                    <Col>
                        <Form.Group>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Frame Rate</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="number"
                                    onChange={(event) => { setStateFrameRate(event.target.value ? event.target.value : 1); }}
                                    disabled={(videoFormat === INPUT_IMAGE) || firstUpload}
                                    isInvalid={(stateFrameRate == null || stateFrameRate == undefined || stateFrameRate == "") && videoFormat !== INPUT_IMAGE}
                                    defaultValue={stateFrameRate}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a frame rate.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Skip Value</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type='number'
                                    onChange={(event) => { setStateSkipValue(event.target.value ? event.target.value : 1) }}
                                    isInvalid={stateSkipValue == null || stateSkipValue == undefined || stateSkipValue == ""}
                                    defaultValue={stateSkipValue}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a skip value.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                    </Col>
                </Form.Row>
                <NavDropdown.Divider />
                <Form.Row>
                    <Col >
                        <Form.File
                            disabled={props.disable_buttons || firstUpload}
                            accept=".json"
                            id="file"
                            label="Column Upload"
                            custom type="file"
                            onChange={handleColumnUpload}

                        />
                    </Col>
                    <Col >
                        <Form.File
                            accept=".json"
                            id="file"
                            label="Annotation Upload"
                            custom type="file"
                            onChange={toggleUploadExistingAnnotation}
                            disabled={props.disable_buttons || firstUpload}
                        />
                    </Col>
                </Form.Row>
                <NavDropdown.Divider />
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button 
                variant="success"
                onClick={handleUpload}
                disabled={((stateFrameRate == null || stateFrameRate == "") && videoFormat !== INPUT_IMAGE) || (stateSkipValue == null || stateSkipValue == "") || props.disable_buttons}
            >
                {firstUpload ? "Save" : "Upload"}
            </Button>
        </Modal.Footer>
    </Modal>
    )
}