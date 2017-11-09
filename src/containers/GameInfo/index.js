import * as React from 'react';
import { Col } from 'react-bootstrap';
import { connect } from 'react-redux';

export const GameInfo = ({info}, blah) => (
	<div>
		<hr className='line-top-margin'/>
		<h4>Score</h4>
		<p className='info-text'>{info.score}</p>
		<hr />
		<h4>Lines</h4>
		<p className='info-text'>{info.lines}</p>
		<hr />
		<h4>Level</h4>
		<p className='info-text'>{info.level}</p>
	</div>
);


const mapStateToProps = (state) => {
	return {
		info: state.tetris.info
	};
};

export default connect(mapStateToProps)(GameInfo);
