import React, { Component } from "react";
// import { Button, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

/**
 *
 * This class is responsible for adding a new elemnt to the
 * firebase database. If it becomes successful then we update
 * the view on the firebasev2
 */
export default class DeleteISItem extends Component {
  constructor(props) {
    super(props);
    console.log("DeleteISItem constructor");
    console.log(this.props);
    // console.log('delete index ' + this.props.deleteIndex)
    // console.log(this.props.ISItem)
    // console.log(this.props.ISArray)
  }

  componentDidMount() {
    // console.log('DeleteISItem did mount');
  }

  submitRequest = () => {
    let url = "https://gyn3vgy3fb.execute-api.us-west-1.amazonaws.com/dev/api/v2/deleteIS";
    console.log(url)
    let items = [...this.props.ISArray];
    let i = this.props.deleteIndex;
    const newArr = items.slice(0, i).concat(items.slice(i + 1, items.length));
    console.log(items)
    let body = {
      is_id: items[i]["id"]
    }
    console.log("IS_ID", body)
    axios.post(url, body)
       .then(() => {
         console.log("Deleted Instruction/Step to Database")
         this.props.refresh(newArr);

       })
       .catch((err) => {
         console.log("Error deleting Action/Task", err);
       });
  };

  confirmation = () => {
    const r = window.confirm("Confirm Delete");
    if (r === true) {
      // console.log("Delete Confirm")
      this.submitRequest();
      return;
    }
    console.log("Delete Not Confirm");
  };

  render() {
    console.log("Delete IS render")
    return (
      <div>
        <FontAwesomeIcon
          onMouseOver={(event) => {
            event.target.style.color = "#48D6D2";
          }}
          onMouseOut={(event) => {
            event.target.style.color = "#000000";
          }}
          style={{ color: "#000000", marginRight: "15px", marginLeft: "5px" }}
          onClick={(e) => {
            e.stopPropagation();
            this.confirmation();
          }}
          icon={faTrashAlt}
          size="lg"
        />
      </div>
    );
  }
}
