import React from 'react';
import { Alert, FormFeedback, Spinner, Col, Button, Form, FormGroup, Label, Input, Container, CustomInput } from 'reactstrap';
import firebaseApp from '../firebaseConfig';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import SubmissionSuccess from './SubmissionSuccess';


const initialState = {
    firstName: '',
    lastName: '',
    netId: '',
    grade: '',
    title: '',
    medium: '',
    year: '',
    description: '',
    image: null,
    url: '',
    dimensions: '',
    submitted: false,
    loading: false,
    attemptedToSubmit: false
};


class SubmissionForm extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = initialState;


    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

resetState(){
    this.setState(initialState);
}

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    
    this.setState({
        [name]: value
    });
  }

  handleFiles(event){
    const img = event.target.files[0];
    this.setState({
      image: img
    });
    //   if (event.target.files[0]){
          
    //   }
  }

  validateInput(event){
    event.preventDefault();
    var stateObj = this.state;
    if (stateObj.firstName == '' || stateObj.lastName == '' || stateObj.netId == '' ||
            stateObj.grade == '' || stateObj.image == null || stateObj.title == '' || 
            stateObj.description == '' || stateObj.medium == '' || stateObj.dimensions == '' || 
            stateObj.year == ''){

        window.scrollTo(0, 0)
        this.setState({attemptedToSubmit: true});
    }
    else{
        this.setState({attemptedToSubmit: false});

        this.handleSubmit(event);
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({loading: true});

    /** Submit File to Firebase Storage and submission to database*/
    var file = this.state.image;
    var storageRef = firebaseApp.storage().ref(`Spring${new Date().getFullYear()}/${file.name}`);

    storageRef.put(file).then(() => {
        storageRef.getDownloadURL().then(urlResult => {
            this.setState({url: urlResult});
            this.pushToDatabase();
            
            console.log('Uploaded file successfully: ', file.name, this.state);
            this.setState({
                submitted: true,
            });
        });
    })    

    /**ADD THIS TO SOMEWHERE NOT HERE LMAO */
    //this.resetState();


  }

  pushToDatabase(){
    /** Submit text data to Firebase real-time database*/
    var submissionsRef = firebaseApp.database().ref(`submissions/${new Date().getFullYear()}`);
    var submission = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        netId: this.state.netId,
        grade: this.state.grade,
        title: this.state.title,
        medium: this.state.medium,
        year: this.state.year,
        dimensions: this.state.dimensions,
        description: this.state.description,
        url: this.state.url
    };
    submissionsRef.push(submission);
  }

  render() {
      if (this.state.submitted){
          return (
              <div align="center">
                <h2><b>VisArts Spring {new Date().getFullYear()} Showcase Submission</b></h2>
                <SubmissionSuccess name={this.state.firstName}/>

              </div>
          );
      }
    return (
        <div>
            <h2 align="center"><b>VisArts Spring {new Date().getFullYear()} Showcase Submission</b></h2>
            <div className="submissionForm">

            {this.state.attemptedToSubmit ? <Alert color="danger">Submission failed. All fields are required.</Alert> : ''}
                {/* // (!this.state.submitted) ? */}
            <Form onSubmit={this.validateInput} className="form">

                <FormGroup >
                    <Label>First Name</Label>
                    <Input invalid={this.state.attemptedToSubmit && this.state.firstName == ''} name="firstName" type="text" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange} />
                    <FormFeedback>This field is required</FormFeedback>

                </FormGroup>

                <FormGroup >
                    <Label>Last Name</Label>
                    <Input invalid={this.state.attemptedToSubmit && this.state.lastName == ''} name="lastName" type="text" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} />
                    <FormFeedback>This field is required</FormFeedback>
                </FormGroup>
    
                <FormGroup >
                    <Label>NetID</Label>
                    <Input invalid={this.state.attemptedToSubmit && this.state.netId == ''} name="netId" type="text" placeholder="NetID" value={this.state.netId} onChange={this.handleChange} />
                    <FormFeedback >This field is required</FormFeedback>
                </FormGroup>

                <FormGroup >
                    <Label>Current grade level</Label>
                    <Input invalid={this.state.attemptedToSubmit && this.state.grade == ''} name="grade" type="select" value={this.state.grade} onChange={this.handleChange} placeholder=''>
                        <option></option>
                        <option>First-year</option>
                        <option>Sophomore</option>
                        <option>Junior</option>
                        <option>Senior</option>
                        <option>Graduate/professional</option>
                    </Input>
                    <FormFeedback>This field is required</FormFeedback>

                </FormGroup>

                <FormGroup>
                    <Label>Upload artwork</Label>
                    <CustomInput invalid={this.state.attemptedToSubmit} type="file" name="file" id="file"onChange={this.handleFiles} />
                    <FormFeedback>File upload required</FormFeedback>
                </FormGroup>


                <FormGroup >
                    <Label>Title of work</Label>
                    <Input invalid={this.state.attemptedToSubmit && this.state.title == ''} name="title" type="text" placeholder="Title" value={this.state.title} onChange={this.handleChange} />
                    <FormFeedback>This field is required</FormFeedback>

                </FormGroup>

                <FormGroup >
                    <Label>Description</Label>
                    <Input invalid={this.state.attemptedToSubmit && this.state.description== ''} name="description" type="textarea" placeholder="Description" value={this.state.description} onChange={this.handleChange} />
                    <FormFeedback>This field is required</FormFeedback>

                </FormGroup>

                <FormGroup >
                    <Label>Medium</Label>
                    <Input invalid={this.state.attemptedToSubmit && this.state.medium == ''} name="medium" type="text" placeholder="e.g. digital, screenprint, watercolor, etc." value={this.state.medium} onChange={this.handleChange} />
                    <FormFeedback>This field is required</FormFeedback>

                </FormGroup>

                <FormGroup >
                    <Label>Dimensions (width x height)</Label>
                    <Input invalid={this.state.attemptedToSubmit && this.state.dimensions == ''} name="dimensions" type="text" placeholder="e.g. 10 in. x 16 in." value={this.state.dimensions} onChange={this.handleChange} />
                    <FormFeedback>This field is required</FormFeedback>
                </FormGroup>
        
                <FormGroup >
                    <Label>Year of creation</Label>
                    <Input invalid={this.state.attemptedToSubmit && this.state.year == ''} name="year" type="year" placeholder="Year" value={this.state.year} onChange={this.handleChange} />
                    <FormFeedback>This field is required</FormFeedback>

                </FormGroup>

            

                <Button color="primary" type="submit">
                    Submit
                </Button>
                {
                    (this.state.loading) ? 
                    <Spinner color="primary" /> : ''
                }
            </Form>
            {/* // :
            // <SubmissionSuccess name={this.state.firstName}/> */}
        </div>
        </div>
        
    );
  }
}

export default SubmissionForm;
