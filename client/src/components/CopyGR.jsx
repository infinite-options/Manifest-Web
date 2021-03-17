import React, { Component } from "react";
import { faCopy, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownButton, Modal, ModalBody, ToggleButtonGroup, ToggleButton} from "react-bootstrap";
import DatePicker from "react-datepicker";
import ShowNotifications from "./ShowNotifications";
import moment from "moment";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";

import DateAndTimePickers from "./DatePicker";

import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";
import axios from 'axios';
import { Switch } from "react-router";

export default class CopyGR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grTitle: this.props.title,
            showCopyModal: false,
            value: 1,
            advisorIdAndNames: [],
            currentAdvisorCandidateName: "",
            currentAdvisorCandidateId: "",
            currentAdvisorEmailId: "",
            userNames: [],
            currentUserCandidateName: "",
            currentUserCandidateId: "",
            };
  }

  
  newInputSubmit = () => {
   
    
 
    let url = this.props.BASE_URL + "copyGR";

    let body = {
      user_id: this.state.currentUserCandidateId,
      gr_id: this.props.gr_id,
      ta_id: this.state.currentAdvisorCandidateId,
    }
    
    console.log(body);
    
    axios.post(url, body)
       .then(() => {
         console.log("Copied to Database")
         
         if (this.props != null) {
           this.props.closeCopyModal();
         }
       })
       .catch((err) => {
         console.log("Error copying Goal/Routine", err);
       });
  };

 handleChange = (val) => {
  this.setState({value: val})
 }

 listAllTAs = () => {
  
  axios
    .get(
      this.props.BASE_URL + "listAllTAForCopy"    )
    .then((response) => {
      if (response.data.result.length !== 0) {
        response.data.result.forEach((d, i) => {
          this.state.advisorIdAndNames[i] = {
            first_name: d.ta_first_name,
            last_name: d.ta_last_name,
            uid: d.ta_unique_id,
            email_id: d.ta_email_id,
          };
        });
      }
    });
};

listAllUsers = () => {
  console.log("Selected user", this.state.currentAdvisorEmailId)
  let allUsers = []
  axios
  .get
  (this.props.BASE_URL + "usersOfTA/" + this.state.currentAdvisorEmailId).then(
    (response) => {
      if (response.data.result.length !== 0) {
        console.log(response)
        response.data.result.forEach((d, i) => {
          allUsers[i] = {
            user_name: d.user_name,
            uid: d.user_unique_id,
            email_id: d.user_email_id,
          };
        });
      }
    });
    // console.log(this.state.userNames)
    this.setState({userNames: allUsers})
    console.log(this.state.userNames)
};


changeCurrentTACandidate = (advisorId, userId, data) => {
  console.log(data)
  this.setState({
    currentAdvisorCandidateName: data["first_name"] + data["last_name"],
    currentAdvisorCandidateId: data["uid"],
    currentAdvisorEmailId: data["email_id"]
  }, () => {
    this.listAllUsers();
    
  });
  
};

changeCurrentUserCandidate = (userId, data) => {

  this.setState({
    currentUserCandidateName: data["user_name"],
    currentUserCandidateId: data["uid"]
  });
};
  
  editGRForm = () => {
    this.listAllTAs();
    return (
      <Row
        style={{
          marginLeft: "0px",
          border: "2px",
          padding: "15px",
          marginTop: "10px",
        }}
      >
        <div style={{ marginTop: "10px" }}>
        <label>Copy To:</label>
      </div>
      <Form.Group style={{ marginTop: "10px" }}>
          <Form.Label> </Form.Label>
      <div >
      <ToggleButtonGroup type="checkbox" value={this.state.value || 1} 
       onChange={(e) => {
         console.log(e)
        this.setState({ value: e });
      }}>
      <ToggleButton value={1}>MySpace</ToggleButton>
      <ToggleButton value={2}>MyLife</ToggleButton>
    </ToggleButtonGroup>
      </div>  
      <div>
      <DropdownButton
                      variant="outline-primary"
                      style={{ marginTop: "10px" }}
                      title={this.state.currentAdvisorCandidateName ||
                        "Choose the advisor"
                      }
                    >
      {Object.keys(this.state.advisorIdAndNames).map(
                        (keyName, keyIndex) => (
                          <Dropdown.Item
                            key={keyName}
                            onClick={(e) => {
                              this.changeCurrentTACandidate(
                                keyName,
                                this.state.currentUserId,
                                this.state.advisorIdAndNames[keyName]
                              );
                            }}
                          >
                            {this.state.advisorIdAndNames[keyName][
                              "first_name"
                            ] +
                              " " +
                              this.state.advisorIdAndNames[keyName][
                                "last_name"
                              ] || ""}
                          </Dropdown.Item>
                        )
                      )}
                      </DropdownButton>
                      <DropdownButton
                      variant="outline-primary"
                      style={{ marginTop: "10px" }}
                      title={this.state.currentUserCandidateName ||
                        "Choose the User"
                      }
                    >
      {Object.keys(this.state.userNames).map(
                        (keyName, keyIndex) => (
                          <Dropdown.Item
                            key={keyName}
                            onClick={(e) => {
                              this.changeCurrentUserCandidate(
                                keyName,
                                this.state.userNames[keyName]
                              );
                            }}
                          >
                            {this.state.userNames[keyName][
                              "user_name"
                            ] 
                               || ""}
                          </Dropdown.Item>
                        )
                      )}
                      </DropdownButton>
                            </div>

      </Form.Group>
      <Form.Group>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              // this.setState({ showEditModal: false });
              this.props.closeCopyModal();
            }}
          >
            Close
          </Button>
          <Button
            variant="info"
            onClick={(e) => {
              e.stopPropagation();
              this.newInputSubmit();
            }}
          >
            Save changes
          </Button>
        </Form.Group>

      </Row>
    );
  };

  
  showIcon = () => {
    return (
      <div style={{ marginLeft: "5px" }}>
        <FontAwesomeIcon
          title="Edit Item"
          onMouseOver={(event) => {
            event.target.style.color = "#48D6D2";
          }}
          onMouseOut={(event) => {
            event.target.style.color = "#000000";
          }}
          style={{ color: "#000000" }}
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ showEditModal: true });
          }}
          icon={faCopy}
          size="lg"
        />
      </div>
    );
  };

  render() {
    console.log(this.props.showModal, this.props.i, this.props.indexEditing)
    return (
      <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {this.props.showModal && this.props.i === this.props.indexEditing ? (
        this.editGRForm()
      ) : (
        <div> </div>
      )}
    </div>
    );
  }
}