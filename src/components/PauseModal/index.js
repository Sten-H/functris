import React from 'react';
import { Modal } from 'react-bootstrap';
import KeyHandler, { KEYUP } from 'react-key-handler';
import { triggerKeyEvent } from '../../helpers';
import './PauseModal.css'
const triggerPauseKeyPress = () => triggerKeyEvent(KEYUP, undefined, 'p');
export class PauseModal extends React.Component {
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
				<Modal show={this.state.modal} onHide={triggerPauseKeyPress} className="pause-modal">
					<Modal.Header closeButton>
						<h3 className="text-center">PAUSED</h3>
					</Modal.Header>
					<Modal.Body>
						Press 'P', 'Esc' or click on game to unpause
					</Modal.Body>
				</Modal>
				<KeyHandler keyValue='p' onKeyHandle={this.toggle} />
			</div>
		);
	}
}

export default PauseModal;