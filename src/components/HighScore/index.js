import * as React from 'react';
import { Table } from 'react-bootstrap';
import { addIndex, inc, map } from 'ramda';
import './HighScore.css';
// This data will probably be sorted when fetched from db?
const mockData = [
	{ name: 'M4RK', score: 120000 },
	{ name: 'J4C0B', score: 115000 },
	{ name: 'GRS', score: 105000 }
];
// (dataItem, i) -> JSXElement
const getTableRow = ({name, score}, idx) => (
	<tr key={idx}>
		<td>{inc(idx)}</td>
		<td>{name}</td>
		<td>{score}</td>
	</tr>
);
// data -> [JSX.Element]
const getAllRows = addIndex(map)(getTableRow);

export const HighScore = () => {
	return(
		<div>
			<h4>High Score</h4>
			<Table className="hs-table" condensed hover>
				<thead>
				<tr>
					<th>#</th>
					<th>NAME</th>
					<th>SCORE</th>
				</tr>
				</thead>
				<tbody>
				{ getAllRows(mockData) }
				</tbody>
			</Table>
		</div>
	);
};