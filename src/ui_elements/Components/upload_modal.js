import React, { useEffect } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
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
import { loadFrameSource } from '../../processing/frame_source_registry'
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
    const [isProcessingVideo, setIsProcessingVideo] = useState(false)

	const frame_count = useSelector(state => state.metadata.total_frames)
    const frame_rate = useSelector(state => state.metadata.frame_rate)
    const mediaData = useSelector(state => state.media_data.data)

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleUpload = async () => {
		setIsProcessingVideo(true)
		try{
		setSkipValue(parseInt(stateSkipValue))
		if(!firstUpload && !uploadExistingAnnotation){
            let totalFrames = -1
            if(videoFormat === INPUT_VIDEO){
                const uploadedFile = mediaData?.[0]?.[0]
                if(!uploadedFile){
                    alert("Please upload a video file.")
                    return;
                }
                const frameSource = await loadFrameSource(0, uploadedFile)
                setFrameRate(frameSource.averageFrameRate)
                totalFrames = frameSource.totalFrames
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
			setFirstUpload(true)
		}else if(uploadExistingAnnotation){
            initColumnData(stateColumnData)
            if(videoFormat === INPUT_VIDEO){
                const uploadedFile = mediaData?.[0]?.[0]
                if(!uploadedFile){
                    alert("Please upload a video file.")
                    return;
                }
                const frameSource = await loadFrameSource(0, uploadedFile)
                let totalFrames = frameSource.totalFrames
                setTotalFrames(totalFrames)
            }
        }
		props.handleUploadToggle()
		}catch(error){
			alert(error.message || "Error processing video file.")
		}finally{
			setIsProcessingVideo(false)
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
				<div key={i} style={{ float: "left", gridColumn: 1, gridRow: 4 }}>
					<Input multiple id={i + ""} key={i} aria-label={"Image Upload"} accept="image/*" type="file" onChange={(event) => { handleMediaUpload(event) }} disabled={firstUpload} />
				</div>
			)
			let button_video = (
				<div key={i} style={{ float: "left", gridColumn: 1, gridRow: 4 }}>
					<Input id={i + ""} key={i} aria-label={"Video Upload"} accept=".mp4" type="file" onChange={(event) => { handleMediaUpload(event) }} disabled={firstUpload} />
				</div>
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
                <div className="grid gap-4 md:grid-cols-2">
                    <div>

                        <NativeSelect
                            id="inlineFormCustomSelect"
                            onChange={(event) => { handleVideoFormat(event.target.value) }}
                            defaultValue={videoFormat}
                            disabled={firstUpload}
                        >
                            <NativeSelectOption value={INPUT_VIDEO}>Video</NativeSelectOption>
                            <NativeSelectOption value={INPUT_IMAGE}>Image</NativeSelectOption>
                        </NativeSelect>
                    </div>
                    <div>
                        {
                            generateUploadButtons()
                        }
                    </div>

                </div>

                <Separator className="my-3" />

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                            <InputGroup className="mb-3">
                                <InputGroupInput
                                    type="number"
                                    onChange={(event) => { setStateFrameRate(event.target.value ? event.target.value : 1); }}
                                    disabled={true}
                                    placeholder={videoFormat === INPUT_VIDEO ? "Detected automatically" : "Not used for images"}
                                    aria-invalid={false}
                                    defaultValue={stateFrameRate}
                                />
                                <InputGroupAddon>
                                    <InputGroupText>Frame Rate</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                    </div>
                    <div>
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
                    </div>
                </div>
                <Separator className="my-3" />
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Input
                            disabled={props.disable_buttons || firstUpload}
                            accept=".json"
                            id="file"
                            aria-label="Column Upload"
                            type="file"
                            onChange={handleColumnUpload}

                        />
                    </div>
                    <div>
                        <Input
                            accept=".json"
                            id="file"
                            aria-label="Annotation Upload"
                            type="file"
                            onChange={toggleUploadExistingAnnotation}
                            disabled={props.disable_buttons || firstUpload}
                        />
                    </div>
                </div>
                <Separator className="my-3" />
            </div>
        <DialogFooter>
            <Button 
                onClick={handleUpload}
                disabled={(stateSkipValue == null || stateSkipValue == "") || props.disable_buttons || isProcessingVideo}
            >
                {isProcessingVideo ? "Processing Video..." : firstUpload ? "Save" : "Upload"}
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}
