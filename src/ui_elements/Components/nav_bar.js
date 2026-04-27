import React, { useEffect } from 'react';
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
import { Label } from '@/components/ui/label';

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
	const annotationTool = props.annotation_tool || { label: "Behavior Annotation", shortcut: "1" }

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleUploadToggle = () => {
		setUploadShow((currentUploadShow) => !currentUploadShow)
	}

	useEffect(() => {
		if(props.onUploadModalChange){
			props.onUploadModalChange(uploadShow)
		}
	}, [uploadShow, props.onUploadModalChange])

	useEffect(() => {
		if(props.forceUploadClosedToken){
			setUploadShow(false)
		}
	}, [props.forceUploadClosedToken])


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
			{!props.hideUploadModal &&
				<UploadModal
					handleOldAnnotation={props.handleOldAnnotation}
					handleUploadToggle={handleUploadToggle}
					uploadShow={uploadShow}
					onProjectNameChange={props.onProjectNameChange}
				/>
			}
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
						</DropdownMenuContent>
					</DropdownMenu>
					<Button variant="ghost" className="text-white hover:text-white" onClick={handleShow}>Instructions</Button>
					<Button variant="ghost" className="text-white hover:text-white" onClick={props.handle_link_open}>Report</Button>
				</nav>
				<div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm sm:flex">
					<span className="text-zinc-300">Tool</span>
					<span className="font-semibold">{annotationTool.label}</span>
					<span className="rounded bg-white/15 px-1.5 py-0.5 text-xs text-zinc-200">Add A</span>
				</div>
				<div className="flex max-w-[220px] items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-zinc-200" title={props.autosaveError || undefined}>
					<span className={props.autosaveStatus === "Autosave failed" ? "font-semibold text-red-200" : "font-medium"}>{props.autosaveStatus}</span>
					{props.lastSavedAt && props.autosaveStatus === "Saved locally" &&
						<span className="text-zinc-400">{props.lastSavedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
					}
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={handleUploadToggle}>Settings</Button>{' '}
					{' '}
					<DropdownMenu>
						<ButtonGroup>
							<Button variant="secondary" disabled={true}>{props.display_frame_num}</Button>{' '}
							<DropdownMenuTrigger asChild>
								<Button variant="secondary" aria-label="Frame options">v</Button>
							</DropdownMenuTrigger>
						</ButtonGroup>
						<DropdownMenuContent>
							<div className="grid gap-2 p-2">
								<Label>Skip Value</Label>
								<Input
									placeholder='Skip Value'
									type='number'
									onChange={(event) => { setSkipValue(event.target.value) }}
									onClick={() => { props.toggleKeyCheck(false) }}
									onBlur={() => { props.toggleKeyCheck(true) }}
									defaultValue={props.skip_value}
								/>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>{' '}

					<Button disabled={props.disable_buttons} onClick={props.skip_frame_backward}>Prev</Button>{' '}
					{
						videoFormat === INPUT_VIDEO &&
						<Button disabled={props.disable_buttons} onClick={handlePlaying}>{playText}</Button>
					}
					{' '}
					<Button disabled={props.disable_buttons} onClick={props.skip_frame_forward}>Next</Button>{' '}
					<DropdownMenu>
						<ButtonGroup>
							<Button onClick={props.addToCanvas}>Add</Button>
							<DropdownMenuTrigger asChild>
								<Button aria-label="Annotation type options">v</Button>
							</DropdownMenuTrigger>
						</ButtonGroup>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={(event) => { props.change_annotation_type("1") }}>Behavior Annotation</DropdownMenuItem>
							<DropdownMenuItem onClick={(event) => { props.change_annotation_type("2") }}>BoundingBox</DropdownMenuItem>
							<DropdownMenuItem onClick={(event) => { props.change_annotation_type("3") }}>Segmentation</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					{/*<Button variant="danger" onClick={remove} disabled={disable_buttons} style={{position:"relative"}}>Remove</Button>{' '}*/}
				</div>
			</header>
		</div>
	)
}
