import React, { useEffect } from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Separator } from '@/components/ui/separator';

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
					<Input multiple id={i + ""} key={i} aria-label={"Image Upload"} accept="image/*" type="file" onChange={(event) => { handleMediaUpload(event) }} disabled={firstUpload} />
				</Form>
			)
			let button_video = (
				<Form key={i} style={{ float: "left", gridColumn: 1, gridRow: 4 }}>
					<Input id={i + ""} key={i} aria-label={"Video Upload"} accept=".mp4" type="file" onChange={(event) => { handleMediaUpload(event) }} disabled={firstUpload} />
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
        <Dialog open={props.uploadShow}>
        <DialogContent className="sm:max-w-3xl" showCloseButton={false}>
        <DialogHeader>
            <DialogTitle>Upload</DialogTitle>
        </DialogHeader>
            <div style={{ display: "grid" }}>
                {/*onClick and onBlur events are for the sole purpose to stop the eventKeys from firing off*/}
                <Form.Row>
                    <Col>

                        <NativeSelect
                            id="inlineFormCustomSelect"
                            onChange={(event) => { handleVideoFormat(event.target.value) }}
                            defaultValue={videoFormat}
                            disabled={firstUpload}
                        >
                            <NativeSelectOption value={INPUT_VIDEO}>Video</NativeSelectOption>
                            <NativeSelectOption value={INPUT_IMAGE}>Image</NativeSelectOption>
                        </NativeSelect>
                    </Col>
                    <Col>
                        {
                            generateUploadButtons()
                        }
                    </Col>

                </Form.Row>

                <Separator className="my-3" />

                <Form.Row>
                    <Col>
                        <Form.Group>
                            <InputGroup className="mb-3">
                                <InputGroupInput
                                    type="number"
                                    onChange={(event) => { setStateFrameRate(event.target.value ? event.target.value : 1); }}
                                    disabled={(videoFormat === INPUT_IMAGE) || firstUpload}
                                    aria-invalid={(stateFrameRate == null || stateFrameRate == undefined || stateFrameRate == "") && videoFormat !== INPUT_IMAGE}
                                    defaultValue={stateFrameRate}
                                />
                                <InputGroupAddon>
                                    <InputGroupText>Frame Rate</InputGroupText>
                                </InputGroupAddon>
                                {(stateFrameRate == null || stateFrameRate == undefined || stateFrameRate == "") && videoFormat !== INPUT_IMAGE &&
                                    <FieldError>
                                        Please enter a frame rate.
                                    </FieldError>
                                }
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <InputGroup className="mb-3">
                                <InputGroupInput
                                    type='number'
                                    onChange={(event) => { setStateSkipValue(event.target.value ? event.target.value : 1) }}
                                    aria-invalid={stateSkipValue == null || stateSkipValue == undefined || stateSkipValue == ""}
                                    defaultValue={stateSkipValue}
                                />
                                <InputGroupAddon>
                                    <InputGroupText>Skip Value</InputGroupText>
                                </InputGroupAddon>
                                {(stateSkipValue == null || stateSkipValue == undefined || stateSkipValue == "") &&
                                    <FieldError>
                                        Please enter a skip value.
                                    </FieldError>
                                }
                            </InputGroup>
                        </Form.Group>

                    </Col>
                </Form.Row>
                <Separator className="my-3" />
                <Form.Row>
                    <Col >
                        <Input
                            disabled={props.disable_buttons || firstUpload}
                            accept=".json"
                            id="file"
                            aria-label="Column Upload"
                            type="file"
                            onChange={handleColumnUpload}

                        />
                    </Col>
                    <Col >
                        <Input
                            accept=".json"
                            id="file"
                            aria-label="Annotation Upload"
                            type="file"
                            onChange={toggleUploadExistingAnnotation}
                            disabled={props.disable_buttons || firstUpload}
                        />
                    </Col>
                </Form.Row>
                <Separator className="my-3" />
            </div>
        <DialogFooter>
            <Button 
                onClick={handleUpload}
                disabled={((stateFrameRate == null || stateFrameRate == "") && videoFormat !== INPUT_IMAGE) || (stateSkipValue == null || stateSkipValue == "") || props.disable_buttons}
            >
                {firstUpload ? "Save" : "Upload"}
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}
