import React, { Component } from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";


export default class CopyIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCopyModal: false,
        };
    }

    showIcon = () => {
        console.log(this.props.showModal)
        return (
          <div style={{ marginLeft: "5px" }}>
            <FontAwesomeIcon
              title="Copy Item"

              onMouseOver={(e) => {
                console.log("MouseOver")
                e.target.style.color = "#48D6D2";
              }}
              onMouseOut={(e) => {
                console.log("Mouseout")

                e.target.style.color = "#000000";
              }}
              style={{ color: "#000000" }}
              onClick={(e) => {
                console.log("On click")
                e.stopPropagation();
                console.log("On click1")
                this.setState({ showCopyModal: true });
                console.log("On click3")

                this.props.openCopyModal();
                console.log("On click4")
                console.log("Hi")
              }}
              icon={faCopy}
              size="lg"
            />
          </div>
        );
      };


    render() {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {(this.props.showModal) && this.props.i === this.props.indexEditing? <div></div> : this.showIcon()}
          </div>
        );
      }

}