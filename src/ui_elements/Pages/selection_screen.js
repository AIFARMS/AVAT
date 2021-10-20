
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Carousel from 'react-bootstrap/Carousel'

import MainUpload from './main_upload'
import MainMultiview from './main_muiltiview'
import { Container, Jumbotron, Col, Row, Card} from "react-bootstrap";
import Instructions from "../Components/instructions";

import selection_items from '../../static_data/selectionscreen_info.json'

//<img src={process.env.PUBLIC_URL + '/favicon.ico'} alt="logo" style={{width: "30%"}} />
function SelectionScreen(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
    const [upload, setUpload] = useState(false)
    const handleUpload = (event) => {
        setUpload(!upload)
    }

    const [multiview, setMultiview] = useState(false)
    const handleMultiview = (event) => {
        setMultiview(!multiview)
    }

    if(upload){
        return (<MainUpload/>)
    }else if(multiview){
        return (<MainMultiview/>)
    }else{
        return (
            <div>
                <Modal show={show} onHide={handleClose} size='lg'>
                    <Modal.Header closeButton>
                    <Modal.Title>Instructions</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><Instructions></Instructions></Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <main>
                    <Jumbotron className="text-center">
                        <Container>
                            <h1 className="jumbotron-heading">AVAT</h1>
                            <p className="lead text-muted"> Analysis tool to record data for livestock behavior and computer vision applications. </p>
                            <p>
                                <Button onClick={handleUpload} variant="success" className="mx-1 my-2">Video Upload</Button>
                                <Button onClick={handleMultiview} variant="success">Multiview</Button>
                            </p>
                        </Container>
                    </Jumbotron>
                        <Carousel controls={false} fade style={{"width": "70%", "margin-left": "auto", "margin-right": "auto"}}>
                            {
                                selection_items.map((item, key) => {
                                    return(
                                        <Carousel.Item interval={item.slide_time}>
                                            <Card 
                                                className="mb-5 box-shadow" 
                                                top
                                                width='100%'
                                            >
                                                <Card.Img width="60%" variant="top" src={process.env.PUBLIC_URL + item.src} />
                                                <Card.Body style={{"text-align": "center"}}>
                                                    <Card.Title>{item.altText}</Card.Title>
                                                    <Card.Text>{item.description}</Card.Text>
                                                </Card.Body>
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