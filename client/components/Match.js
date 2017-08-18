import React from 'react';
import axios from 'axios';
import history from '../history';
import { Redirect } from 'react-router-dom';
export default class Match extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id: 0,
			firstname: '',
			age: 25,
			profilepic: '',
			own_id: localStorage.idTokenPayload,
			matched: false
		}
		this.addMatch = this.addMatch.bind(this);
		this.isMatched = this.isMatched.bind(this);
	}

	componentDidMount(){
		axios.all([
      axios.get(`api/matches/percent/${this.props.match.subject_id}`),
      axios.get(`api/match/${this.state.id}/${this.state.own_id}`)
    ])
    .then(axios.spread((res, match) => {
      this.setState({
				id: res.data.id,
				firstname: res.data.firstname,
				age: res.data.age,
				profilepic: res.data.profilepic,
				matched: match.data
			})
    }))
    .catch(err => { 
      return console.error(err) 
    });
	}

	isMatched() {
		if (this.state.matched) {
			return <button className="btn-primary">Connected!</button>
		} else {
			return <button className="btn-primary" onClick={this.addMatch}>Connect</button>
		}
	}

	addMatch() {
		axios.post(`api/match/${this.state.id}/${this.state.own_id}`)
		.then(response => {
			console.log('Connection added');
			this.setState({
				matched: true
			})
		})
		.catch(err => console.error(err))
	}

	render(){
		console.log('This is the props in Match: ', this.props);
		return (
			<div className="col-sm-4 text-center match" onClick={this.renderProfile}>
				<h2>{this.state.firstname}, {this.state.age}</h2>
				<a href={`/${this.state.id}`}><img src={this.state.profilepic} className="match-pic"/></a>
				<h3>{Math.round(100 * this.props.match.confidence + 10)}% Match</h3>
				{/* <button className="btn-primary">Connect</button> */}
				{this.isMatched()}
			</div>
		);
	}
}