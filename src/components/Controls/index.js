import * as React from 'react';
import { init, last } from 'ramda';

import './Controls.css';

const KeyPair = (props) => (
	<ul className="key-pair">
		<li>
			{init(props.children)}
		</li>
		<li>
			{last(props.children)}
		</li>
</ul>
);
export const Controls = () => (
	<ul className=" control-list">
		<KeyPair>
			<span className="key key-space" />
			<span className="key-info">Drop Piece</span>
		</KeyPair>
		<KeyPair>
			<span className="key key-left" />
			<span className="key key-right" />
			<span className="key-info">Left/Right</span>
		</KeyPair>
		<KeyPair>
			<span className="key key-up" />
			<span className="key-info">Rotate Piece</span>
		</KeyPair>
		<KeyPair>
			<span className="key key-down" />
			<span className="key-info">Down</span>
		</KeyPair>
		<KeyPair>
			<span className="key key-p" />
			<span className="key-info">Pause/Unpause</span>
		</KeyPair>
		<KeyPair>
			<span className="key key-r" />
			<span className="key-info">Restart</span>
		</KeyPair>
	</ul>
);
