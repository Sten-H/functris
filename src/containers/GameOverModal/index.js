import React from 'react';
import { Button, Modal } from 'react-bootstrap';
// import KeyHandler, { KEYUP } from 'react-key-handler';
// import { triggerKeyEvent } from '../../helpers';
import { HighScore } from '../../components/HighScore/index';
import { connect } from 'react-redux';
import { view } from 'ramda';
import { lens } from '../../game-logic/helpers';

// const triggerPauseKeyPress = () => triggerKeyEvent(KEYUP, undefined, 'p');
export class GameOverModal extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<Modal show={this.props.gameOver} className="game-over-modal">
					<Modal.Header closeButton>
						<h3 className="text-center">GAME OVER</h3>
					</Modal.Header>
					<Modal.Body>
						<p>I'm sure you did great x)</p>
						<Button className="btn-primary">Restart</Button>
						<HighScore />
					</Modal.Body>
				</Modal>
				{/*<KeyHandler keyValue='p' onKeyHandle={this.toggle} />*/}
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		gameOver: view(lens.flags.gameOver, state.tetris)
	}
};
function mapDispatchToProps(dispatch) {
	return {

	}
}
export default connect(mapStateToProps, mapDispatchToProps)(GameOverModal);