/* Simple Guage chart */
import {Component} from 'react';
import * as d3 from "d3";
import React from 'react';
import styles from './styles.module.css'

export class SimpleGuageChart extends Component {

    constructor(props) {
        super(props);

        window.dd3 = d3;

        this.pointerLength = null;
        this.value = 0;
        this.ticks = null;
        this.tickData = null;
        this.arc = null;
        this.svg = null;
        this.r = null;
        this.scale = null;
        this.range = null;
        this.uniqueId = "sr-guage-chart-" + Math.ceil(Math.random() * Math.pow(10, 10));

        this.config = {
            size: 300,
            width: 300,
            height: 300,
            mainRingWidth: 3,
            mainRingInset: 5,
            ticksRingWidth: 15,
            ticksRingInset: 5,

            pointerWidth: 6, // should be in between 2 to 10
            pointerTailLength: 6,
            pointerLengthPercent: 0.6,

            minValue: 0,
            maxValue: 100,

            minAngle: -120,
            maxAngle: 120,

            transitionMs: 1000,

            majorTicks: 7,
            labelFormat: d3.format('~s'),
            labelInset: 50,

            tickColors: ['#d92121', '#12af5a'],

            arcColor: '#b3b3b3',
            pointerColor: '#ff0500',

            tickFontColor: '#666',
            fontColor: '#666',
        }

        this.config.arcColorFn = d3.interpolateHsl(d3.rgb(this.config.tickColors[0]), d3.rgb(this.config.tickColors[1]))

        this.state = {
            pointer: null,
            config: this.config
        }
    }

    componentDidMount() {
        this.updateConfig();
        this.configure();
        this.renderGraph(this.props.value);
    }

