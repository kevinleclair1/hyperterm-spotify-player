import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import isEqual from 'lodash.isequal'

class ReactMusicPlayer extends Component {
    state = {}

    componentWillMount = () => {
        this.interval = setInterval(() => {
            this.checkSpotifyState()
        }, 500)
    }

    shouldComponentUpdate(nextProps, nextState){
        return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
    }

    checkSpotifyState(){
        let {spotifyControls} = this.props
        let callback = this.checkSpotifyState

        spotifyControls.isRunningAsync().then(run => {
            if (run){
                Promise.all([spotifyControls.getTrackAsync(), spotifyControls.getStateAsync()]).then(values => {
                    let track = values[0]
                    let state = values[1]
                    this.setState({
                        artist: track.artist,
                        songName: track.name,
                        songLength: track.duration / 1000,
                        album: track.album,
                        position: state.position,
                        isPlaying: state.state === 'playing' ? true : false,
                        spotifyRunning: true
                    })
                })
            }
            else {
                this.setState({
                    spotifyRunning: false
                })
            }
        })
    }

    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    setProgress = (e) => {
        let {spotifyControls} = this.props
        let progressContainer = e.currentTarget

        let containerStart = progressContainer.getBoundingClientRect().left
        let percent = (e.clientX - containerStart) / progressContainer.clientWidth
        let currentTime = this.state.songLength * percent

        spotifyControls.jumpToAsync(currentTime).then(() => this.checkSpotifyState())
    }

    play = () => {
        let {spotifyControls} = this.props

        spotifyControls.playAsync().then(() => {
            this.setState({ isPlaying: true });
        })
    }

    pause = () => {
        let {spotifyControls} = this.props

        spotifyControls.pauseAsync().then(() => {
            this.setState({ isPlaying: false });
        })
    }

    toggle = () => {
        this.state.isPlaying ? this.pause() : this.play();
    }

    next = () => {
        let {spotifyControls} = this.props

        spotifyControls.nextAsync()
        .then(() => this.checkSpotifyState())
    }

    previous = () => {
        let {spotifyControls} = this.props

        spotifyControls.nextAsync()
        .then(() => this.checkSpotifyState())
    }

    repeat = () => {
        let {spotifyControls} = this.props

        spotifyControls.toggleRepeatingAsync().then(() => {
            this.setState({ repeat: !this.state.repeat });
        })
    }

    randomize = () => {
        let {spotifyControls} = this.props

        spotifyControls.toggleShufflingAsync().then(() => {
            this.setState({ repeat: !this.state.random });
        })
    }

    toggleMute = () => {
        let mute = this.state.mute;
        let {spotifyControls} = this.props
        let callback = () => this.setState({ mute: !this.state.mute });

        if (mute){
            spotifyControls.unmuteVolumeAsync().then(callback)
        }
        else {
            spotifyControls.muteVolumeAsync().then(callback)
        }
    }

    render () {
        const { isPlaying, artist, songName, position, songLength } = this.state;

        let playPauseClass = classnames('fa', {'fa-pause': isPlaying}, {'fa-play': !isPlaying});
        let volumeClass = classnames('fa', {'fa-volume-up': !this.state.mute}, {'fa-volume-off': this.state.mute});
        let repeatClass = classnames('player-btn small repeat', {'active': this.state.repeat});
        let randomClass = classnames('player-btn small random', {'active': this.state.random });

        return (
            <div className="player-container">

                <div className="player-buttons player-controls">
                    <div onClick={this.previous} className="player-btn medium" title="Previous Song">
                        <i className="fa fa-backward" />
                    </div>

                    <div onClick={this.toggle} className="player-btn big" title="Play/Pause">
                        <i className={playPauseClass} />
                    </div>

                    <div onClick={this.next} className="player-btn medium" title="Next Song">
                        <i className="fa fa-forward" />
                    </div>
                </div>

                <div className="player-progress-container" onClick={this.setProgress}>
                    <div className="player-progress-value" style={{width: `${(position / songLength) * 100}%`}}></div>
                </div>

                <div className="artist-info">
                    <p className="artist-name">{`${songName} by: ${artist}`}</p>
                </div>

                <div className="player-buttons">
                    <div className="player-btn small volume" onClick={this.toggleMute} title="Mute/Unmute">
                        <i className={volumeClass} />
                    </div>

                    <div className={repeatClass} onClick={this.repeat} title="Repeat">
                        <i className="fa fa-repeat" />
                    </div>

                    <div className={randomClass} onClick={this.randomize} title="Shuffle">
                        <i className="fa fa-random" />
                    </div>
                </div>

            </div>
        );
    }
}

ReactMusicPlayer.propTypes = {
    autoplay: PropTypes.bool,
    spotifyControls: PropTypes.object.isRequired
};

export default ReactMusicPlayer;
