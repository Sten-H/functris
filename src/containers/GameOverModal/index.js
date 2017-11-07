import React from 'react';
import { Button, Modal } from 'react-bootstrap';
// import KeyHandler, { KEYUP } from 'react-key-handler';
// import { triggerKeyEvent } from '../../helpers';
import { HighScore } from '../../components/HighScore/index';
import { connect } from 'react-redux';
import { view } from 'ramda';
import { lens } from '../../game-logic/helpers';
import * as actions from '../../actions/actions';

// const triggerPauseKeyPress = () => triggerKeyEvent(KEYUP, undefined, 'p');
export class GameOverModal extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<Modal show={this.props.gameOver} className="game-over-modal">
					<Modal.Header>
						<h3 className="text-center">GAME OVER</h3>
					</Modal.Header>
					<Modal.Body>
						<h4>SCORE: XXXXX</h4>
						<p>Press new game button or press 'R' to play again</p>
						<Button className="btn-primary" onClick={this.props.onRestartPress}>New game</Button>
						<HighScore />
					</Modal.Body>
				</Modal>
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
		onRestartPress: () => dispatch(actions.restartGame()),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(GameOverModal);