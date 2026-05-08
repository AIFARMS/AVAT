import React, { useEffect, useRef, useState } from 'react';

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

import { initFrameData, initAnnotationData, initColumnData, setMedia, setFrameRate, setMediaType, setSkipValue, setTotalFrames } from '../../processing/actions'
import { loadFrameSource } from '../../processing/frame_source_registry'
import default_column from '../../static_data/basic_column_config.json'

export default function UploadModal(props){
    const [videoFormat, setVideoFormat] = useState(INPUT_VIDEO)
    const [firstUpload, setFirstUpload] = useState(false)
    const [projectName, setProjectName] = useState("")
    const [stateFrameRate, setStateFrameRate] = useState<any>(null)
    const [stateSkipValue, setStateSkipValue] = useState<any>(1)
    const [stateColumnData, setStateColumnData] = useState<any>(null)
    const [uploadExistingAnnotation, setUploadExistingAnnotation] = useState(false)
    const [isProcessingVideo, setIsProcessingVideo] = useState(false)
    const [mediaFileName, setMediaFileName] = useState("")
    const [columnFileName, setColumnFileName] = useState("")
    const [annotationFileName, setAnnotationFileName] = useState("")
    const [annotationFormat, setAnnotationFormat] = useState("AVAT JSON")
    const [videoMetadataStatus, setVideoMetadataStatus] = useState("idle")
    const [videoMetadata, setVideoMetadata] = useState<any>(null)
    const [videoMetadataError, setVideoMetadataError] = useState("")
    const [videoPreviewUrl, setVideoPreviewUrl] = useState("")
    const metadataRequestId = useRef(0)
    const videoPreviewUrlRef = useRef("")

    const frame_count = useSelector(state => state.metadata.total_frames)
    const mediaData = useSelector(state => state.media_data.data)

    const hasProjectName = firstUpload || projectName.trim() !== ""
    const hasMediaFile = firstUpload ? Boolean(mediaFileName || mediaData?.[0]?.[0]) : Boolean(mediaFileName)
    const hasSkipValue = stateSkipValue != null && String(stateSkipValue) !== ""
    const annotationFormatReady = !uploadExistingAnnotation || Boolean(annotationFormat)
    const videoMetadataReady = firstUpload || videoFormat !== INPUT_VIDEO || videoMetadataStatus === "ready"
    const canUpload = hasProjectName && hasMediaFile && hasSkipValue && annotationFormatReady && videoMetadataReady && !props.disable_buttons && !isProcessingVideo

    const formatDuration = (seconds) => {
        if(seconds == null || Number.isNaN(seconds)){
            return "Unknown"
        }
        const totalSeconds = Math.round(seconds)
        const minutes = Math.floor(totalSeconds / 60)
        const remainder = totalSeconds % 60
        return `${minutes}:${String(remainder).padStart(2, "0")}`
    }

    const formatNumber = (value, digits = 0) => {
        if(value == null || Number.isNaN(value)){
            return "Unknown"
        }
        return Number(value).toLocaleString(undefined, {
            maximumFractionDigits: digits,
        })
    }

    const resetVideoMetadata = () => {
        metadataRequestId.current += 1
        setVideoMetadataStatus("idle")
        setVideoMetadata(null)
        setVideoMetadataError("")
        setStateFrameRate(null)
    }

    const setVideoPreviewFile = (file) => {
        if(videoPreviewUrlRef.current){
            URL.revokeObjectURL(videoPreviewUrlRef.current)
            videoPreviewUrlRef.current = ""
        }
        if(!file){
            setVideoPreviewUrl("")
            return
        }
        const objectUrl = URL.createObjectURL(file)
        videoPreviewUrlRef.current = objectUrl
        setVideoPreviewUrl(objectUrl)
    }

    useEffect(() => {
        return () => {
            if(videoPreviewUrlRef.current){
                URL.revokeObjectURL(videoPreviewUrlRef.current)
            }
        }
    }, [])

    const createProjectAvailabilityText = () => {
        if(props.disable_buttons){
            return "Project setup is temporarily disabled."
        }
        if(!hasProjectName){
            return "Enter a project name to continue."
        }
        if(!hasMediaFile){
            return "Select source media to continue."
        }
        if(videoFormat === INPUT_VIDEO && videoMetadataStatus === "loading"){
            return "Detecting video details. Finish detection before creating the project."
        }
        if(videoFormat === INPUT_VIDEO && videoMetadataStatus === "error"){
            return "Video details could not be detected. Select a valid MP4 before creating the project."
        }
        if(!hasSkipValue){
            return "Enter a skip value to continue."
        }
        if(!annotationFormatReady){
            return "Choose an annotation format to continue."
        }
        if(canUpload){
            return firstUpload ? "Ready to save project settings." : "Ready to create project."
        }
        return "Complete required setup to continue."
    }

    const handleUpload = async () => {
        setIsProcessingVideo(true)
        try{
            setSkipValue(parseInt(String(stateSkipValue)))
            if(!firstUpload && !uploadExistingAnnotation){
                let totalFrames = -1
                if(videoFormat === INPUT_VIDEO){
                    const uploadedFile = mediaData?.[0]?.[0]
                    if(!uploadedFile){
                        alert("Please upload a video file.")
                        return;
                    }
                    if(!videoMetadata){
                        alert("Video details are still being detected. Please wait for the metadata summary to finish.")
                        return;
                    }
                    setFrameRate(videoMetadata.frameRate)
                    totalFrames = videoMetadata.totalFrames
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
                    if(!videoMetadata){
                        alert("Video details are still being detected. Please wait for the metadata summary to finish.")
                        return;
                    }
                    let totalFrames = videoMetadata.totalFrames
                    setTotalFrames(totalFrames)
                }
            }
            if(props.onProjectNameChange && projectName.trim() !== ""){
                props.onProjectNameChange(projectName.trim())
            }
            props.handleUploadToggle()
        }catch(error){
            alert((error as Error).message || "Error processing video file.")
        }finally{
            setIsProcessingVideo(false)
        }
    }

    const toggleUploadExistingAnnotation = (event) => {
        props.handleOldAnnotation(event)
        setUploadExistingAnnotation(true)
    }

    const downloadColumn = (file) => {
        return new Promise<any>((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = function (e) {
                resolve((JSON.parse(e.target.result as string)));
            }
            reader.readAsText(file.target.files[0])
        })
    }

    const handleVideoFormat = (type) => {
        resetVideoMetadata()
        setVideoPreviewFile(null)
        setMediaFileName("")
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

    const handleMediaUpload = async (event) => {
        const streamNum = parseInt(event.target.id)
        const files = event.target.files
        const uploadedFile = files?.[0]
        setMediaFileName(uploadedFile?.name || "")
        setMedia(streamNum, files)

        if(videoFormat !== INPUT_VIDEO || !uploadedFile){
            resetVideoMetadata()
            setVideoPreviewFile(null)
            return
        }

        setVideoPreviewFile(uploadedFile)

        const requestId = metadataRequestId.current + 1
        metadataRequestId.current = requestId
        setVideoMetadataStatus("loading")
        setVideoMetadata(null)
        setVideoMetadataError("")
        setStateFrameRate(null)

        try{
            const frameSource = await loadFrameSource(streamNum, uploadedFile)
            if(metadataRequestId.current !== requestId){
                return
            }
            const frameRate = frameSource.averageFrameRate || 1
            setVideoMetadata({
                duration: frameSource.duration,
                totalFrames: frameSource.totalFrames,
                frameRate: frameRate,
                width: frameSource.width,
                height: frameSource.height,
            })
            setStateFrameRate(Number(frameRate).toFixed(3))
            setVideoMetadataStatus("ready")
        }catch(error){
            if(metadataRequestId.current !== requestId){
                return
            }
            setVideoMetadataStatus("error")
            setVideoMetadataError((error as Error).message || "Error detecting video details.")
        }
    }

    const handleColumnUpload = (event) => {
        setColumnFileName(event.target.files?.[0]?.name || "")
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

    const handleAnnotationUpload = (event) => {
        setAnnotationFileName(event.target.files?.[0]?.name || "")
        toggleUploadExistingAnnotation(event)
    }

    const generateUploadButtons = () => {
        var uploadButtons = []
        for (var i = 0; i < 1; i++) {
            let button_image = (
                <Input multiple id={i + ""} key={i} aria-label={"Image Upload"} accept="image/*" type="file" onChange={(event) => { handleMediaUpload(event) }} disabled={firstUpload} />
            )
            let button_video = (
                <Input id={i + ""} key={i} aria-label={"Video Upload"} accept=".mp4" type="file" onChange={(event) => { handleMediaUpload(event) }} disabled={firstUpload} />
            )
            if (videoFormat === INPUT_IMAGE) {
                uploadButtons.push(button_image)
            } else if (videoFormat === INPUT_VIDEO) {
                uploadButtons.push(button_video)
            }
        }
        return uploadButtons.map((but) => but)
    }

    return(
        <Dialog open={props.uploadShow}>
            <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl" showCloseButton={false}>
                <DialogHeader>
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">AVAT project setup</p>
                        <DialogTitle className="text-2xl">Create an annotation project</DialogTitle>
                        <p className="max-w-2xl text-sm text-zinc-600">
                            Name the project, attach media, and confirm the setup needed before the workspace opens.
                        </p>
                    </div>
                </DialogHeader>
                <div className="space-y-6">
                        {firstUpload &&
                            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-950">Active project session detected</p>
                                        <p className="text-sm text-zinc-600">Keep the current setup and return to the workspace after a quick settings review.</p>
                                    </div>
                                </div>
                            </div>
                        }

                        <section className="space-y-4">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-semibold">Project identity</h3>
                                    <p className="text-sm text-zinc-600">Required before opening the annotation workspace.</p>
                                </div>
                                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Required</span>
                            </div>
                            <Input
                                aria-label="Project Name"
                                placeholder="Project name"
                                value={projectName}
                                onChange={(event) => { setProjectName(event.target.value); }}
                                disabled={props.disable_buttons || firstUpload}
                            />
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <div>
                                <h3 className="text-base font-semibold">Source media</h3>
                                <p className="text-sm text-zinc-600">Choose the media type and attach the file set for this project.</p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                                <NativeSelect
                                    className="w-full self-start"
                                    id="inlineFormCustomSelect"
                                    onChange={(event) => { handleVideoFormat(event.target.value); }}
                                    defaultValue={videoFormat}
                                    disabled={firstUpload}
                                >
                                    <NativeSelectOption value={INPUT_VIDEO}>Video</NativeSelectOption>
                                    <NativeSelectOption value={INPUT_IMAGE}>Image sequence</NativeSelectOption>
                                </NativeSelect>
                                <div className="space-y-2">
                                    {generateUploadButtons()}
                                     <p className="text-xs text-zinc-500">
                                         {mediaFileName ? `Selected: ${mediaFileName}` : videoFormat === INPUT_VIDEO ? "MP4 video is supported in the current workflow." : "Select the image files for the sequence."}
                                     </p>
                                    {videoFormat === INPUT_VIDEO && mediaFileName &&
                                        <div className="grid gap-3 lg:grid-cols-[192px_minmax(0,1fr)]">
                                            {videoPreviewUrl &&
                                                <video
                                                    className="h-28 w-full rounded-lg border border-zinc-200 bg-black object-contain"
                                                    autoPlay
                                                    controls
                                                    key={videoPreviewUrl}
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                    src={videoPreviewUrl}
                                                />
                                            }
                                            <div className={`min-h-28 rounded-lg border p-3 text-sm ${videoMetadataStatus === "error" ? "border-red-200 bg-red-50 text-red-800" : videoMetadataStatus === "ready" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-zinc-200 bg-zinc-50 text-zinc-700"}`}>
                                                {videoMetadataStatus === "loading" &&
                                                    <p className="font-medium">Detecting video duration, frame count, and frame rate...</p>
                                                }
                                                {videoMetadataStatus === "error" &&
                                                    <div className="space-y-1">
                                                        <p className="font-medium">Video details could not be detected.</p>
                                                        <p className="text-xs">{videoMetadataError}</p>
                                                    </div>
                                                }
                                                {videoMetadataStatus === "ready" &&
                                                    <div className="space-y-2">
                                                        <p className="font-medium">Video details detected</p>
                                                        <div className="grid gap-2 text-xs sm:grid-cols-2 xl:grid-cols-4">
                                                            <span><span className="font-medium">Duration:</span> {formatDuration(videoMetadata.duration)}</span>
                                                            <span><span className="font-medium">Frames:</span> {formatNumber(videoMetadata.totalFrames)}</span>
                                                            <span><span className="font-medium">Frame rate:</span> {formatNumber(videoMetadata.frameRate, 3)} fps</span>
                                                            <span><span className="font-medium">Size:</span> {videoMetadata.width} x {videoMetadata.height}</span>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                 </div>
                             </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <div>
                                <h3 className="text-base font-semibold">Project settings</h3>
                                <p className="text-sm text-zinc-600">Frame rate is detected from video. Skip value controls how the workspace advances.</p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <InputGroup className="mb-3">
                                        <InputGroupInput
                                            type="number"
                                            onChange={(event) => { setStateFrameRate(event.target.value ? event.target.value : 1); }}
                                            disabled={true}
                                            placeholder={videoFormat === INPUT_VIDEO ? "Detected automatically" : "Not used for images"}
                                            aria-invalid={false}
                                            value={stateFrameRate || ""}
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
                                            onChange={(event) => { setStateSkipValue(event.target.value ? event.target.value : 1); }}
                                            aria-invalid={stateSkipValue == null || stateSkipValue == undefined || String(stateSkipValue) == ""}
                                            defaultValue={stateSkipValue}
                                        />
                                        <InputGroupAddon>
                                            <InputGroupText>Skip Value</InputGroupText>
                                        </InputGroupAddon>
                                        {(stateSkipValue == null || stateSkipValue == undefined || String(stateSkipValue) == "") &&
                                            <FieldError>
                                                Please enter a skip value.
                                            </FieldError>
                                        }
                                    </InputGroup>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <div>
                                <h3 className="text-base font-semibold">Labels and existing annotations</h3>
                                <p className="text-sm text-zinc-600">Import columns for labels or attach existing annotations to continue prior work.</p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium" htmlFor="column-upload">
                                        Label columns
                                    </label>
                                    <Input
                                        disabled={props.disable_buttons || firstUpload}
                                        accept=".json"
                                        id="column-upload"
                                        aria-label="Column Upload"
                                        type="file"
                                        onChange={handleColumnUpload}
                                    />
                                    <p className="mt-2 text-xs text-zinc-500">
                                        {columnFileName ? `Selected: ${columnFileName}` : "Optional. Default columns are used if none are uploaded."}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium" htmlFor="annotation-upload">
                                        Annotation import
                                    </label>
                                    <NativeSelect
                                        className="w-full"
                                        aria-label="Annotation Format"
                                        value={annotationFormat}
                                        onChange={(event) => setAnnotationFormat(event.target.value)}
                                        disabled={props.disable_buttons || firstUpload}
                                    >
                                        <NativeSelectOption value="AVAT JSON">AVAT JSON</NativeSelectOption>
                                    </NativeSelect>
                                    <Input
                                        accept=".json"
                                        id="annotation-upload"
                                        aria-label="Annotation Upload"
                                        type="file"
                                        onChange={handleAnnotationUpload}
                                        disabled={props.disable_buttons || firstUpload}
                                    />
                                    <p className="text-xs text-zinc-500">
                                        {annotationFileName ? `Selected: ${annotationFileName}. Annotation labels take priority.` : "Optional. Use this when continuing from an exported annotation file."}
                                    </p>
                                </div>
                            </div>
                        </section>

                </div>
                <DialogFooter className="items-start sm:items-center sm:justify-between">
                    <p className={`text-xs ${canUpload ? "text-emerald-700" : "text-zinc-500"}`}>
                        {createProjectAvailabilityText()}
                    </p>
                    <Button
                        onClick={handleUpload}
                        disabled={!canUpload}
                    >
                        {isProcessingVideo ? "Processing video..." : firstUpload ? "Save project settings" : "Create project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
