import React, {useState} from 'react';
import {Row, Col, InputNumber, Button} from 'antd';
import './App.css';
// import Plot from 'react-plotly.js';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {generatePath, calculateOffsetPaths} from './utils';
import 'antd/dist/antd.css';


const Plot = createPlotlyComponent(Plotly);

// const grid = xyrange(-40, 40, -20, 20, 0.25);
// const xgrid = grid[0];
// const ygrid = grid[1];

function App() {
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [xLeft, setLeftX] = useState([]);
  const [yLeft, setLeftY] = useState([]);
  const [xRight, setRightX] = useState([]);
  const [yRight, setRightY] = useState([]);
  const [calculated, setCalculated] = useState(false)

  const [inputs, setInputs] = useState([{t:0, x:15, y:5, xp:0, yp:1, dt:0.1}, {t:8, x:25, y:7, xp:1, yp:0, dt:0.1}])
  const [diam, setDiam] = useState(1.5);

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
    try{
      const {xpath, ypath} = generatePath(xway, yway, xpway, ypway, tway, dtway);
      const {xLpath, yLpath, xRpath, yRpath} = calculateOffsetPaths(xpath, ypath, diam/2);
      setX(xpath);
      setY(ypath);
      setLeftX(xLpath);
      setLeftY(yLpath);
      setRightX(xRpath);
      setRightY(yRpath);
      setCalculated(true)
    } catch (err) {
        alert(err)
    }
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
    console.log(newinputs)
    setInputs(newinputs);
  }

  return (
    <div>
      <Row style={{padding:20, paddingTop:100, minHeight:800}} gutter={[16,16]} justify="space-around">
      <Col span={8}>
        <h2>Set Path Details</h2>
        <Row style={{padding:20}} align="middle" justify="space-around" gutter={[8,8]}>
          <Col span={3}>
            <Row justify="center">t</Row>
            {inputs.map((value, i) => {
              return(
              <Row key={i}>
                <InputNumber controls={false} label={"t"} min={0} max={100} defaultValue={inputs[i].t} placeholder={"t"} onChange={(val) => {onChange("t", val, i)}} />
              </Row>)
            })}</Col>
          <Col span={3}>
            <Row justify="center">x</Row>
            {inputs.map((value, i) => {
              return(
              <Row key={i}>
                <InputNumber controls={false} label={"x"} min={-40} max={40} defaultValue={inputs[i].x} placeholder={"x"} onChange={(val) => {onChange("x", val, i)}} />
              </Row>)
            })}</Col>
            <Col span={3}>
            <Row justify="center">y</Row>
            {inputs.map((value, i) => {
              return(
              <Row key={i}>
                <InputNumber controls={false} label={"y"} min={-20} max={20} defaultValue={inputs[i].y} placeholder={"y"} onChange={(val) => {onChange("y", val, i)}} />
              </Row>)
            })}</Col>
            <Col span={3}>
            <Row justify="center">xvel</Row>
            {inputs.map((value, i) => {
              return(
              <Row key={i}>
                <InputNumber controls={false} label={"xp"} min={-10} max={10} defaultValue={inputs[i].xp} placeholder={"x vel"} onChange={(val) => {onChange("xp", val, i)}} />
              </Row>)
            })}</Col>
            <Col span={3}>
            <Row justify="center">yvel</Row>
            {inputs.map((value, i) => {
              return(
              <Row key={i}>
                <InputNumber controls={false} label={"yp"} min={-10} max={10} defaultValue={inputs[i].yp} placeholder={"y vel"} onChange={(val) => {onChange("yp", val, i)}} />
              </Row>)
            })}</Col>
            <Col span={3}>
            <Row justify="center">dt</Row>
            {inputs.map((value, i) => {
              return(
              <Row key={i}>
                <InputNumber controls={false} label={"dt"} min={0} max={10} defaultValue={inputs[i].dt} placeholder={"dt"} onChange={(val) => {onChange("dt", val, i)}} />
              </Row>)
            })}</Col>
            <Col span={3}>
              <Row justify="center">delete</Row>
              {inputs.map((value,i) => {
                return(
                  <Row justify="center" key={i}><Button onClick={removePoint} type="danger" disabled={i==0}>X</Button></Row>
                )
              })}
            </Col> 
        </Row>
        <Row justify="space-around">
        <Button type="primary" onClick={addPoint}>Add Point</Button>
        <Button type="primary" style={{backgroundColor:"green", borderColor:"green"}} onClick={calculate}>Calculate Path</Button>
        <Button type="secondary" disabled={!calculated}>Download</Button>
        </Row>
        </Col>
        <Col span={12}>
          <h2>Set Robot Details</h2>
          <Row justify="start" style={{paddingLeft:30, paddingBottom:20}} align="middle">
            Track width (ft):  <InputNumber min={0} max={10} defaultValue={diam} onChange={(val) => {setDiam(val)}} />
            </Row>
        </Col>
        </Row>
        <Row>
        <Col span={24}>
          <Row justify="center" style={{paddingTop:20}}>
        <Plot 
        onClick={(evt) => {console.log(evt.points[0].x + " " + evt.points[0].y)}}
        data={[
          {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'green'},
          },
          {
            x: xLeft,
            y: yLeft,
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'orange'},
          },
          {
            x: xRight,
            y: yRight,
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'orange'},
          },
          // {
          //   x: xgrid,
          //   y: ygrid,
          //   type: 'scatter',
          //   mode: 'markers',
          //   marker: {color: 'black'},
          //   opacity:0.0,
          // },
           ]}
        layout={ {width: 1200, height: 1200, title: 'Robot path', xaxis: {range: [-40,40]}, yaxis: {range: [-40, 40]}, dragmode: "pan", hovermode: "closest",
                images: [{
                  source: "/frc2022_field.png",
                  x:-39.825,
                  sizex:78.85,
                  y:19.45,
                  sizey:40.3,
                  xref:"x",
                  yref:"y",
                  opacity:1.0,
                  layer:"below",
                  sizing:"stretch",
              }]}}
        config = {{scrollZoom:true}}
      />
      </Row>
        </Col>
        </Row>

    </div>
  );
}

export default App;
