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
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

import Instructions from './instructions';
import { downloadFileJSON } from '../../processing/download';

import ExportingAnnotation from '../../processing/exporting_annotation';
import ProcessVideo from './process_video';
import store from '../../store'
import { INPUT_VIDEO } from '../../static_data/const'
import { useSelector } from "react-redux";
import UploadModal from './upload_modal';

import { initFrameData, updateFrameData, getFrameData, initAnnotationData, updateAnnotationData, getAnnotationData, initColumnData, setMedia, initMedia, setFrameRate, setMediaType, setSkipValue, getMetaData, togglePlay, setTotalFrames } from '../../processing/actions'
import { init } from '../../reducer/frame_data';

const PLAYBACK_SPEEDS = [0.25, 0.5, 1, 1.5, 2, 4]

const formatTimePart = (value) => String(value).padStart(2, "0")

const formatTimestamp = (seconds) => {
	var wholeSeconds = Math.max(0, Math.floor(seconds || 0))
	var hours = Math.floor(wholeSeconds / 3600)
	var minutes = Math.floor((wholeSeconds % 3600) / 60)
	var remainingSeconds = wholeSeconds % 60
	if(hours > 0){
		return hours + ":" + formatTimePart(minutes) + ":" + formatTimePart(remainingSeconds)
	}
	return formatTimePart(minutes) + ":" + formatTimePart(remainingSeconds)
}

