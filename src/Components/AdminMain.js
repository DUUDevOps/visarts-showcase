import React from 'react';

import BootstrapTable from 'react-bootstrap-table-next';


import firebaseApp from '../firebaseConfig';
import { Label, Input, FormFeedback, FormGroup, Spinner, Button } from 'reactstrap';


class AdminMain extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            data: {},
            submissions: [],
            loading: true,
            currentYearSelected: new Date().getFullYear(),
            submissionsRef: firebaseApp.database().ref(`submissions/${new Date().getFullYear()}`),
            votersRef: firebaseApp.database().ref(`voters/${new Date().getFullYear()}`)
    
        }

        this.handleYearDisplay = this.handleYearDisplay.bind(this);
        this.retrieveDatabase();
      }

    retrieveDatabase(){
      
      console.log("Retrieve database called with state", this.state);

        var dataBuild = {};

        this.state.submissionsRef.on('value', (snapshot) => {
            let submissions = snapshot.val();
            var dataBuild = {};

            for (let submission in submissions){
                dataBuild[submission] = {
                    votes: [],
                    title: submissions[submission].title,
                    description: submissions[submission].description,
                    url: submissions[submission].url,
                    firstName: submissions[submission].firstName,
                    lastName: submissions[submission].lastName,
                    id: submission
                };

                this.state.votersRef.on('value', (snap) => {
                    let allVoters = snap.val();

                    for (let voter in allVoters){
                        var voterRef = firebaseApp.database().ref(`voters/${this.state.currentYearSelected}/${voter}/votes`);

                        voterRef.on('value', (snp) => {
                            let votes = snp.val();
                            if (submission in votes){ //If this submission has been voted by voter
                                const voteValue = votes[submission];
                                dataBuild[submission].votes.push(voteValue);
                            }
                            
                        });
                    }
                });
                this.setState({
                    data: dataBuild
                });
            }

            var submissionsArr = [];
            Object.keys(this.state.data).forEach(submission => {
                submissionsArr.push(this.state.data[submission])
            });   
            this.setState({
                submissions: submissionsArr
            }, () => {
              this.setState({loading: false});
              console.log("finished", this.state.submissions);
            });
        });

        
    }

    imgFormatter(cell, row) {
      return (
          <a href={row.url} target="_blank">
                          <img  src={row.url} width="auto" height="50"/>
                         </a>
      );
    }

    totalFormatter(cell, row){
      return(<div>{row.votes.length}</div>);
    }


    handleYearDisplay(event){
      event.preventDefault();
      const val = event.target.value;
      this.setState({
        currentYearSelected: val,
        submissionsRef: firebaseApp.database().ref(`submissions/${val}`),
        votersRef: firebaseApp.database().ref(`voters/${val}`)
      }, () => this.retrieveDatabase());
    }

    render(){
      // var allSubmissions = this.state.submissions;
      // allSubmissions = allSubmissions.map(row => {
      //   row.totalVotes = row.votes.length;
      //   return row;
      // });
      console.log("RENDER STATE: ", this.state);
      const columns = [{
        dataField: 'url',
        text: 'Image',
        formatter: this.imgFormatter
    },{
        dataField: 'title',
        text: 'Title',
        sort: true
      }, {
        dataField: 'description',
        text: 'Description',
        sort: true
      }, {
        dataField: 'firstName',
        text: 'First Name',
        sort: true
      }, {
        dataField: 'lastName',
        text: 'Last Name',
        sort: true
      },{
        dataField: 'votes',
        text: 'Total votes',
        sort: true,
        formatter: this.totalFormatter
      }, {
        dataField: '',
        text: 'Averate rating',
        sort: true
      },{
        dataField: '',
        text: 'Median rating',
        sort: true
      }];
      
      const defaultSorted = [{
        dataField: 'userVote',
        order: 'desc'
      }];

        if (this.state.loading){
          return (<Spinner color="primary"></Spinner>);
        }
        
        return (
          <div>
              <Button color="primary">Download spreadsheet</Button>
                <FormGroup >
                    <Label>Displaying year</Label>
                    <Input type="select" value={this.state.currentYearSelected} onChange={this.handleYearDisplay}>
                        <option>2020</option>
                        <option>2021</option>
                        <option>2022</option>
                    </Input>

                </FormGroup>
          <BootstrapTable
            bootstrap4
            hover
            keyField="id"
            data={ this.state.submissions }
            columns={ columns }
            defaultSorted={ defaultSorted } 
            headerClasses="header-class"

          />
          {/* <Button onClick={this.deleteAllSubmissions} color="danger">DELETE ALL SUBMISSIONS</Button> */}
          <button onClick={() => console.log(this.state)}>STATE</button>
        </div>
      );
    }

}
export default AdminMain;