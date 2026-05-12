
import React, { useState } from "react";

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

import MainUpload from './main_upload'
import Instructions from "../Components/instructions";

import selection_items from '../../static_data/selectionscreen_info.json'

//<img src="/favicon.ico" alt="logo" style={{width: "30%"}} />
function SelectionScreen(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [upload, setUpload] = useState(false)
    const handleUpload = (event) => {
        setUpload(!upload)
    }

    const [multiview, setMultiview] = useState(false)

    if(upload){
        return (<MainUpload/>)
    }else{
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
                <main>
                    <section className="mx-auto max-w-5xl px-4 py-12 text-center">
                        <h1 className="text-4xl font-semibold tracking-tight">AVAT</h1>
                        <p className="mt-3 text-lg text-muted-foreground"> Analysis tool to record data for livestock behavior and computer vision applications. </p>
                        <p>
                            <Button onClick={handleUpload} className="mx-1 my-2">Video Upload</Button>
                        </p>
                    </section>
                        <div className="mx-auto grid w-[70%] gap-6">
                            {
                                selection_items.map((item, key) => {
                                    return(
                                            <Card key={key} className="mb-5 shadow-sm" style={{width: '100%'}}>
                                                <img width="60%" src={item.src} alt={item.altText} />
                                                <CardContent style={{"textAlign": "center"}}>
                                                    <CardTitle>{item.altText}</CardTitle>
                                                    <p>{item.description}</p>
                                                </CardContent>
                                            </Card>
                                    )
                                })
                            }
                        </div>
                </main>
            </div>
        )
    }
}

export default SelectionScreen;
