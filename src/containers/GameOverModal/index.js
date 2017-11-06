import React from 'react';
import { Modal } from 'react-bootstrap';
// import KeyHandler, { KEYUP } from 'react-key-handler';
// import { triggerKeyEvent } from '../../helpers';
import { HighScore } from '../../components/HighScore/index';

// const triggerPauseKeyPress = () => triggerKeyEvent(KEYUP, undefined, 'p');
export class GameOverModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false
		};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	render() {
		return (
			<div>
				<Modal show={this.state.modal} onHide={this.toggle} className="game-over-modal">
					<Modal.Header closeButton>
						<h3 className="text-center">GAME OVER</h3>
					</Modal.Header>
					<Modal.Body>
						I'm sure you did great x)
						<HighScore />
					</Modal.Body>
				</Modal>
				{/*<KeyHandler keyValue='p' onKeyHandle={this.toggle} />*/}
			</div>
		);
	}
}

export default GameOverModal;