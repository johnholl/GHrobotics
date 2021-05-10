import React, {useState} from 'react';
import {Row, Col, InputNumber, Button, Input} from 'antd';
import './App.css';
// import Plot from 'react-plotly.js';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {generatePath, calculateOffsetPaths} from './utils';
import 'antd/dist/antd.css';


const Plot = createPlotlyComponent(Plotly);

function App() {
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [xLeft, setLeftX] = useState([]);
  const [yLeft, setLeftY] = useState([]);
  const [xRight, setRightX] = useState([]);
  const [yRight, setRightY] = useState([]);

  const [inputs, setInputs] = useState([{t:0, x:0, y:0, xp:0, yp:1, dt:0.1}, {t:1, x:1, y:1, xp:0, yp:1, dt:0.1}])
  const [diam, setDiam] = useState(0.1);

  const onChange = (label, val, idx) => {
    var newinputs = JSON.parse(JSON.stringify(inputs));
    var newdata = {...inputs[idx], [label]: val}
    newinputs[idx] = newdata;
    setInputs(newinputs)
  }

  const calculate = () => {
    var xway = inputs.map(a=>{return(a.x)})
    var yway = inputs.map(a=>{return(a.y)})
    var xpway = inputs.map(a=>{return(a.xp)})
    var ypway = inputs.map(a=>{return(a.yp)})
    var tway = inputs.map(a=>{return(a.t)})
    var dtway = inputs.map(a=>{return(a.dt)})
    console.log(xway, yway, xpway, ypway, tway, dtway);
    const {xpath, ypath} = generatePath(xway, yway, xpway, ypway, tway, dtway);
    const {xLpath, yLpath, xRpath, yRpath} = calculateOffsetPaths(xpath, ypath, diam);
  
    setX(xpath);
    setY(ypath);
    setLeftX(xLpath);
    setLeftY(yLpath);
    setRightX(xRpath);
    setRightY(yRpath);

  }

  const addPoint = () => {
    var newinputs = JSON.parse(JSON.stringify(inputs));
    var newdata = inputs[inputs.length-1];
    newinputs.push(newdata);
    setInputs(newinputs);
  }

  const removePoint = (i) => {
    var newinputs = JSON.parse(JSON.stringify(inputs));
    newinputs.pop()
    setInputs(newinputs);
  }

  return (
    <div>
      <Row style={{padding:20}} gutter={[16,16]}>
      <Col span={12}>
      <Row justify="start" style={{paddingLeft:30}}>diameter</Row>
      <Row justify="start" style={{paddingLeft:30, paddingBottom:20}}><InputNumber stringmode label={"d"} min={0} max={10} defaultValue={diam} placeholder={"diam"} onChange={(val) => {setDiam(val)}} /></Row>
        {inputs.map((value, i) => {
          return(
            <Row style={{padding:20}} align="middle" justify="space-around" key={i}>
            <Col span={2}>
              <Row>t</Row>
              <Row><InputNumber stringmode label={"t"} min={0} max={100} defaultValue={inputs[i].t} placeholder={"t"} onChange={(val) => {onChange("t", val, i)}} /></Row>
            </Col>
            <Col span={2}>
              <Row>x</Row>
              <Row><InputNumber label={"x"} min={-10} max={10} defaultValue={inputs[i].x} placeholder={"x"} onChange={(val) => {onChange("x", val, i)}} /></Row>
            </Col>
            <Col span={2}>
              <Row>y</Row>
              <Row><InputNumber label={"y"} min={-10} max={10} defaultValue={inputs[i].y} placeholder={"y"} onChange={(val) => {onChange("y", val, i)}} /></Row>
            </Col>
            <Col span={2}>
              <Row>x vel</Row>
              <Row><InputNumber label={"xp"} min={-10} max={10} defaultValue={inputs[i].xp} placeholder={"x vel"} onChange={(val) => {onChange("xp", val, i)}} /></Row>
            </Col>
            <Col span={2}>
              <Row>y vel</Row>
              <Row><InputNumber label={"yp"} min={-10} max={10} defaultValue={inputs[i].yp} placeholder={"y vel"} onChange={(val) => {onChange("yp", val, i)}} /></Row>
            </Col>
            <Col span={2}>
              <Row>dt</Row>
              <Row><InputNumber label={"dt"} min={0} max={10} defaultValue={inputs[i].dt} placeholder={"dt"} onChange={(val) => {onChange("dt", val, i)}} /></Row>
            </Col>
            <Col span={2}>
              <Row><Button onClick={removePoint}>Remove</Button></Row>
            </Col> 
          </Row>
          );
        })}
        <Row justify="space-around">
        <Button type="primary" onClick={addPoint}>Add Point</Button>
        <Button type="primary" style={{backgroundColor:"green", borderColor:"green"}} onClick={calculate}>Calculate Path</Button>
        </Row>
        </Col>
        <Col span={12}>
        <Plot 
        data={[
          {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'red'},
          },
          {
            x: xLeft,
            y: yLeft,
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'blue'},
          },
          {
            x: xRight,
            y: yRight,
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'green'},
          },
           ]}
        layout={ {width: 500, height: 500, title: 'Robot path', xaxis: {range: [-10,10]}, yaxis: {range: [-10, 10]}}}
        config = {{scrollZoom:true}}
      />
        </Col>
      </Row>

    </div>
  );
}

export default App;
