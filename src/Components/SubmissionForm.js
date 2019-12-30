import React from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import firebaseApp from '../firebaseConfig';


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
    url: ''
};


class SubmissionForm extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = initialState;


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
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
      if (event.target.files[0]){
          const img = event.target.files[0];
          this.setState({
            image: img
          });
      }
  }

  handleSubmit(event) {
    event.preventDefault();


    /** Submit File to Firebase Storage and submission to database*/
    var file = this.state.image;
    var storageRef = firebaseApp.storage().ref(`Spring2020/${file.name}`);

    storageRef.put(file).then(() => {
        storageRef.getDownloadURL().then(urlResult => {
            this.setState({url: urlResult});
            this.pushToDatabase();
            console.log('Uploaded file successfully: ', file.name, this.state);
        });
    })    

    /**ADD THIS TO SOMEWHERE NOT HERE LMAO */
    //this.resetState();

    alert('A name was submitted: ' + this.state.firstName + ' ' + this.state.lastName);

  }

  pushToDatabase(){
    /** Submit text data to Firebase real-time database*/
    var submissionsRef = firebaseApp.database().ref('submissions');
    var submission = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        netId: this.state.netId,
        grade: this.state.grade,
        title: this.state.title,
        medium: this.state.medium,
        year: this.state.year,
        description: this.state.description,
        url: this.state.url
    };
    submissionsRef.push(submission);
  }

  render() {
    return (
        <Container fluid="sm">
            <Form onSubmit={this.handleSubmit}>
                <FormGroup >
                    <Label>First Name</Label>
                    <Input name="firstName" type="text" value={this.state.firstName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup >
                    <Label>Last Name</Label>
                    <Input name="lastName" type="text" value={this.state.lastName} onChange={this.handleChange} />
                </FormGroup>
    
                <FormGroup >
                    <Label>NetID</Label>
                    <Input name="netId" type="text" value={this.state.netId} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup >
                    <Label>Current grade</Label>
                    <Input name="grade" type="select" value={this.state.grade} onChange={this.handleChange} placeholder=''>
                        <option>First-year</option>
                        <option>Sophomore</option>
                        <option>Junior</option>
                        <option>Senior</option>
                        <option>Graduate/professional</option>
                    </Input>
                </FormGroup>

                <FormGroup >
                    <Label>Title of work</Label>
                    <Input name="title" type="text" value={this.state.title} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup >
                    <Label>Medium</Label>
                    <Input name="medium" type="text" value={this.state.medium} onChange={this.handleChange} />
                </FormGroup>
        
                <FormGroup >
                    <Label>Year of creation</Label>
                    <Input name="year" type="text" value={this.state.year} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup >
                    <Label>Description</Label>
                    <Input name="description" type="textarea" value={this.state.description} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label>Upload file</Label>
                    <Input type="file" name="file" onChange={this.handleFiles} />
                </FormGroup>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>

    );
  }
}

export default SubmissionForm;
