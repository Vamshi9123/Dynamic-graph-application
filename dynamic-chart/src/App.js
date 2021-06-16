import './App.css';
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstRes: '',
      response: [],
      isLoaded: false,
      timeArray: [],
      valueArray: [],
    };
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ response: [] });
      this.setState({ isLoaded: false })
      this.callApi()
        .then(res => {
          this.setState({ response: res })
          this.setState({ isLoaded: true })
        })
        .catch(err => console.log(err));
    }, 500);
    setInterval(() => this.postData(), 10000)
  };

  callApi = async () => {
    const response = await fetch('/getData');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  postData = async () => {
    console.log("10 sec");
    const { response } = this.state;
    this.setState({ isLoaded: false });
    this.setState({ response: [] });
    this.setState({ timeArray: [] });
    this.setState({ valueArray: [] });
    await fetch('/postData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    }).then((res) => res.json()).then((result) => {
      this.setState({ response: result });
      this.setState({ isLoaded: true });
    });
  };

  getOption = () => {

    let { timeArray, valueArray } = this.state;
    if (this.state.response.length !== 0) {
      this.state.response.forEach(entry => {
        timeArray.push(entry.time);
        valueArray.push(entry.value);
      });
      
      let finalArray = []
      this.state.valueArray.forEach((element) => {
        if (element <= 1000) {
          finalArray.push({
            value: element,
            itemStyle: { color: 'green' }
          });
        } else if (element > 1000 && element <= 2000) {
          finalArray.push({
            value: element,
            itemStyle: { color: 'yellow' }
          });
        } else if (element > 2000) {
          finalArray.push({
            value: element,
            itemStyle: { color: 'red' }
          });
        }
      })

      if (this.state.isLoaded === true) {
        return {
          xAxis: {
            type: "category",
            data: [...this.state.timeArray],
          },
          yAxis: {
            name: 'CO2 Emission',
            type: "value"
          },
          series: [{
            data: [...finalArray],
            type: "bar"
          }],
        };
      } else {
        return {
          xAxis: {
            type: "category",
            data: ["Arun", "Vamshi"],
          },
          yAxis: {
            name: 'CO2 Emissionsss',
            type: "value"
          },
          series: [{
            data: [10, 20],
            type: "line"
          }],
        };
      }
    }
  };

  render() {
    if (this.state.isLoaded === true) {
      return (
        <ReactEcharts
          option={this.getOption()}
          style={{ height: "80vh", left: 50, top: 50, width: "90vw" }}
          opts={{ renderer: "svg" }}
        />

      );
    } else {
      return (
        <div className="App">
          <p>Chart Loading...!</p>
        </div>
      )
    }
  }
}

export default App;
