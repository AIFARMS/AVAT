
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Carousel from 'react-bootstrap/Carousel'
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
import { Container, Jumbotron } from "react-bootstrap";
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
                    <DialogContent className="sm:max-w-3xl">
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
                    <Jumbotron className="text-center">
                        <Container>
                            <h1 className="jumbotron-heading">AVAT</h1>
                            <p className="lead text-muted"> Analysis tool to record data for livestock behavior and computer vision applications. </p>
                            <p>
                                <Button onClick={handleUpload} className="mx-1 my-2">Video Upload</Button>
                            </p>
                        </Container>
                    </Jumbotron>
                        <Carousel controls={false} fade style={{"width": "70%", "marginLeft": "auto", "marginRight": "auto"}}>
                            {
                                selection_items.map((item, key) => {
                                    return(
                                        <Carousel.Item key={key} interval={item.slide_time}>
                                            <Card className="mb-5 box-shadow" style={{width: '100%'}}>
                                                <img width="60%" src={item.src} />
                                                <CardContent style={{"textAlign": "center"}}>
                                                    <CardTitle>{item.altText}</CardTitle>
                                                    <p>{item.description}</p>
                                                </CardContent>
                                            </Card>
                                        </Carousel.Item>
                                    )
                                })
                            }
                        </Carousel>
                </main>
            </div>
        )
    }
}

export default SelectionScreen;
