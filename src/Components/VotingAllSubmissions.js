import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import firebaseApp from '../firebaseConfig';

class VotingAllSubmissions extends React.Component{

    constructor(props){
        super(props);
        this.currentUser = this.props.user;
        this.state = {
            submissions: []
        }
        
    }

    componentDidMount(){
        const submissionsRef = firebaseApp.database().ref(`submissions/${this.props.year}`);
        const voterRef = firebaseApp.database().ref(`voters/${this.props.year}/${this.currentUser.uid}/votes`);
        
        var dataArr = [];
        submissionsRef.on('value', (snapshot) => {
            let submissions = snapshot.val();
            voterRef.on('value', (snap) =>{
                let votesObj = snap.val();
                if (votesObj == null){
                    votesObj = {};
                }
                for (let submission in submissions){
                    var dataObj = {
                        id: submission,
                        title: submissions[submission].title,
                        description: submissions[submission].description,
                        url: submissions[submission].url,
                        userVote: votesObj[submission]
                    }
                    dataArr.push(dataObj);
                }
            });
        });
        this.setState({submissions: dataArr});

    }

    imgFormatter(cell, row) {
        return (
            <a href={row.url} target="_blank">
                            <img  src={row.url} width="auto" height="50"/>
                           </a>
        );
      }

    render(){
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
            dataField: 'userVote',
            text: 'Your vote',
            sort: true
          }];
          
          const defaultSorted = [{
            dataField: 'userVote',
            order: 'desc'
          }];

        return(
            <BootstrapTable
                bootstrap4
                hover
                keyField="id"
                data={ this.state.submissions }
                columns={ columns }
                defaultSorted={ defaultSorted } 
                headerClasses="header-class"

            />
        
        );
    }

}
export default VotingAllSubmissions;