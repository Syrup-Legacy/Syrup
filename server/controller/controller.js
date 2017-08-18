const Sequelize = require('sequelize');
const express = require('express');
const Model = require('../../db/models/model');
const data = require('../../data');
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

module.exports = {
  addProfile: (req, res) => {
    Model.User.findOrCreate({
      where: {id: req.body.id}, defaults: {
        id: req.body.id,
        email: req.body.email,
        firstname: req.body.firstname,
        age: req.body.age,
        gender: req.body.gender,
        bio: req.body.bio,
        profilepic: req.body.profilepic,
        phone_number: req.body.phoneNumber,
        images: req.body.images
      }
    })
  .then(data => {
    console.log(data,'controller.js addProfile function');
    res.status(200).send(data)
  })
  .catch(err => {
    console.log(err)
    res.status(404).send(err)
  })
  },

  saveMessages: (req, res) => {
    Model.Message.create({
      text: req.body.text,
      userId: req.params.userId,
      recipientId: req.params.recipientId
    })
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => {
      res.status(404).send(err)
    })
  },
  
  getMessages: (req, res) => {
    Model.Message.findAll({
      where: {
        userId: req.params.userId, 
        recipientId: req.params.recipientId
      }
    })
    .then(data=> {
      res.status(200).send(data)
    })
    .catch(err => {
      res.status(404).send(err)
    })
  },

  getProfile: (req, res) => {
    Model.User.findById(req.params.id)
    .then(response => {
      console.log(response);
      console.log('getProfile on controller.js')
      res.send(response);
      //res.redirect(`/profile/${req.params.id}`);
    })
    .catch(err => { if (err) {console.error(err) } })
  },

  renderClickedProfile: (req, res) => {
    res.redirect(`/#/profile/${req.params.id}`);
    console.log('ThIus is the id: ', req.params.id);
  },

  connectMatch: (req, res) => {
    console.log('CONNECT MATCH REQ!!!! ', req.params);
    Model.Match.create({
      userId: req.params.subject_id,
      matcheeId: req.params.id,
    })
    .then(data => {
      Model.User.findAll({
        where: {
          // id: req.params.id,
          // $or: [
          //   {id: req.params.subject_id },
          // ]
          id: {
            $or: [req.params.subject_id, req.params.id]
          }
        }
      })
      .then(matchedPersons => {
        
        for (var i = 0; i < matchedPersons.length; i++) {
          var otherPerson = i === 0 ? 1 : 0;
          console.log('otherPerson: ', otherPerson);
          client.messages.create({
            to: matchedPersons[i].phone_number,
            from: process.env.TWILIO_NUM,
            body: `you have a match with ${matchedPersons[otherPerson].firstname}!`
          }, function(err, message) {
            if (err) {
              console.log(`error in twilio send ${err}`);
            } else {
              console.log(message.sid);
            }
          })
        }
      })
      .catch(err => {
        console.log('error in finding id for twilio', err);
      })
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(404).send(err)
      console.log('THIS IS THE ERR:' , err);
    })
  },

  verifyMatch: (req, res) => {
    Model.Match.findAll({
      where: {
        userId: req.params.subject_id,
        matcheeId: req.params.id
      }
    })
    .then(response => {
      if (response.length) {
        res.send('true')
      } else {
        res.send('false')
      }
    })
    .catch(err => {
      res.status(404).send(err)
    })
  },

  getMatches: (req, res) => {
    console.log('Trying to retrieve matches');
    Model.Match.findAll({
      where: { userId: req.params.userId },
      // include:[{
      //   model: Model.User, as: 'matchee',
      //   // attributes: ['firstname']
      // }]
    })
      .then(match => {
        res.status(202).send(match);
        console.log('Trying to retrieve matches');
      })
      .catch(err => {
        res.status(404).send(err);
        console.log('Trying to retrieve matches');
      })
  },
  uploadUserPhotos: (req, res) => {
    res.send('OK');
  },

  updateProfile: (req, res) => {
    console.log('in the updateProfile', req.body);
    console.log('updateProfile');
    Model.User.update({
      firstname: req.body.firstname,
      age: req.body.age,
      gender: req.body.gender,
      bio: req.body.bio,
      profilepic: req.body.profilepic,
      phone_number: req.body.phoneNumber,
      images: req.body.images
    }, {where: {id: req.params.id}, returning: true})
      .then(update => {
        res.status(202).send(update);
      })
      .catch(err => {
        res.status(404).send(err);
      })
  },
  retrieveFirstName: (req, res) => {
    Model.User.findAll({where: {id: req.params.userId}})
      .then(result => {
        res.status(202).send(result)
      })
      .catch(err => {
        res.status(404).send(err)
      })
  }
}