initMedia(1)
export default function CustomNavBar(props) {
	const [show, setShow] = useState(false);
	const [uploadShow, setUploadShow] = useState(true);
	const [process, setProcess] = useState(false)
	const [playText, setPlayText] = useState("Play")
	const [firstUpload, setFirstUpload] = useState(false)
	const [stateFrameRate, setStateFrameRate] = useState(null)
	const [stateSkipValue, setStateSkipValue] = useState(null)
	const [frameInputValue, setFrameInputValue] = useState("1")

	const play_redux = useSelector(state => state.play_status.play)
	const annotationTool = props.annotation_tool || { label: "Behavior Annotation", shortcut: "1" }
	const currentFrame = props.currentFrame || 0
	const totalFrames = props.totalFrames || 0
	const hasFrames = totalFrames > 0
	const controlsDisabled = props.disable_buttons || !hasFrames || props.drawingInProgress
	const addDisabled = props.disable_buttons || !hasFrames || props.drawingInProgress
	const scrubberMax = Math.max(totalFrames - 1, 0)
	const timestampText = props.mediaType === INPUT_VIDEO && props.frameRate > 0
		? formatTimestamp(currentFrame / props.frameRate) + " / " + formatTimestamp(Math.max(totalFrames - 1, 0) / props.frameRate)
		: "--:--"

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

	useEffect(() => {
		setFrameInputValue(String(hasFrames ? currentFrame + 1 : 0))
	}, [currentFrame, hasFrames])


	const handleDownloadJSON = () => {
		var converted_annot = new ExportingAnnotation(store.getState().frame_data.data, props.video_width, props.video_height, getMetaData(), store.getState().media_data.data[0]).get_frame_json()
		console.log(converted_annot)
		downloadFileJSON(converted_annot, getMetaData())
	}

	const handlePlaying = (event) => {
		togglePlay()
	}

	const handleJumpCommit = () => {
		var parsedFrame = parseInt(frameInputValue)
		if(Number.isNaN(parsedFrame)){
			setFrameInputValue(String(hasFrames ? currentFrame + 1 : 0))
			return
		}

		var clampedFrame = Math.min(Math.max(parsedFrame, 1), Math.max(totalFrames, 1))
		setFrameInputValue(String(clampedFrame))
		if(props.jumpToFrameNumber){
			props.jumpToFrameNumber(clampedFrame)
		}
	}

	const handleJumpKeyDown = (event) => {
		if(event.key === "Enter"){
			event.currentTarget.blur()
		}
	}

	const handleSkipValueChange = (event) => {
		var nextSkipValue = parseInt(event.target.value)
		setSkipValue(nextSkipValue > 0 ? nextSkipValue : 1)
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
			<header className="sticky top-0 z-50 flex flex-wrap items-center gap-3 bg-zinc-950 px-4 py-2 text-white">
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
					<span className="rounded bg-white/15 px-1.5 py-0.5 text-xs text-zinc-200">{annotationTool.label === "Segmentation" ? "Add A, click points" : "Add A"}</span>
					{annotationTool.shortcut &&
						<span className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-zinc-300">Shortcut {annotationTool.shortcut}</span>
					}
				</div>
				<div className="flex max-w-[220px] items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-zinc-200" title={props.autosaveError || undefined}>
					<span className={props.autosaveStatus === "Autosave failed" ? "font-semibold text-red-200" : "font-medium"}>{props.autosaveStatus}</span>
					{props.lastSavedAt && props.autosaveStatus === "Saved locally" &&
						<span className="text-zinc-400">{props.lastSavedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
					}
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={handleUploadToggle}>Settings</Button>{' '}
					<DropdownMenu>
						<ButtonGroup>
							<Button variant="success" disabled={addDisabled} onClick={props.addToCanvas}>Add</Button>
							<DropdownMenuTrigger asChild>
								<Button variant="success" disabled={addDisabled} aria-label="Annotation type options">v</Button>
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
			<div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-2 border-t border-white/15 bg-zinc-950 px-4 py-2 text-xs text-zinc-200 shadow-lg">
					<div className="flex flex-wrap items-center gap-2">
						<span className="font-semibold text-white">{props.display_frame_num}</span>
						<span className="rounded bg-white/10 px-2 py-1 font-mono text-zinc-300">{timestampText}</span>
						<label className="flex items-center gap-1 text-zinc-300">
							<span>Jump</span>
							<Input
								className="h-7 w-20 border-white/15 bg-zinc-950/40 text-white"
								type="number"
								min="1"
								max={Math.max(totalFrames, 1)}
								value={frameInputValue}
								disabled={controlsDisabled}
								onChange={(event) => setFrameInputValue(event.target.value)}
								onFocus={() => { props.toggleKeyCheck(false) }}
								onBlur={() => { props.toggleKeyCheck(true); handleJumpCommit() }}
								onKeyDown={handleJumpKeyDown}
							/>
						</label>
						<label className="flex items-center gap-1 text-zinc-300">
							<span>Skip</span>
							<Input
								className="h-7 w-16 border-white/15 bg-zinc-950/40 text-white"
								type="number"
								min="1"
								defaultValue={props.skip_value}
								disabled={props.disable_buttons}
								onChange={handleSkipValueChange}
								onFocus={() => { props.toggleKeyCheck(false) }}
								onBlur={() => { props.toggleKeyCheck(true) }}
							/>
						</label>
						{props.mediaType === INPUT_VIDEO &&
							<label className="flex items-center gap-1 text-zinc-300">
								<span>Speed</span>
								<NativeSelect
									size="sm"
									className="w-24 [&_select]:border-white/15 [&_select]:bg-zinc-950/40 [&_select]:text-white"
									value={String(props.playbackSpeed || 1)}
									disabled={props.disable_buttons}
									onChange={(event) => props.onPlaybackSpeedChange(event.target.value)}
									onFocus={() => { props.toggleKeyCheck(false) }}
									onBlur={() => { props.toggleKeyCheck(true) }}
								>
									{PLAYBACK_SPEEDS.map((speed) => (
										<NativeSelectOption key={speed} value={String(speed)}>{speed}x</NativeSelectOption>
									))}
								</NativeSelect>
							</label>
						}
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Button size="sm" variant="secondary" disabled={controlsDisabled} onClick={props.skip_frame_backward}>Prev</Button>
						{props.mediaType === INPUT_VIDEO &&
							<Button size="sm" variant="media" disabled={controlsDisabled} onClick={handlePlaying}>{playText}</Button>
						}
						<Button size="sm" variant="secondary" disabled={controlsDisabled} onClick={props.skip_frame_forward}>Next</Button>
						<Button size="sm" variant="surface" disabled={controlsDisabled} onClick={props.goToPreviousAnnotatedFrame}>Prev Annotated</Button>
						<Button size="sm" variant="surface" disabled={controlsDisabled} onClick={props.goToNextAnnotatedFrame}>Next Annotated</Button>
						<Button size="sm" variant="surface" disabled={controlsDisabled} onClick={props.goToNextIncompleteFrame}>Next Incomplete</Button>
					</div>
					<Input
						className="h-2 w-full cursor-pointer border-0 bg-transparent px-0 accent-white"
						type="range"
						min="0"
						max={scrubberMax}
						value={Math.min(currentFrame, scrubberMax)}
						disabled={controlsDisabled || totalFrames <= 1}
						onChange={(event) => props.goToFrame(Number(event.target.value))}
						aria-label="Frame scrubber"
					/>
			</div>
		</div>
	)
}
