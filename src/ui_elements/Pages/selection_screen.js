import React, { useState } from "react"; 
import ReactDOM from 'react-dom'
import ReactPlayer from 'react-player'
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";

import MainUpload from './main_upload'
import MainYoutube from './main_youtube'
import { Container, Jumbotron } from "react-bootstrap";
import App from "../../App";

//<img src={process.env.PUBLIC_URL + '/favicon.ico'} alt="logo" style={{width: "30%"}} />
function SelectionScreen(){
    const [] = useState(false)

    const [youtube, setYoutube] = useState(false)
    const handleYouTube = (event) => {
        setYoutube(!youtube)
    } 

    const [upload, setUpload] = useState(false)
    const handleUpload = (event) => {
        setUpload(!upload)
    }

    if(youtube){
        return (<MainYoutube/>)
    }else if(upload){
        return (<MainUpload/>)
    }else{
        return (
            <Router>
                <div>
                <Jumbotron fluid>
                    <Container>
                        <div class="row align-items-center">
                            <div class="pb-4 col-md-6 col-lg-7">
                                <h0 style={{fontSize: "50px"}}>
                                    Annotation Tool {"  "}
                                    <img class="" src={process.env.PUBLIC_URL + '/favicon.ico'} alt="logo" style={{width: "9%"}}/>
                                </h0>
                                <h5 > Online tool to mass annotate videos for AI/ML </h5>
                                <Button size="lg">Instructions</Button>
                            </div> 

                            <div class="col-md-6 col-lg-5">
                                <div class="row">
                                    <div class="col">
                                        <div class="card my-2">
                                            <Link to="/upload" variant="btn-primary outline-success">Video Upload</Link>
                                        </div> 
                                    </div>
                                    <div class="col-12">
                                        <div class="card my-2">
                                            <Link to="/youtube" variant="btn-primary outline-success">Youtube</Link>
                                        </div> 
                                    </div>
                                </div>
                            </div> 
                        </div> 
                    </Container>


                    <div class="container">
                        <div class="row align-items-center">
                            
                        </div>
                    </div>
                </Jumbotron>


                <Switch>
                    <Route path='/youtube' component={MainYoutube}/>
                    <Route path='/upload' component={MainUpload}/>
                </Switch>
                </div>
            </Router>
        )
    }
}

export default SelectionScreen;