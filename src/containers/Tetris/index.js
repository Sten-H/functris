import React from 'react';
import { connect } from 'react-redux';
import { map, addIndex } from 'ramda';
import './Tetris.css';
import { shiftLeft } from "../../actions/actions";

const drawRow = (row, i) => <p key={i} className="tetris-row">{row}</p>;
const drawBoard = addIndex(map)(drawRow);

class Tetris extends React.Component {
    handleKeyPress = (event) => {
        const {board, piece} = this.props;
        switch(event.key) {
            case 'Enter':
                console.log('enter press');
                return;
            case 'ArrowLeft':
                this.props.onLeftPress({board, piece});
                return;
            case 'ArrowRight':
                return;
            case 'ArrowDown':
                console.log('Down arrow press');
                return;
            case 'z':
                console.log('z key press');
                return;
            case 'x':
                console.log('x key press');
                return;
            default:
                return;
        }
    };
    componentDidMount(){
        document.addEventListener("keydown", this.handleKeyPress, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }
    render() {
        return (
        <div className="tetris-game">
            {drawBoard(this.props.board)}
        </div>
        );
    };
}
const mapStateToProps = (state) => {
    return {
        board: state.tetris.board,
        position: state.tetris.position,
        piece: state.tetris.piece
    };
};

export function mapDispatchToProps(dispatch) {
    return {
        onLeftPress: ({piece, board}) => dispatch(shiftLeft({board, piece}))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tetris);
