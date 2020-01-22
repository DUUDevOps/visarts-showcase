import React from 'react';

class SubmissionSuccess extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <h3>Thank you for your submission, {this.props.name}!</h3>
        );
    }
}
export default SubmissionSuccess;