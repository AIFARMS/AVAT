import React from 'react';
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('Video.js Ready', this)
      //console.log(this.player.tech().vhs.playlists.media().attributes)
    });
  }
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }


  
  render() {
    return (
      <div> 
        <div data-vjs-player>
          <video ref={ node => this.videoNode = node } className="video-js" data-setup='{"fluid": true}'></video>
        </div>
      </div>
    )
  }
}