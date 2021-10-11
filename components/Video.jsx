import React from "react";
import YouTube from "react-youtube";

export default class Video extends React.Component {
  constructor(props) {
    super(props);
    // Create ref
    this.videoRef = React.createRef();
  }

  render() {
    return (
      <div>
        <YouTube
          ref={this.videoRef}
          videoId={this.props.videoId}
          className={this.props.className}
        />
        <div style={{ position: "absolute", bottom: -24 }}>
          <button
            onClick={() => this.videoRef.current.internalPlayer.playVideo()}
          >
            Play Video
          </button>

          <button
            onClick={() => this.videoRef.current.internalPlayer.pauseVideo()}
          >
            Pause Video
          </button>
        </div>
      </div>
    );
  }
}
