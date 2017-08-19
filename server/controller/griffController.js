const db = require('../../db/models/model');

module.exports = {
	getMatchesByPercent: (req, res) => {
		console.log('this is the req.params.subject_id ',req.params.subject_id);
		db.User.findOne({
			where: {
				id: req.params.subject_id
			}
		})
			.then(data => {
				res.status(200).send(data);
				console.log(data);
				console.log('Successfully fetched data');
			})
			.catch(err => {
				res.status(500).send(err);
				console.log('Error fetching data ', err);
			})
	},
	getAllUsers : (req, res) => {
		db.User.findAll({})
			.then(result => {
				res.status(200).send(result)
			})
			.catch(err => {
				res.status(404).send(err)
			})
	},
	updateCoordinates : (req, res) => {
		db.User.Update({
			latitude : -117.9854168,
			longitutde: 33.9246179
		}, {
			where: { id : id}
		})
		 .then(result => {
			 res.status(200).send(result)
		 })
	}
}
