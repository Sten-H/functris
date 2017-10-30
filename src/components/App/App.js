import * as React from 'react';
import Bag from '../../containers/Bag/index';
import { Col, Row } from "react-bootstrap";
import { HighScore } from "../HighScore/index";
import Tetris from '../../containers/Tetris/index';
import './App.css';

// Boxes to the sides of tetris games
export const InfoBoxOuter = (props) => (
    <Col className="info-box-wrapper" smOffset={1} sm={3} mdOffset={0} md={4} xsHidden>
        {props.children}
    </Col>
);
export const App = () => {
    return (
      <Row className="App">
              <Col sm={12}>
                  <h2>TETRIS</h2>
                  <hr />
              </Col>
              <InfoBoxOuter >
                  <Col className="hs-info-inner dotted-border" sm={12} mdOffset={2} md={10} lgOffset={2} lg={10}>
                      <HighScore />
                  </Col>
              </InfoBoxOuter>
              <Col xs={12} sm={4}>
                  <Tetris />
              </Col>
              <InfoBoxOuter>
                  <Col className="info-view-inner dotted-border text-left" sm={12} md={6}>
                      <Bag />
                      <h4>Score</h4>
                      <p>100</p>
                      <h4>Lines</h4>
                      <p>23</p>
                  </Col>
              </InfoBoxOuter>
      </Row>
    );
};