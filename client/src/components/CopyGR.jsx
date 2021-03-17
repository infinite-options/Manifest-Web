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

 handleChange = (event) => {
  var val = event.currentTarget.querySelector("input").value;

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
            users: d.users
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
            email_id: d.user_email_id
          };
        });
      }
    });
    this.setState({userNames: Array.from(allUsers)})
    console.log(this.state.userNames)
};


changeCurrentTACandidate = (advisorId, userId, data) => {
  console.log(this.state.value)
  this.setState({
    currentAdvisorCandidateName: data["first_name"] + data["last_name"],
    currentAdvisorCandidateId: data["uid"],
    currentAdvisorEmailId: data["email_id"]
  });
  
  let allUsers = [];
  console.log(data['users'])
  data['users'].forEach((d, i) => {
    allUsers[i] = {
      user_name: d.user_name,
      uid: d.user_unique_id,
      email_id: d.user_email_id,
      users: d.users
    };
  });
  this.setState({userNames: Array.from(allUsers)})

};

changeCurrentUserCandidate = (userId, data) => {

  this.setState({
    currentUserCandidateName: data["user_name"],
    currentUserCandidateId: data["uid"]
  });
};
  
  editGRForm = () => {
    return (
      <Row
        style={{
          marginLeft: "0px",
          border: "2px",
          padding: "15px",
          marginTop: "10px",
        }}
      >
       
      <Form.Group style={{ marginTop: "10px" }}>
          <Form.Label> Copy To: </Form.Label>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-info active" onClick={this.handleChange}>
              <input
                type="radio"
                name="platform"
                value="mySpace"
                autoComplete="off"
              />{" "}
              MySpace
            </label>
              <label className="btn btn-info" onClick={this.handleChange}>
                <input
                  type="radio"
                  name="platform"
                  value="myLife"
                  autoComplete="off"
                />{" "}
            MyLife
          </label>
          
        </div>

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
    this.listAllTAs();

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