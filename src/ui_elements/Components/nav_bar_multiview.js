import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Separator } from '@/components/ui/separator';

import Instructions from './instructions';
import { downloadFileJSON , downloadFileCSV} from '../../processing/download';
import { Edit } from '../../annotations/segmentation_edit';

import ExportingAnnotation from '../../processing/exporting_annotation';
import ProcessVideo from './process_video';



export default function MultiviewCustomNavBar(props){
	const [show, setShow] = useState(false);
	const [uploadShow, setUploadShow] = useState(true);
	const [startDate, setStartDate] = useState(0);
	const [frameRate, setFrameRate] = useState(0)
	const [skipValue, setSkipValue] = useState(0)
	//const [playbackRate, setPlaybackRate] = useState(0)
	const [horizontalRes, setHorizontalRes] = useState(0)
	const [verticalRes, setVerticalRes] = useState(0)
	const [videoFormat, setVideoFormat] = useState(2)
	const [videoLink, setVideoLink] = useState("")
	const [process, setProcess] = useState(false)
	const [editSeg, setEditSeg] = useState(false)

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleUploadClose = () => {setUploadShow(false); setProcess(true)}
	const handleUploadShow = () => setUploadShow(true)

	const handleDownloadJSON = () => {
		var converted_annot = new ExportingAnnotation(props.frame_data, props.fabricCanvas, props.VIDEO_METADATA, props.image_frames).get_frame_json()
		downloadFileJSON(props.ANNOTATION_VIDEO_NAME, props.ANNOTATOR_NAME, converted_annot, props.annotation_data, props.VIDEO_METADATA)
	}

	const handleDownloadCSV = () => {
		downloadFileCSV(props.ANNOTATION_VIDEO_NAME, props.ANNOTATOR_NAME, props.annotation_data, props.columns)
	}

	const handleSetStartDate = (date) => {
		setStartDate(date)
		try { //Making sure that any garbage input taken care of
			props.setDateTime(Math.floor((date.getTime() / 1000)))
		} catch (error) {
			alert("Invalid date input!")
		}
	}

	const handleDateTimeInput = (event) => {
		const date = new Date(event.target.value)
		handleSetStartDate(date)
	}

	const handleVideoFormat = (type) => {
		console.log(type)
		//TODO Make sure bug is resolved and simply have video format equal type
		type = parseInt(type)
		if(type === 0){
			setVideoFormat(0)
		}else if (type === 1){
			setVideoFormat(1)
		}else if (type === 2){
			setVideoFormat(2)
			props.handleInputType(1)
		}
	}

	const handleVideoLink = (event) => {
		if(typeof(event) === "string"){
			setVideoLink(event.target.value)
			console.log(event.target.value)
		}else{
			setVideoLink(URL.createObjectURL(event.target.files[0]))
		}
	}

	const handleEditSeg = (event) => {
		setEditSeg(!editSeg)
	}

	const edit_click = (event) => {
		handleEditSeg();		
		Edit(props.fabricCanvas, props.save_data);
		props.toggle_segmentation();
	}

	/* TODO Add local storgae option
	if (localStorage.getItem('frame_data') != null){
		alert("There is some data stored")
		props.annotation_data = localStorage.getItem('annotation_data');
		props.frame_data = localStorage.getItem('frame_data');
	}*/

	return (
		<div>
		{
			//TODO Re-enable this for video processing. 
			process == 2 && 
			<ProcessVideo
				frame_rate={frameRate}
				video_link={videoLink}
			/>
		}
		<Dialog open={show} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>Instructions</DialogTitle>
				</DialogHeader>
				<Instructions></Instructions>
				<DialogFooter>
					<Button variant="secondary" onClick={handleClose}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		<Dialog open={uploadShow} onOpenChange={(open) => !open && handleUploadClose()}>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>Upload</DialogTitle>
				</DialogHeader>
				<div style={{display: "grid"}}>
					{/*onClick and onBlur events are for the sole purpose to stop the eventKeys from firing off*/}
					<div style={{float: "left",gridColumn: 1, gridRow:1, zIndex:99}}>
						Video Format: 
						<NativeSelect
							id="inlineFormCustomSelect"
							onChange={(event)=>{handleVideoFormat(event.target.value)}}
							defaultValue={videoFormat}
						>
							<NativeSelectOption value="2">Image</NativeSelectOption>
						</NativeSelect>
						<Separator className="my-3" />
					</div>
					<div style={{float: "left",gridColumn: 1, gridRow:2, zIndex:99}}>
						Annotator Name: <input type='text' defaultValue={props.ANNOTATOR_NAME} onClick={(event) => {props.toggleKeyCheck(false)}} onBlur={(event) => {props.toggleKeyCheck(true)}} onChange={(event) => {props.change_annotator_name(event.target.value)}}></input>
						<Separator className="my-3" />
					</div>
					<div style={{float: "left",gridColumn: 1, gridRow:3, zIndex:99}}>
						<text>Date and Time: </text>
						<input
							type="datetime-local"
							onChange={handleDateTimeInput}
							onClick={(event) => {props.toggleKeyCheck(false)}}
							onBlur={(event) => {props.toggleKeyCheck(true)}}
						/>
						<Separator className="my-3" />
					</div>
					{videoFormat === 0 && 
						<div style={{float: "left",gridColumn: 1, gridRow:4}}>
							<Input multiple id="file" aria-label="Video Upload" accept=".mp4" type="file" onChange={(event) => {props.handleVideoUpload(event); handleVideoLink(event)}} />
						</div>
					}
					{videoFormat === 1 &&
						<div>
							<text>Youtube URL: </text>
							<input onChange={handleVideoLink}></input>
							<Button onClick={(event) => {props.handleVideoUpload(videoLink)}}>Upload</Button>
						</div>
					}{videoFormat === 2 &&
                        <div>
                            <div style={{float: "left",gridColumn: 1, gridRow:4}}>
                                <Input multiple id="file" aria-label="Image-set 1 Upload" accept="image/*" type="file" onChange={(event) => {props.handleVideoUpload(event); handleVideoLink(event)}} />
                            </div>
                            <div style={{float: "left",gridColumn: 1, gridRow:4}}>
                                <Input multiple id="file" aria-label="Image-set 2 Upload" accept="image/*" type="file" onChange={(event) => {props.handleVideoUpload(event); handleVideoLink(event)}} />
                            </div>
                            <div style={{float: "left",gridColumn: 1, gridRow:4}}>
                                <Input multiple id="file" aria-label="Image-set 3 Upload" accept="image/*" type="file" onChange={(event) => {props.handleVideoUpload(event); handleVideoLink(event)}} />
                            </div>
                        </div>
					}
					<div style={{float: "left",gridColumn: 1, gridRow:5}}>
						<Input disabled={props.disable_buttons} accept=".json" id="file" aria-label="Annotation Upload" type="file" onChange={props.handleOldAnnotation}/>
					</div>
					<Separator className="my-3" />
					Frame Rate: <input type="number" value={props.frame_rate} onClick={(event) => {props.toggleKeyCheck(false)}} onBlur={(event) => {props.toggleKeyCheck(true)}} onChange={(event) => {props.setFrameRate(parseInt(event.target.value)); setFrameRate(parseInt(event.target.value))}}></input>
					<Separator className="my-3" />
					Skip Value: <input type='number' defaultValue="1" onChange={(event) => {props.change_skip_value(parseInt(event.target.value))}}></input>
					Playback Rate: <input type='number' defaultValue="1" onChange={(event) => {props.handleSetPlaybackRate(parseInt(event.target.value))}}></input>
					<Separator className="my-3" />
				</div>
				<DialogFooter>
					<Button onClick={handleUploadClose}>Upload</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		<header className="sticky top-0 z-50 flex items-center gap-4 bg-zinc-950 px-4 py-2 text-white">
				<a href="#home" className="text-lg font-semibold">AVAT</a>
				<nav className="mr-auto flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="text-white hover:text-white" disabled={props.disable_buttons}>Export</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={handleDownloadJSON}>JSON</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleDownloadCSV}>CSV</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button variant="ghost" className="text-white hover:text-white" onClick={handleShow}>Instructions</Button>
						<Button variant="ghost" className="text-white hover:text-white" onClick={props.handle_link_open}>Report</Button>
				</nav>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={handleUploadShow}>Upload</Button>{' '}
					{
						editSeg === false && <Button variant="outline" onClick={edit_click}>Edit Seg</Button>
					}
					{
						editSeg === true && <Button variant="outline" onClick={edit_click}>Confirm</Button>
					}
					{' '}
					<DropdownMenu>
						<ButtonGroup>
							<Button variant="secondary" disabled={true}>{props.display_frame_num}</Button>{' '}
							<DropdownMenuTrigger asChild>
								<Button variant="secondary" aria-label="Frame options">v</Button>
							</DropdownMenuTrigger>
						</ButtonGroup>
						<DropdownMenuContent>
							Skip Value: <input type='number' defaultValue="1" onChange={(event) => {props.change_skip_value(parseInt(event.target.value))}}></input>
							Playback Rate: <input type='number' defaultValue="1" onChange={(event) => {props.handleSetPlaybackRate(parseInt(event.target.value))}}></input>
						</DropdownMenuContent>
					</DropdownMenu>{' '}
					
					<Button variant="secondary" disabled={props.disable_buttons} onClick={props.skip_frame_backward}>Prev</Button>{' '}
					<Button variant="media" disabled={props.disable_buttons} onClick={props.handlePlaying}>{props.play_button_text}</Button>{' '}
					<Button variant="secondary" disabled={props.disable_buttons} onClick={props.skip_frame_forward}>Next</Button>{' '}
					<DropdownMenu>
						<ButtonGroup>
							<Button variant="success" onClick={props.addToCanvas}>Add</Button>
							<DropdownMenuTrigger asChild>
								<Button variant="success" aria-label="Annotation type options">v</Button>
							</DropdownMenuTrigger>
						</ButtonGroup>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={(event) =>{props.change_annotation_type("1")}}>Behavior Annotation</DropdownMenuItem>
							<DropdownMenuItem onClick={(event) =>{props.change_annotation_type("2")}}>BoundingBox</DropdownMenuItem>
							<DropdownMenuItem onClick={(event) =>{props.change_annotation_type("3")}}>Segmentation</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					{/*<Button variant="danger" onClick={remove} disabled={disable_buttons} style={{position:"relative"}}>Remove</Button>{' '}*/}
				</div>
		</header>
		</div>
	)
}
