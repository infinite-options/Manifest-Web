import React from "react";
import firebase from "./firebase";
import AddNewPeople from "./AddNewPeople";
import SettingPage from "./SettingPage";
import {
  Form,
  Row,
  Col,
  Modal,
  Button,
  Container,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTemperatureHigh } from "@fortawesome/free-solid-svg-icons";
import { storage } from "./firebase";
import axios from "axios";
import UploadPeopleImages from "./UploadPeopleImages";
// import DateAndTimePickers from "./DatePicker";
import DatePicker from 'react-datepicker'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


class AboutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // firebaseRootPath: firebase
      //   .firestore()
      //   .collection("users")
      //   .doc(this.props.theCurrentUserId),
     
      imageChanged: false,
      importantPeople1id: null,
      importantPeople2id: null,
      importantPeople3id: null,
      aboutMeObject: {
        birth_date: new Date(),
        birth_date_change: false,
        phone_number: "",
        have_pic: false,
        message_card: "",
        message_day: "",
        pic: "",
        timeSettings: {
          morning: "",
          afternoon: "",
          evening: "",
          night: "",
          dayStart: "",
          dayEnd: "",
          timeZone: "",
        },
      },
      firstName: "",
      lastName: "",
      peopleNamesArray: {},
      importantPoeplArrayLength: "0",
      importantPeople1: {
        have_pic: false,
        important: false,
        name: "",
        email: "",
        phone_number: "",
        pic: "",
        relationship: "",
        unique_id: "",
        url: "",
      },
      importantPeople2: {
        have_pic: false,
        important: false,
        name: "",
        email: "",
        phone_number: "",
        pic: "",
        relationship: "",
        unique_id: "",
        url: "",
      },
      importantPeople3: {
        have_pic: false,
        important: false,
        name: "",
        email: "",
        phone_number: "",
        pic: "",
        relationship: "",
        unique_id: "",
        url: "",
      },

      ImporPersonOneChange: false,
      ImporPersonTwoChange: false,
      ImporPersonThreeChange: false,
      importantPeople1Previous: {},
      importantPeople2Previous: {},
      importantPeople3Previous: {},
      importantPeople1DocRefChanged: null,
      importantPeople2DocRefChanged: null,
      importantPeople3DocRefChanged: null,
      showAddNewPeopleModal: false,
      showTimeModal: false,
      saveButtonEnabled: true,
      enableDropDown: false,
      url: "",
      allPeopleList: {},
      nonImportantPeople: {},
    };
  }

  componentDidMount() {
    this.grabFireBaseAboutMeData();
    this.grabFireBaseAllPeopleNames();
  }

  hideAboutForm = (e) => {
    this.props.CameBackFalse();
  };

  handleFileSelected = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.target.files[0]; //stores file uploaded in file
    console.log(file);

    this.setState({
      saveButtonEnabled: false,
      imageChanged: true,
    });

    let targetFile = file;
    if (
      targetFile !== null &&
      Object.keys(this.state.aboutMeObject).length !== 0
    ) {
      let temp = this.state.aboutMeObject;
      temp.have_pic = true;
      temp.pic = file;
      this.setState({
        aboutMeObject: temp,
        saveButtonEnabled: true,
        url: URL.createObjectURL(event.target.files[0]),
      });
      console.log(this.state.url);
    }
    console.log(this.state.aboutMeObject.pic);
    console.log(event.target.files[0].name);
  };

  setPhotoURLFunction1 = (photo, photo_url) => {
    let temp = this.state.importantPeople1;
    temp.pic = photo;
    temp.url = photo_url;
    temp.have_pic = true;
    this.setState({ importantPeople1: temp });
  };

  setPhotoURLFunction2 = (photo, photo_url) => {
    let temp = this.state.importantPeople2;
    temp.pic = photo;
    temp.url = photo_url;
    temp.have_pic = true;
    this.setState({ importantPeople2: temp });
    console.log(this.state.importantPeople2);
  };

  setPhotoURLFunction3 = (photo, photo_url) => {
    let temp = this.state.importantPeople3;
    temp.pic = photo;
    temp.url = photo_url;
    temp.have_pic = true;
    this.setState({ importantPeople3: temp });
  };

  handleImpPeople1 = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file2 = event.target.files[0]; //stores file uploaded in file
    console.log(file2);

    this.setState({
      saveButtonEnabled: false,
    });

    let targetFile = file2;
    if (
      targetFile !== null &&
      Object.keys(this.state.importantPeople1).length !== 0
    ) {
      let temp = this.state.importantPeople1;
      temp.have_pic = true;
      temp.pic = file2;
      temp.url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        importantPeople1: temp,
        saveButtonEnabled: true,
      });
      console.log(this.state.url);
    }
    console.log(this.state.importantPeople1.url);
    console.log(event.target.files[0].name);
  };

  handleImpPeople2 = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file3 = event.target.files[0]; //stores file uploaded in file
    console.log(file3);

    this.setState({
      saveButtonEnabled: false,
    });

    let targetFile = file3;
    if (
      targetFile !== null &&
      Object.keys(this.state.importantPeople2).length !== 0
    ) {
      let temp = this.state.importantPeople2;
      temp.have_pic = true;
      temp.pic = file3;
      temp.url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        importantPeople2: temp,
        saveButtonEnabled: true,
      });
      console.log(this.state.url);
    }
    console.log(this.state.importantPeople2.pic);
    console.log(event.target.files[0].name);
  };

  handleImpPeople3 = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file4 = event.target.files[0]; //stores file uploaded in file
    console.log(file4);

    this.setState({
      saveButtonEnabled: false,
    });

    let targetFile = file4;
    if (
      targetFile !== null &&
      Object.keys(this.state.importantPeople3).length !== 0
    ) {
      let temp = this.state.importantPeople3;
      temp.have_pic = true;
      temp.pic = file4;
      temp.url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        importantPeople3: temp,
        saveButtonEnabled: true,
      });
      console.log(this.state.url);
    }
    console.log(this.state.importantPeople3.pic);
    console.log(event.target.files[0].name);
  };

  // Currently working on right now
  grabFireBaseAllPeopleNames = () => {
    let url = this.props.BASE_URL + "listPeople/";

    let allPeopleList = {};
    let importantPeopleArray = [];
    let nonImportantPeople = {};
    let test = {};
    let impCount = 0;

    axios
      .get(url + this.props.theCurrentUserId)
      .then((response) => {
        let peopleList = response.data.result.result;
        console.log(" All People", peopleList)
        if (peopleList && peopleList.length !== 0) {
          console.log(peopleList);
          peopleList.forEach((d, i) => {
            allPeopleList[d.ta_people_id] = d;
            if ((d.important.toLowerCase() === "true") && (importantPeopleArray.length < 3)) {
              importantPeopleArray.push(d);
              impCount++;
            } else if ((d.important.toLowerCase() === "false") || (importantPeopleArray.length == 3)){
              test[d.ta_people_id] = d.name;
              nonImportantPeople[d.ta_people_id] = d;
            }
          });

          if (importantPeopleArray.length >= 3) {
            // console.log("Before", nonImportantPeople)
            // if(importantPeopleArray.length > 3){
            //   console.log("Inside")
            //   nonImportantPeople = {
            //     ...nonImportantPeople,
            //     ...importantPeopleArray.slice(3,importantPeopleArray.length)
            //   }
                
            // }
            // console.log("After", nonImportantPeople)

            console.log(nonImportantPeople)
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: impCount,
              importantPeople1: importantPeopleArray[0],
              importantPeople2: importantPeopleArray[1],
              importantPeople3: importantPeopleArray[2],
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
            let temp1 = this.state.importantPeople1;
            temp1.url = "";
            temp1.have_pic = this.state.importantPeople1.have_pic
              ? this.state.importantPeople1.have_pic.toLowerCase() === "true"
              : false;
            let temp2 = this.state.importantPeople2;
            temp2.url = "";
            temp2.have_pic = this.state.importantPeople2.have_pic
              ? this.state.importantPeople2.have_pic.toLowerCase() === "true"
              : false;
            let temp3 = this.state.importantPeople3;
            temp3.url = "";
            temp3.have_pic = this.state.importantPeople3.have_pic
              ? this.state.importantPeople3.have_pic.toLowerCase() === "true"
              : false;

            this.setState({
              importantPeople1: temp1,
              importantPeople2: temp2,
              importantPeople3: temp3,
            });
          } else if (importantPeopleArray.length === 2) {
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: importantPeopleArray.length,
              importantPeople1: importantPeopleArray[0],
              importantPeople2: importantPeopleArray[1],
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
            let temp1 = this.state.importantPeople1;
            temp1.url = "";
            temp1.have_pic = this.state.importantPeople1.have_pic
              ? this.state.importantPeople1.have_pic.toLowerCase() === "true"
              : false;
            let temp2 = this.state.importantPeople2;
            temp2.url = "";
            temp2.have_pic = this.state.importantPeople2.have_pic
              ? this.state.importantPeople2.have_pic.toLowerCase() === "true"
              : false;

            this.setState({
              importantPeople1: temp1,
              importantPeople2: temp2,
            });
          } else if (importantPeopleArray.length === 1) {
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: importantPeopleArray.length,
              importantPeople1: importantPeopleArray[0],
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
            let temp1 = this.state.importantPeople1;
            temp1.url = "";
            temp1.have_pic = this.state.importantPeople1.have_pic
              ? this.state.importantPeople1.have_pic.toLowerCase() === "true"
              : false;

            this.setState({
              importantPeople1: temp1,
            });
          } else if (importantPeopleArray.length === 0) {
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: importantPeopleArray.length,
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
          }
        } else {
          console.log("No people list");
        }
      })
      .catch((err) => {
        console.log("Error getting all people list", err);
      });
  };
  
  grabFireBaseAboutMeData = () => {
    console.log(this.props.BASE_URL)
    let url = this.props.BASE_URL + "aboutme/";
    console.log(url)

    // console.log("!!")
    // console.log(this.props.theCurrentUserId)
    axios
      .get(url + this.props.theCurrentUserId)
      .then((response) => {
        if (response.data.result.length !== 0) {
          let details = response.data.result[0];
          console.log(details.user_birth_date)
          
          let x = {
            birth_date: Date.parse(details.user_birth_date),
            phone_number: details.user_phone_number,
            have_pic: details.user_have_pic
              ? details.user_have_pic.toLowerCase() === "true"
              : false,
            message_card: details.message_card,
            message_day: details.message_day,
            pic: details.user_picture || "",
            timeSettings: {
              morning: details.morning_time,
              afternoon: details.afternoon_time,
              evening: details.evening_time,
              night: details.night_time,
              dayStart: details.day_start,
              dayEnd: details.day_end,
              timeZone: details.time_zone
            },
          };

          console.log(x.birth_date)

          this.setState({
            aboutMeObject: x,
            firstName: details.user_first_name,
            lastName: details.user_last_name,
            url: "",
          });
        } else {
          console.log("No user details");
        }
      })
      .catch((err) => {
        console.log("Error getting user details", err);
      });
  };

  hidePeopleModal = () => {
    this.setState({ showAddNewPeopleModal: false });
  };

  hideTimeModal = () => {
    this.setState({ showTimeModal: false });
  };

  updatePeopleArray = () => {
    this.grabFireBaseAllPeopleNames();
  };

  updateTimeSetting = (time) => {
    let temp = this.state.aboutMeObject;
    temp.timeSettings = time;
    this.setState({ aboutMeObject: temp, showTimeModal: false });
  };

  changeImpPersonOne = (Reference) => {
    let temp = this.state.nonImportantPeople[Reference];
    temp.important = true;
    temp.url = "";
    temp.have_pic = temp.have_pic
      ? temp.have_pic.toLowerCase() === "true"
      : false;
    let temp2 = {};

    if (this.state.ImporPersonOneChange === false) {
      temp2 = this.state.importantPeople1;
      temp2.important = false;
    } else {
      temp2 = this.state.importantPeople1Previous;
    }

    this.setState({
      ImporPersonOneChange: true,
      importantPeople1Previous: temp2,
      importantPeople1: temp,
    });

    console.log("Updated Important Person One in Client");
  };

  // changeImpPersonOne = (Reference) => {
  //     //Set the new person as an important person.
  //     this.state.firebaseRootPath.collection('people').doc(Reference).get()
  //     .then((doc) => {
  //        let temp  = {};
  //        let temp2 = {};
  //        temp = doc.data();
  //        temp.important = true;
  //        if(this.state.ImporPersonOneChange === false ){
  //             temp2 = this.state.importantPeople1;
  //             temp2.important = false;
  //        }
  //        else{
  //            temp2 = this.state.importantPeople1Previous;
  //        }
  //        this.setState({ImporPersonOneChange: true,importantPeople1Previous: temp2 , importantPeople1DocRefChanged: doc.ref.id, importantPeople1: temp});
  //     })
  //     .catch((err) => {
  //         console.log('Error getting documents', err);
  //     });
  // }

  changeImpPersonTwo = (Reference) => {
    let temp = this.state.nonImportantPeople[Reference];
    temp.important = true;
    temp.url = "";
    temp.have_pic = temp.have_pic
      ? temp.have_pic.toLowerCase() === "true"
      : false;
    let temp2 = {};

    if (this.state.ImporPersonTwoChange === false) {
      temp2 = this.state.importantPeople2;
      temp2.important = false;
    } else {
      temp2 = this.state.importantPeople2Previous;
    }

    this.setState({
      ImporPersonTwoChange: true,
      importantPeople2Previous: temp2,
      importantPeople2: temp,
    });
    console.log("Updated Important Person Two in Client");
  };

  // changeImpPersonTwo = (Reference) => {
  //     //Set the new person as an important person.
  //     this.state.firebaseRootPath.collection('people').doc(Reference).get()
  //     .then((doc) => {
  //        let temp  = {};
  //        let temp2 = {};
  //        temp = doc.data();
  //        temp.important = true;
  //        if(this.state.ImporPersonTwoChange === false ){
  //             temp2 = this.state.importantPeople2;
  //             temp2.important = false;
  //        }
  //        else{
  //            temp2 = this.state.importantPeople2Previous;
  //        }
  //        this.setState({ImporPersonTwoChange: true,importantPeople2Previous: temp2 , importantPeople2DocRefChanged: doc.ref.id, importantPeople2: temp});
  //     })
  //     .catch((err) => {
  //         console.log('Error getting documents', err);
  //     });
  // }

  changeImpPersonThree = (Reference) => {
    let temp = this.state.nonImportantPeople[Reference];
    temp.important = true;
    temp.url = "";
    temp.have_pic = temp.have_pic
      ? temp.have_pic.toLowerCase() === "true"
      : false;
    let temp2 = {};

    if (this.state.ImporPersonThreeChange === false) {
      temp2 = this.state.importantPeople3;
      temp2.important = false;
    } else {
      temp2 = this.state.importantPeople3Previous;
    }

    this.setState({
      ImporPersonThreeChange: true,
      importantPeople3Previous: temp2,
      importantPeople3: temp,
    });
    console.log("Updated Important Person Three in Client");
  };

  // changeImpPersonThree = (Reference) => {
  //     //Set the new person as an important person.
  //     this.state.firebaseRootPath.collection('people').doc(Reference).get()
  //     .then((doc) => {
  //        let temp  = {};
  //        let temp2 = {};
  //        temp = doc.data();
  //        temp.important = true;
  //        if(this.state.ImporPersonThreeChange === false ){
  //             temp2 = this.state.importantPeople3;
  //             temp2.important = false;
  //        }
  //        else{
  //            temp2 = this.state.importantPeople3Previous;
  //        }
  //        this.setState({ImporPersonThreeChange: true,importantPeople3Previous: temp2 , importantPeople3DocRefChanged: doc.ref.id, importantPeople3: temp});
  //     })
  //     .catch((err) => {
  //         console.log('Error getting documents', err);
  //     });
  // }

  newInputSubmit = () => {
   
    let people = Object.values(this.state.allPeopleList);

    people.forEach((d, i) => {
      if (d.email) delete d.email;
      // delete d.phone_number;
      if (d.user_id) delete d.user_id;
      if (d.user_name) delete d.user_name;
      if (d.user_uid) delete d.user_uid;
      if (!d.pic) d.pic = "";
    });

    if (this.state.importantPeople1.important === true) {
      if (this.state.ImporPersonOneChange === true) {
        if (this.state.importantPeople1Previous.ta_people_id) {
          this.state.allPeopleList[
            this.state.importantPeople1Previous.ta_people_id
          ].important = "FALSE";
        }
        this.state.allPeopleList[
          this.state.importantPeople1.ta_people_id
        ].important = "TRUE";
      }
    }

    if (this.state.importantPeople2.important === true) {
      if (this.state.ImporPersonTwoChange === true) {
        if (this.state.importantPeople2Previous.ta_people_id) {
          this.state.allPeopleList[
            this.state.importantPeople2Previous.ta_people_id
          ].important = "FALSE";
        }
        this.state.allPeopleList[
          this.state.importantPeople2.ta_people_id
        ].important = "TRUE";
      }
    }

    if (this.state.importantPeople3.important === true) {
      if (this.state.ImporPersonThreeChange === true) {
        if (this.state.importantPeople3Previous.ta_people_id) {
          this.state.allPeopleList[
            this.state.importantPeople3Previous.ta_people_id
          ].important = "FALSE";
        }
        this.state.allPeopleList[
          this.state.importantPeople3.ta_people_id
        ].important = "TRUE";
      }
    }

    for (let i = 0; i < people.length; ++i) {
      let currentPeople = {};
      currentPeople.user_id = this.props.theCurrentUserId;
      currentPeople.ta_people_id = people[i].ta_people_id;
      currentPeople.have_pic = people[i].have_pic;
      if (typeof people[i].pic === "string") {
        currentPeople.photo_url = people[i].pic;
        currentPeople.pic = "";
      } else {
        currentPeople.pic = people[i].pic;
        currentPeople.photo_url = "";
      }
      currentPeople.pic = people[i].pic;
      currentPeople.important = people[i].important;
      currentPeople.name = people[i].name;
      currentPeople.relationship = people[i].relationship;
      currentPeople.phone_number = people[i].phone_number;
      currentPeople.ta_id = this.props.theCurrentTAId;
      let peopleUrl = this.props.BASE_URL + "updatePeople";

      let peopleFormData = new FormData();
      Object.entries(currentPeople).forEach((entry) => {
        if (entry[1].name != undefined) {
          console.log(entry[1].name);
          if (typeof entry[1].name == "string") {
            peopleFormData.append(entry[0], entry[1]);
          }
        } else if (entry[1] instanceof Object) {
          entry[1] = JSON.stringify(entry[1]);
          peopleFormData.append(entry[0], entry[1]);
        } else {
          peopleFormData.append(entry[0], entry[1]);
        }
      });

      axios
        .post(peopleUrl, peopleFormData)
        .then(() => {
          console.log("Updated Details");
        })
        .catch((err) => {
          console.log("Error updating Details", err);
        });
    }

    
    const body = {
      user_id: this.props.theCurrentUserId,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      have_pic: this.state.aboutMeObject.have_pic,
      message_card: this.state.aboutMeObject.message_card,
      message_day: this.state.aboutMeObject.message_day,
      picture: this.state.aboutMeObject.pic,
      timeSettings: this.state.aboutMeObject.timeSettings,
      phone_number: this.state.aboutMeObject.phone_number
    };

    if(this.state.aboutMeObject.birth_date_change){
      body.birth_date = (this.state.aboutMeObject.birth_date).toISOString()
    }
    else{
      var date = new Date(this.state.aboutMeObject.birth_date)
      body.birth_date = date;
      var br = JSON.stringify(body.birth_date)
      body.birth_date = br.substring(1, br.length-1)
      
    }
    console.log("Pragya", body.birth_date)
    if (typeof body.picture === "string") {
      body.photo_url = body.picture;
      body.picture = "";
    } else {
      body.photo_url = "";
    }

    let url =  this.props.BASE_URL + "update";

    let formData = new FormData();
    Object.entries(body).forEach((entry) => {
      if (entry[1].name != undefined) {
        if (typeof entry[1].name === "string") {
          formData.append(entry[0], entry[1]);
        }
      } else if (entry[1] instanceof Object) {
        entry[1] = JSON.stringify(entry[1]);
        formData.append(entry[0], entry[1]);
      } 
     else {
        formData.append(entry[0], entry[1]);
      }
    });

    console.log(body);
    axios
      .post(url, formData)
      .then(() => {
        console.log("Updated Details");
        this.hideAboutForm();
     
        if(this.state.imageChanged){
          this.props.updateProfilePic(body.first_name + " " + body.last_name, this.state.url)
        }
        else{
          this.props.updateProfilePic(body.first_name + " " + body.last_name, this.state.aboutMeObject.pic)
        }
        this.props.updateProfileTimeZone(this.state.aboutMeObject.timeSettings['timeZone'])
      })
      .catch((err) => {
        console.log("Error updating Details", err);
        //    result.json(false);
      });

    // this.state.firebaseRootPath.update({'first_name': this.state.firstName});
    // this.state.firebaseRootPath.update({'last_name': this.state.lastName});
    //  let newArr = this.state.aboutMeObject;
    //  let name = this.state.firstName + " " + this.state.lastName;
    //  this.state.firebaseRootPath.update({ 'about_me': newArr }).then(
    //     (doc) => {
    //         this.props.updateProfilePic(name, this.state.aboutMeObject.pic);
    //         this.props.updateProfileTimeZone(this.state.aboutMeObject.timeSettings.timeZone);
    //         this.hideAboutForm();
    //     }
    // )
  };

  startTimePicker = () => {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker
        className="form-control"
        type="text"
        placeholder="Enter Birth Date"
        selected={this.state.aboutMeObject.birth_date}
        onChange={(date) => {
          let temp = this.state.aboutMeObject;
          temp.birth_date = date
          temp.birth_date_change = true
          console.log(date)
          this.setState(
            {
              aboutmeObject: temp,
            });
        }}
     
        dateFormat="MMMM d, yyyy"
      />
    );
  };
  // newInputSubmit = () => {
  //     if(this.state.importantPeople1.important === true){
  //         if(this.state.ImporPersonOneChange === true){
  //             if(this.state.importantPeople1id != null){
  //                 this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople1id).update(this.state.importantPeople1Previous);
  //             }
  //             if(this.state.importantPeople1DocRefChanged != null){
  //                 this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople1DocRefChanged).update(this.state.importantPeople1);
  //             }
  //         }
  //         else{
  //             this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople1id).update(this.state.importantPeople1);
  //         }
  //     }
  //     if(this.state.importantPeople2.important === true){
  //         if(this.state.ImporPersonTwoChange === true){
  //             if(this.state.importantPeople2id != null){
  //                 this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople2id).update(this.state.importantPeople2Previous);
  //             }
  //             if(this.state.importantPeople2DocRefChanged != null){
  //                 this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople2DocRefChanged).update(this.state.importantPeople2);
  //             }
  //         }
  //         else{
  //             this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople2id).update(this.state.importantPeople2);
  //         }
  //     }
  //     if(this.state.importantPeople3.important === true){
  //         if(this.state.ImporPersonThreeChange === true){
  //             if(this.state.importantPeople3id != null){
  //                 this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople3id).update(this.state.importantPeople3Previous);
  //             }
  //             if(this.state.importantPeople3DocRefChanged != null){
  //                 this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople3DocRefChanged).update(this.state.importantPeople3);
  //             }
  //         }
  //         else{
  //             this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople3id).update(this.state.importantPeople3);
  //         }
  //     }
  //     this.state.firebaseRootPath.update({'first_name': this.state.firstName});
  //     this.state.firebaseRootPath.update({'last_name': this.state.lastName});
  //     let newArr = this.state.aboutMeObject;
  //     let name = this.state.firstName + " " + this.state.lastName;
  //     this.state.firebaseRootPath.update({ 'about_me': newArr }).then(
  //        (doc) => {
  //            this.props.updateProfilePic(name, this.state.aboutMeObject.pic);
  //            this.props.updateProfileTimeZone(this.state.aboutMeObject.timeSettings.timeZone);
  //            this.hideAboutForm();
  //        }
  //     )
  // }

  render() {
    console.log(this.state.aboutMeObject.phone_number)
    return (
      <div>
        <Modal.Dialog
          style={{
            borderRadius: "15px",
            boxShadow:
              "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
            marginLeft: "35px",
            width: "350px",
            marginTop: "0",
          }}
        >
          <Modal.Header
            closeButton
            onHide={() => {
              this.hideAboutForm();
            }}
          >
            <Modal.Title>
              <h5 className="normalfancytext">About Me</h5>{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Row>
                <Col style={{ paddingRight: "0px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px" }}>
                    First:
                  </label>
                </Col>
                <Col xs={9} style={{ paddingLeft: "0px" }}>
                  <Form.Control
                    type="text"
                    placeholder="First Last"
                    value={this.state.firstName || ""}
                    onChange={(e) => {
                      e.stopPropagation();
                      this.setState({ firstName: e.target.value });
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ paddingRight: "0px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px" }}>
                    Last:
                  </label>
                </Col>
                <Col xs={9} style={{ paddingLeft: "0px" }}>
                  <Form.Control
                    type="text"
                    placeholder="First Last"
                    value={this.state.lastName || ""}
                    onChange={(e) => {
                      e.stopPropagation();
                      this.setState({ lastName: e.target.value });
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ paddingRight: "0px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px" }}>
                    Birth Date:
                  </label>
                </Col>
                <Col xs={9} style={{ paddingLeft: "0px" }}>
                  {this.startTimePicker()}
                </Col>
              </Row>
              <Row>
                <Col style={{ paddingRight: "0px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px" }}>
                    Phone Number:
                  </label>
                </Col>
                <Col xs={8} style={{ paddingLeft: "0px" }}>
                <PhoneInput
                  class= "form-control"
                  placeholder="Enter phone number"
                  value={this.state.aboutMeObject.phone_number}
                  onChange={(e) => {
                    let temp = this.state.aboutMeObject
                    temp.phone_number = e
                    this.setState(
                      {
                        aboutMeObject: temp,
                      });
                  }}/>
                </Col>
              </Row>
            </Form.Group>
            <Row>
              <Col>
                {this.state.aboutMeObject.have_pic === false ? (
                  <FontAwesomeIcon icon={faImage} size="6x" />
                ) : this.state.url === "" ? (
                  <img
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "100%",
                      height: "70px",
                    }}
                    src={this.state.aboutMeObject.pic}
                    alt="Profile"
                  />
                ) : (
                  <img
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "100%",
                      height: "70px",
                    }}
                    src={this.state.url}
                    alt="Profile"
                  />
                )}
              </Col>
              <Col xs={8}>
                <label>Upload A New Image</label>
                <input
                  style={{ color: "transparent" }}
                  accept="image/*"
                  type="file"
                  onChange={this.handleFileSelected}
                  id="ProfileImage"
                />
              </Col>
            </Row>

            <Form.Group controlId="AboutMessage" style={{ marginTop: "10px" }}>
              <Form.Label>Message (My Day):</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                type="text"
                placeholder="You are a strong ..."
                value={this.state.aboutMeObject.message_day || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.aboutMeObject;
                  temp.message_day = e.target.value;
                  this.setState({ aboutMeObject: temp });
                }}
              />
            </Form.Group>
            <Form.Group controlId="AboutMessageCard">
              <Form.Label>Message (My Card):</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                type="text"
                placeholder="You are a safe ..."
                value={this.state.aboutMeObject.message_card || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.aboutMeObject;
                  temp.message_card = e.target.value;
                  this.setState({ aboutMeObject: temp });
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Important People</Form.Label>

              <Row>
                <Col>
                  {this.state.importantPeople1.have_pic === false ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        size="6x"
                        style={{ marginLeft: "5px" }}
                      />
                      {this.state.importantPeople1.important === false ? (
                        <input
                          style={{
                            color: "transparent",
                            marginTop: "15px",
                            width: "100px",
                            overflow: "hidden",
                          }}
                          type="file"
                          accept="image/*"
                          disabled
                        />
                      ) : (
                        <UploadPeopleImages
                          parentFunction={this.setPhotoURLFunction1}
                          currentTAId={this.props.theCurrentTAId}
                          BASE_URL={this.props.BASE_URL}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.importantPeople1.url === "" ? (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople1.pic}
                          alt="Important People 1"
                        />
                      ) : (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople1.url}
                          alt="Important People 1"
                        />
                      )}
                      <UploadPeopleImages
                        parentFunction={this.setPhotoURLFunction1}
                        currentTAId={this.props.theCurrentTAId}
                        BASE_URL={this.props.BASE_URL}
                      />
                    </div>
                  )}
                </Col>
                <Col xs={7} style={{ paddingLeft: "0px", marginTop: "10px" }}>
                  <div className="d-flex flex-row">
                    {this.state.importantPeople1.important === false ? (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value=""
                        disabled
                      />
                    ) : (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value={this.state.importantPeople1.name || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople1;
                          temp.name = e.target.value;
                          this.setState({ importantPeople1: temp });
                        }}
                      />
                    )}
                    {this.state.enableDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      <DropdownButton title="">
                        {Object.keys(this.state.peopleNamesArray).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                this.changeImpPersonOne(keyName);
                              }}
                            >
                              {this.state.peopleNamesArray[keyName]}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                  {this.state.importantPeople1.important === false ? (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value=""
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value=""
                        disabled
                      />
                      <Form.Control type="text" placeholder="Email" value="" />
                    </div>
                  ) : (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value={this.state.importantPeople1.relationship || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople1;
                          temp.relationship = e.target.value;
                          this.setState({ importantPeople1: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={this.state.importantPeople1.phone_number || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople1;
                          temp.phone_number = e.target.value;
                          this.setState({ importantPeople1: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={this.state.importantPeople1.email || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople1;
                          temp.email = e.target.value;
                          this.setState({ importantPeople1: temp });
                        }}
                      />
                    </div>
                  )}
                </Col>
                {this.state.importantPeople1.important === false && (
                  <p style={{ fontSize: "0.9em", marginLeft: "20px" }}>
                    {" "}
                    Choose a person or add a new one
                  </p>
                )}
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Col>
                  {this.state.importantPeople2.have_pic === false ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        size="6x"
                        style={{ marginLeft: "5px" }}
                      />
                      {this.state.importantPeople2.important === false ? (
                        <input
                          style={{
                            color: "transparent",
                            marginTop: "15px",
                            width: "100px",
                            overflow: "hidden",
                          }}
                          type="file"
                          accept="image/*"
                          disabled
                        />
                      ) : (
                        <UploadPeopleImages
                          parentFunction={this.setPhotoURLFunction2}
                          currentTAId={this.props.theCurrentTAId}
                          BASE_URL={this.props.BASE_URL}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.importantPeople2.url === "" ? (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople2.pic}
                          alt="Important People 2"
                        />
                      ) : (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople2.url}
                          alt="Important People 2"
                        />
                      )}
                      <UploadPeopleImages
                        parentFunction={this.setPhotoURLFunction2}
                        currentTAId={this.props.theCurrentTAId}
                        BASE_URL={this.props.BASE_URL}
                      />
                    </div>
                  )}
                </Col>
                <Col xs={7} style={{ paddingLeft: "0px", marginTop: "10px" }}>
                  <div className="d-flex flex-row">
                    {this.state.importantPeople2.important === false ? (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value=""
                        disabled
                      />
                    ) : (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value={this.state.importantPeople2.name || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople2;
                          temp.name = e.target.value;
                          this.setState({ importantPeople2: temp });
                        }}
                      />
                    )}

                    {this.state.enableDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      <DropdownButton title="">
                        {Object.keys(this.state.peopleNamesArray).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                this.changeImpPersonTwo(keyName);
                              }}
                            >
                              {this.state.peopleNamesArray[keyName]}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                  {this.state.importantPeople2.important === false ? (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value=""
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value=""
                        disabled
                      />
                      <Form.Control type="text" placeholder="Email" value="" />
                    </div>
                  ) : (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value={this.state.importantPeople2.relationship || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople2;
                          temp.relationship = e.target.value;
                          this.setState({ importantPeople2: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={this.state.importantPeople2.phone_number || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople2;
                          temp.phone_number = e.target.value;
                          this.setState({ importantPeople2: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={this.state.importantPeople2.email || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople2;
                          temp.email = e.target.value;
                          this.setState({ importantPeople2: temp });
                        }}
                      />
                    </div>
                  )}
                </Col>
                {this.state.importantPeople2.important === false && (
                  <p style={{ fontSize: "0.9em", marginLeft: "20px" }}>
                    {" "}
                    Choose a person or add a new one
                  </p>
                )}
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Col>
                  {this.state.importantPeople3.have_pic === false ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        size="6x"
                        style={{ marginLeft: "5px" }}
                      />
                      {this.state.importantPeople3.important === false ? (
                        <input
                          style={{
                            color: "transparent",
                            marginTop: "15px",
                            width: "100px",
                            overflow: "hidden",
                          }}
                          type="file"
                          accept="image/*"
                          disabled
                        />
                      ) : (
                        <UploadPeopleImages
                          parentFunction={this.setPhotoURLFunction3}
                          currentTAId={this.props.theCurrentTAId}
                          BASE_URL={this.props.BASE_URL}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.importantPeople3.url === "" ? (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople3.pic}
                          alt="Important People 3"
                        />
                      ) : (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople3.url}
                          alt="Important People 3"
                        />
                      )}

                      <UploadPeopleImages
                        parentFunction={this.setPhotoURLFunction3}
                        currentTAId={this.props.theCurrentTAId}
                        BASE_URL={this.props.BASE_URL}
                      />
                    </div>
                  )}
                </Col>
                <Col xs={7} style={{ paddingLeft: "0px", marginTop: "15px" }}>
                  <div className="d-flex flex-row">
                    {this.state.importantPeople3.important === false ? (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value=""
                        disabled
                      />
                    ) : (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value={this.state.importantPeople3.name || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople3;
                          temp.name = e.target.value;
                          this.setState({ importantPeople3: temp });
                        }}
                      />
                    )}

                    {this.state.enableDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      <DropdownButton title="">
                        {Object.keys(this.state.peopleNamesArray).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                this.changeImpPersonThree(keyName);
                              }}
                            >
                              {this.state.peopleNamesArray[keyName]}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                  {this.state.importantPeople3.important === false ? (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value=""
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value=""
                        disabled
                      />
                      <Form.Control type="text" placeholder="Email" value="" />
                    </div>
                  ) : (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value={this.state.importantPeople3.relationship || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople3;
                          temp.relationship = e.target.value;
                          this.setState({ importantPeople3: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={this.state.importantPeople3.phone_number || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople3;
                          temp.phone_number = e.target.value;
                          this.setState({ importantPeople3: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={this.state.importantPeople3.email || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople3;
                          temp.email = e.target.value;
                          this.setState({ importantPeople3: temp });
                        }}
                      />
                    </div>
                  )}
                </Col>
                {this.state.importantPeople3.important === false && (
                  <p style={{ fontSize: "0.9em", marginLeft: "20px" }}>
                    {" "}
                    Choose a person or add a new one
                  </p>
                )}
              </Row>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Container fluid>
              <Row>
                {/* style={{ display: "inline-block", margin: "10px", marginBottom: "0" }} */}

                <Button
                  variant="outline-primary"
                  style={{
                    display: "inline-block",
                    marginLeft: "15px",
                    marginBottom: "10px",
                  }}
                  onClick={() => {
                    this.setState({
                      showTimeModal: true,
                    });
                  }}
                >
                  Time Settings
                </Button>
              </Row>
              <Row>
                <Col xs={3}>
                  {this.state.saveButtonEnabled === false ||
                  this.state.showAddNewPeopleModal === true ? (
                    <Button variant="info" type="submit" disabled>
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="info"
                      type="submit"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.newInputSubmit();
                      }}
                    >
                      Save
                    </Button>
                  )}
                </Col>
                <Col xs={4}>
                  <Button variant="secondary" onClick={this.hideAboutForm}>
                    Cancel
                  </Button>
                </Col>
                <Col xs={4}>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({ showAddNewPeopleModal: true });
                    }}
                  >
                    Add People
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal.Dialog>
        {this.state.showAddNewPeopleModal && (
          <AddNewPeople
            BASE_URL={this.props.BASE_URL}
            closeModal={this.hidePeopleModal}
            newPersonAdded={this.updatePeopleArray}
            currentUserId={this.props.theCurrentUserId}
          />
        )}
        {this.state.showTimeModal && !this.state.showAddNewPeopleModal && (
          <SettingPage
            closeTimeModal={this.hideTimeModal}
            currentTimeSetting={this.state.aboutMeObject.timeSettings || {}}
            newTimeSetting={this.updateTimeSetting}
          />
        )}
      </div>
    );
  }
}

export default AboutModal;
