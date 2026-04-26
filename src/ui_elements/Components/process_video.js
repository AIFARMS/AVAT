import React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';


import videoFrameExtract from '../../processing/video_to_frame';

var test_frame = []
export default function ProcessVideo(props){
    const [show, setShow] = useState(true);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [frames, setFrames] = useState(null);
    const [text, setText] = useState("");

    const handleText = (event) => {
        setText(event)
    }

    const handleProcess = (e) => {
        if(props.frame_rate === 0){
            var temp = videoFrameExtract(15, 15, handleText).then(function(ret) {
                setFrames(ret)
                test_frame = ret
                console.log(ret)
            })
            return;
        }
        var temp = videoFrameExtract(props.frame_rate)
        setFrames(temp)
        test_frame = temp
        console.log(temp)
    }
    console.log(test_frame)
    return(
        <Dialog open={show} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
            <DialogTitle>Processing Video...</DialogTitle>
            </DialogHeader>
                <div>
                    <video id='process_vid' style={{objectFit: 'contain', height: '100%', width: '100%'}} src={props.video_link}></video>
                    <Button onClick={handleProcess} enable={frames!=null} >Process Video</Button>
                    {text}
                    {
                        frames != null &&
                        <div className="grid gap-4" style={{objectFit: 'contain', height: '100%', width: '100%'}}>
                        {
                            frames.map((x) => {
                                return(
                                            <Card className="mb-5 shadow-sm" top
                                                width='100%'
                                            >
                                                <img style={{objectFit: 'contain', height: '100%', width: '100%'}} src={x} alt="Extracted video frame" />
                                            </Card>
                                    )
                            })
                        }
                             
                        </div>
                    }
                </div>
            <DialogFooter>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
