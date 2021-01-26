import React, {Component} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import { render } from 'react-dom';

class Chart extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return(
            <div className="chart">
                {/* <Bar data={data} width={100} height={50} options={{maintainAspectRatio: false}} /> */}
            </div>
        )
    }
}

export default Chart;