import * as React from 'react';
import Bag from '../../containers/Bag/index';
import { Col, Row } from 'react-bootstrap';
import { PauseModal } from '../PauseModal';
import Tetris from '../../containers/Tetris/index';
import GameOverModal from '../../containers/GameOverModal/index';
import { Controls } from '../Controls';
import GameInfo from '../../containers/GameInfo/index';

import './App.css';
// Boxes to the sides of tetris games
const InfoBoxOuter = (props) => (
	<Col className='info-box-wrapper' smOffset={1} sm={3} mdOffset={0} md={4} xsHidden>
		{props.children}
	</Col>
);
export const App = () => {
	return (
		<Row className="App">
			<Col sm={12} xsHidden>
				<h2>TETRIS</h2>
				<hr />
			</Col>
			<InfoBoxOuter >
				<Col sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}>
					<Controls />
				</Col>
			</InfoBoxOuter>
			<Col xs={12} sm={4}>
				<PauseModal />
				<GameOverModal />
				<Tetris />
			</Col>
			<InfoBoxOuter>
				<Col className='game-info solid-border text-left' sm={12} md={6}>
					<Bag />
					<GameInfo />
				</Col>
			</InfoBoxOuter>
		</Row>
	);
};