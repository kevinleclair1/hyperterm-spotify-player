export default class Player extends React.Component {
			constructor (props, context){
				super(props, context)
				console.log(this.props)

			}

			render () {
	      return (
	      	<p onClick={() => this.props.handleClick()}>Sup</p>
	      )
	    }
}