import React, { Component } from 'react';
import axios from 'axios';
import request from 'superagent';
import appId from '../../apiKey';
import apiKey from '../../apiKey';
import NavBar from './NavBar';
import {Link} from 'react-router-dom';

const CLOUDINARY_UPLOAD_PRESET = 'ihihark8';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dmj5ovhxa/image/upload';


class editProfile extends Component {
  constructor(props){
    super(props);

    this.state={
      subject_id: localStorage.idTokenPayload,
      firstname: '',
      profilepic: '',
      images: [],
      bio: '',
      gender: '',
      age: '',
      phoneNumber: '',
      uploadedProfileCloudinaryUrl: '',
      uploadedFileCloudinaryUrl: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleOnUpdate = this.handleOnUpdate.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
    this.onProfileImageDrop = this.onProfileImageDrop.bind(this);
  }

  componentDidMount() {
    this.dropzone1 = new Dropzone("div#my-dropzone1", { url: "/api/photos"});
    this.dropzone1.on('addedfile', file => {
      this.onProfileImageDrop([file]);
    })
    this.dropzone2 = new Dropzone("div#my-dropzone2", { url: "/api/photos"});
    this.dropzone2.on('addedfile', file => {
      this.onImageDrop([file]);
    })
  }

  onProfileImageDrop(files) {
    this.handleProfileImageUpload(files[0]);
  }

  handleProfileImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedProfileCloudinaryUrl: response.body.secure_url,
          profilepic: response.body.secure_url
        });
      }
    });
  }

  onImageDrop(files) {
    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        var images = this.state.images;
        images.push(response.body.secure_url);

        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url,
          images: images
        });
      }
    });
  }

  handleOnChange(event) {
    console.log('temp')
    let temp = event.target.name;
    this.setState({
      [temp]: event.target.value
    })
  }
  handlePhoneChange(event) {
    console.log(event.target.name, '1'+event.target.value);
    this.setState({
      phoneNumber: '+1'+event.target.value
    })
  }

  handleOnUpdate() {
    console.log(this.state);
    const body = {
      "image": this.state.profilepic,
      "subject_id": this.state.subject_id,
      "gallery_name": "SyrupPractice"
    };
    const api = {
      "app_key": apiKey.apiKey,
      "app_id": appId.appId
    };

    console.log('body is', body);

    axios.all([
      axios.put(`/api/updateProfile/${localStorage.idTokenPayload}`, this.state),
      axios.post('https://api.kairos.com/enroll', body, {headers: api})
    ])
    .then(axios.spread((profile, match) => {
      console.log('')
      this.setState({
        firstname: '',
        profilepic: '',
        images: [],
        bio: '',
        gender: '',
        age: '',
        phoneNumber:'',
        uploadedProfileCloudinaryUrl: '',
        uploadedFileCloudinaryUrl: ''
      })
    }))
    .catch(err => {
      return console.error(err)
    });
  }

  render() {
    return (
      <div className="container bootstrap snippets edit-profile">
        <NavBar />
        <div className="row">
          <div className="col-xs-12 col-sm-9">
            <div className="form-horizontal">
              <div className="panel panel-default">
                <div className="panel-heading">
                <h4 className="panel-title">User info</h4>
                </div>
                <div className="panel-body">
                  <div className="form-group">
                    <label className="col-sm-2 control-label">First name</label>
                    <div className="col-sm-10">
                      <input name="firstname" onChange={this.handleOnChange} type="text" className="form-control"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Gender</label>
                    <div className="col-sm-10">
                      <select name="gender" onChange={this.handleOnChange} className="form-control">
                        <option>Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Age</label>
                    <div className="col-sm-10">
                      <input name="age" onChange={this.handleOnChange} type="text" className="form-control"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Phone #(optional)</label>
                    <div className="col-sm-10">
                      <input name="phoneNumber" onChange={this.handlePhoneChange} type="text" className="form-control"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Bio</label>
                    <div className="col-sm-10">
                      <textarea name="bio" onChange={this.handleOnChange} rows="3" className="form-control"></textarea>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Profile picture</label>
                    <div className="col-sm-10">
                      <div className="dropzone" id="my-dropzone1">
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Additional pictures</label>
                    <div className="col-sm-10">
                      <div className="dropzone" id="my-dropzone2">
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-10 col-sm-offset-2">
                      <Link to ='profile'><button type="submit" onClick={this.handleOnUpdate} className="btn btn-primary">Submit</button></Link>
                      <button type="reset" className="btn btn-default">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default editProfile;
