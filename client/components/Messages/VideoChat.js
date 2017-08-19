import React from 'react';
import {render} from 'react-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import $ from 'jquery';

class VideoChat extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.socket = io('/')

    $("#send").click(function() {
      $("pre").animate({ scrollTop: $("pre").height() + 500 }, "slow");
    });
    $(document).keypress(function(e) {
      if(e.which == 13) {
        $("pre").animate({ scrollTop: $("pre").height() + 500 }, "slow");
      }
    });
    // '/' will trigger the .on('connection') event on the server side, connects everytime the component mounts

    navigator.webkitGetUserMedia({video: true, audio: true}, (stream) => {
      const Peer = require('simple-peer')

      let peer = new Peer({
          initiator: location.hash === '#init',
          trickle: false,
          stream:stream
      })

      peer.on('signal', (data) => {
          document.getElementById('yourId').value = JSON.stringify(data)
          setTimeout(this.socket.emit('agreeVideoChat', localStorage.toUser, JSON.stringify(data)), 1000)
      })

      document.getElementById('connect').addEventListener('click', () => {
          let otherId = localStorage.initId;
          peer.signal(otherId)
      })

      document.getElementById('send').addEventListener('click', () => {
          let yourMessage = document.getElementById('yourMessage').value
          document.getElementById('messages').textContent += 'Me : ' + yourMessage + '\n'
          peer.send(yourMessage)
      })


      peer.on('data', (data) => {
          document.getElementById('messages').textContent += localStorage.toUser + ' : ' + data + '\n'
      })

      peer.on('stream', (stream) => {
          let video = document.createElement('video')
          document.body.appendChild(video)

          video.src = window.URL.createObjectURL(stream)
          video.play()
      })
    }, (err) => {
        console.error(err)
    })

  }


  render() {

    return (
      <div className="videoChatBoxContainer">
        <div className="videoChatHide">
          <div>Your ID:</div>
          <textarea id="yourId"></textarea>
          <div>Other ID:</div>
          <textarea id="otherId"></textarea>
        </div>

        <div className="videoChatBox">
          <button id="connect">Connect Here!</button>
          <div>Enter Message:</div>
          <textarea id="yourMessage"></textarea>
          <button id="send">send</button>
          <pre id="messages"></pre>
        </div>
      </div>
    );
  }
};
export default VideoChat;
