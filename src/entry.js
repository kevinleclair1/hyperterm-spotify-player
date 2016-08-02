import Player from './components/player.js'
import Bluebird from 'bluebird'
import ReactMusicPlayer from './components/ReactMusicPlayer.js'

var spotify = Bluebird.promisifyAll(require('spotify-node-applescript'))

exports.decorateHyperTerm = (Term, {React, notify}) => {
	return class extends React.Component {
		constructor (props, context){
			super(props, context)
		}

		render () {
      return <Term {...this.props} customChildren={<ReactMusicPlayer spotifyControls={spotify}/>}/>
    }
	}
}

exports.decorateConfig = config => {
	return Object.assign({}, config, {
		css: `
	    ${config.css || ''}

	    ${require('font-awesome/css/font-awesome.css')}

	    ${require('./styles.css')}
	  `
	})
}
