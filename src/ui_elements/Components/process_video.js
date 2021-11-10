import React from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { NavDropdown, NavLink } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import { ButtonGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import Carousel from 'react-bootstrap/Carousel'

import { Container, Jumbotron, Col, Row, Card} from "react-bootstrap";


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
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
            <Modal.Title>Processing Video...</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <video id='process_vid' style={{objectFit: 'contain', height: '100%', width: '100%'}} src={props.video_link}></video>
                    <Button onClick={handleProcess} enable={frames!=null} >Process Video</Button>
                    {text}
                    {
                        frames != null &&
                        <Carousel controls={true} fade style={{objectFit: 'contain', height: '100%', width: '100%'}}>
                        {
                            frames.map((x) => {
                                return(
                                        <Carousel.Item >
                                            <Card className="mb-5 box-shadow" top
                                                width='100%'
                                            >
                                                <Card.Img style={{objectFit: 'contain', height: '100%', width: '100%'}} src={x} />
                                            </Card>
                                        </Carousel.Item>
                                    )
                            })
                        }
                            
                        </Carousel>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}