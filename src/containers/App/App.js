import * as React from 'react';
import { connect } from 'react-redux';
import { increment, decrement } from "../../actions/actions"
import Tetris from '../Tetris';
import { Bag } from '../Bag';
import './App.css';
import { Col, ListGroup, ListGroupItem, Row, Table } from "react-bootstrap";

export const App = () => {
    return (
      <div className="App">
          <Row>
              <Col sm={12}>
                  <h2>TETRIS</h2>
                  <hr />
              </Col>
              <Col className="dotted-border hs-info" sm={4} xsHidden>
                  <Col className="float-right"xs={12}>
                      <h4>High Score</h4>
                      <Table className="hs-table" condensed hover>
                          <thead>
                          <tr>
                              <th className="text-muted">#</th>
                              <th className="text-muted">NAME</th>
                              <th className="text-muted">SCORE</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                              <td>1</td>
                              <td>M4RK</td>
                              <td>120000</td>
                          </tr>
                          <tr>
                              <td>2</td>
                              <td>J4C0B</td>
                              <td>115000</td>
                          </tr>
                          <tr>
                              <td>2</td>
                              <td>J4C0B</td>
                              <td>115000</td>
                          </tr>
                          </tbody>
                      </Table>
                  </Col>
              </Col>
              <Col xs={12} sm={4}>
                  <Tetris />
              </Col>
              <Col className="info-view dotted-border text-left" sm={4} xsHidden>
                  <Bag />
                  <h4>Score</h4>
                  <p>100</p>
                  <h4>Lines</h4>
                  <p>23</p>
              </Col>
          </Row>
      </div>
    );
};
const mapStateToProps = (state) => {
    return {
    };
};

export function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