    // componentWillReceiveProps(nextProps) {
    //     this.updateConfig();
    // }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.update();
        }
    }

    updateConfig() {
        /*Input values */
        let p = this.props, c = this.state.config;
        c.size = (p.size && p.size > 200) ? p.size : c.size;

        // Making it a Square
        c.width = c.size;
        c.height = c.size;

        c.minValue = p.minValue !== undefined ? p.minValue : c.minValue;
        c.maxValue = p.maxValue !== undefined ? p.maxValue : c.maxValue;

        if(p.minAngle !== undefined && p.maxAngle !== undefined && p.minAngle < p.maxAngle) {
            c.minAngle = p.minAngle;
            c.maxAngle = p.maxAngle;
        }


        c.majorTicks = p.majorTicks !== undefined ? p.majorTicks : c.majorTicks;

        c.pointerWidth = (p.pointerWidth !== undefined
            && p.pointerWidth >= 2
            && p.pointerWidth <= 10) ? p.pointerWidth : c.pointerWidth;

        c.pointerLengthPercent = (p.pointerLength !== undefined
            && p.pointerLength >= 0.3
            && p.pointerLength <= 1) ? p.pointerLength : c.pointerLengthPercent;

        c.mainRingWidth = (p.mainRingWidth !== undefined
            && p.mainRingWidth >= 1) ? p.mainRingWidth : c.mainRingWidth;

        c.ticksRingWidth = (p.ticksRingWidth !== undefined
            && p.ticksRingWidth >= 0
            && p.ticksRingWidth <= 30) ? p.ticksRingWidth : c.ticksRingWidth;

        c.tickColors = (p.tickColors !== undefined
            && Array.isArray(p.tickColors)
            && p.tickColors.length === 2) ? p.tickColors : c.tickColors;

        c.arcColorFn = d3.interpolateHsl(d3.rgb(c.tickColors[0]), d3.rgb(this.config.tickColors[1]))

        c.pointerColor = p.pointerColor !== undefined ? p.pointerColor : c.pointerColor;

        c.arcColor = p.arcColor !== undefined ? p.arcColor : c.arcColor;

        c.labelInset = c.mainRingWidth + c.mainRingInset + c.ticksRingInset + c.ticksRingWidth + 15;

        c.tickFontColor = p.tickFontColor !== undefined ? p.tickFontColor : c.tickFontColor;
        c.fontColor = p.fontColor !== undefined ? p.fontColor : c.fontColor;

        this.setState({ config: c });

    }

    deg2rad(deg) {
        return deg * Math.PI / 180;
    }

    newAngle(d) {
        let ratio = this.scale(d);
        let newAngle = this.state.config.minAngle + (ratio * this.range);
        return newAngle;
    }

    configure() {
        let that = this;
        let {config} = this.state;

        this.range = config.maxAngle - config.minAngle;
        this.r = config.size / 2;
        let r = this.r;
        this.pointerLength = Math.round(r * config.pointerLengthPercent);

        // a linear scale that maps domain values to a percent from 0..1
        this.scale = d3.scaleLinear()
            .range([0, 1])
            .domain([config.minValue, config.maxValue]);

        this.ticks = this.scale.ticks(config.majorTicks);
        config.majorTicks = this.ticks.length;
        this.tickData = d3.range(config.majorTicks).map(function () {
            return 1 / (config.majorTicks - 1);
        });


        const {innerRadius} = d3.arc();
        this.arc = innerRadius(r - config.ticksRingWidth - config.ticksRingInset - config.mainRingWidth - config.mainRingInset)
            .outerRadius(r - config.ticksRingInset - config.mainRingWidth - config.mainRingInset)
            .startAngle(function (d, i) {
                let ratio = d * i;
                return that.deg2rad(config.minAngle + (ratio * that.range) - 1);
            })
            .endAngle(function (d, i) {
                let ratio = d * i;
                return that.deg2rad(config.minAngle + (ratio * that.range) + 1);
            });


    }

    centerTranslation() {
        return 'translate(' + this.r + ',' + this.r + ')';
    }

    renderGraph(newValue) {
        console.log(newValue);
        let that = this;
        let elem = document.getElementById("#" + this.props.id);
        let {config} = this.state;
        let svg = d3.select(elem)
            .append('svg:svg')
            .attr('class', 'gauge')
            .attr('width', config.width)
            .attr('height', config.height);
        let centerTx = this.centerTranslation();


        //Append main arc
        let r = this.r;
        let mainArc = d3.arc()
            .innerRadius(r - config.mainRingInset - config.mainRingWidth)
            .outerRadius(r - config.mainRingInset)
            .startAngle(this.deg2rad(config.minAngle - 5))
            .endAngle(this.deg2rad(config.maxAngle + 5))
        svg.append("path")
            .attr("d", mainArc)
            .attr("fill", config.arcColor) // mainArc Color
            .attr("transform", centerTx);

        let arcs = svg.append('g')
            .attr('class', 'arc')
            .attr('transform', centerTx);

        arcs.selectAll('path')
            .data(this.tickData)
            .enter().append('path')
            .attr('fill', function (d, i) {
                return config.arcColorFn(d * i);
            })
            .attr('d', this.arc);

        let lg = svg.append('g')
            .attr('class', 'label')
            .attr('transform', centerTx);
        lg.selectAll('text')
            .data(this.ticks)
            .enter().append('text')
            .attr('transform', function (d) {
                let ratio = that.scale(d);
                let newAngle = config.minAngle + (ratio * that.range);
                return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
            })
            .text(config.labelFormat)
            .style('fill', config.tickFontColor)
            .style('text-anchor', 'middle')
            .style('font-size', '13px')
            .style('font-weight', 'bold')

        let lineData = [[config.pointerWidth, 0],
            [0, -that.pointerLength],
            [-(config.pointerWidth), 0],
            [0, config.pointerTailLength],
            [config.pointerWidth, 0]];

        let pointerLine = d3.line().curve(d3.curveMonotoneY);

        let pg = svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx)
            .style('fill', config.pointerColor)
            .style('stroke', config.pointerColor);

        pg.append('circle')
            .attr('r', this.config.pointerWidth)

        this.setState({
            pointer: pg.append('path')
            .attr('d', pointerLine)
            .attr('transform', 'rotate(' + config.minAngle + ')')
        });

        this.update();
    }

    update() {
        let newValue = this.props.value;
        let {config} = this.state;
        if (newValue > config.maxValue) newValue = config.maxValue + (0.01 * config.maxValue);
        let ratio = this.scale(newValue);
        let newAngle = config.minAngle + (ratio * this.range);
        this.setState((state) => {
            state.pointer.transition()
            .duration(config.transitionMs)
            .attr('transform', 'rotate(' + newAngle + ')')
            return {};
        });
    }


    render() {
        let {config} = this.state;
        let valueStyle = {
            color: config.fontColor
        };
        return (
            <div className={`${styles['sr-guage-chart-wrapper']} sr-guage-chart-wrapper`}>
                <div id={`#${this.props.id}`} className={styles['sr-guage-chart']}>
                </div>
                <div className={styles['sr-guage-chart-value']} style={{width: config.width}}>
                    <strong style={valueStyle}>{this.props.value}</strong><br/>
                </div>
            </div>
        )
    }
}
