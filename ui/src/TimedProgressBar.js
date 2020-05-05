import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';

class TimedProgressBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0
        }
        this.intervalTimer = null;
        this.timeElapsed = this.props.timerInterval
        this.updateProgress = this.updateProgress.bind(this)
    }
    componentDidMount() {
        const {timerInterval} = this.props
        this.intervalTimer = window.setInterval(this.updateProgress, timerInterval)
    }

    updateProgress() {
        const {timerInterval, totalTime} = this.props
        const percentageTimeElapsed = Math.min((this.timeElapsed / totalTime) * 100, 100)
        if(percentageTimeElapsed <= 100) {
            if(percentageTimeElapsed === 100) {
                window.clearInterval(this.intervalTimer)
            }
            this.setState(() => ({
                progress: parseInt(percentageTimeElapsed, 10)
            }))
            this.timeElapsed = this.timeElapsed + timerInterval
            const timeDiff = totalTime - this.timeElapsed
            if(timeDiff > 0  && timeDiff < timerInterval) {
                window.clearInterval(this.intervalTimer)
                this.intervalTimer = window.setInterval(this.updateProgress, timeDiff)
            }
        }
    }

    render() {
        const {progress} = this.state
        const {variant} = this.props
        return (
            <ProgressBar animated variant={variant} now={progress} label={`${progress}%`}/>
        );
    }
}

export default TimedProgressBar;