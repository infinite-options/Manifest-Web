import React, { Component } from 'react'
// import firebase from "./firebase";
import {  Button, Modal} from 'react-bootstrap';

export default class AddNewATItem extends Component {

    constructor(props) {
        super(props)
        console.log('AddNewATItem constructor');
    }

    state = {
        atArr: [], //goal, routine original array 
        newItem: { //Object to hold new Routine/Goal
            title: "",
        }
    }

    componentDidMount() {

    }

    handleInputChange = (e) => {
        console.log(e.target.value);
        this.setState(
            {
                newItem: {
                    title: e.target.value
                }
            }
        )
    }

    newInputSubmit = () => {
        if (this.state.newItem.title === "") {
            alert('Invalid Input');
            return;
        }
        console.log("Submitting Input: " + this.state.newItem.title)
    }

    render() {
        return (

            <Modal.Dialog style={{ marginLeft: '0', width: '900px', }}>
            <Modal.Header closeButton onClick={() => {console.log("closed button clicked")}   }>
                <Modal.Title><h2>Add New Task/Action</h2> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <AddNewGRItem refresh={this.grabFireBaseRoutinesGoalsData} isRoutine={this.state.isRoutine} /> */}
                <div className="input-group mb-3" >
                    <input placeholder="Enter Title" value={this.state.newItem.title} onChange={this.handleInputChange} />
                </div >
                </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {console.log("closed button clicked")}  }>Close</Button>
                <Button variant="info" onClick={() => { console.log("closed button clicked")}  }>Save changes</Button>
            </Modal.Footer>
        </Modal.Dialog>

        )
    }
}
