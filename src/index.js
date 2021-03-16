/* Simple Guage chart */
import {Component} from 'react';
import * as d3 from "d3";
import React from 'react';
import styles from './styles.module.css'

export class SimpleGuageChart extends Component {

    constructor(props) {
        super(props);

        window.dd3 = d3;

        this.pointerHeadLength = null;
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
            ringInset: 15,
            mainRingInset: 10,
            mainRingWidth: 3,
            ringWidth: 15,

            pointerWidth: 6,
            pointerTailLength: 6,
            pointerHeadLengthPercent: 0.7,

            minValue: 0,
            maxValue: 100,

            minAngle: -120,
            maxAngle: 120,

            transitionMs: 1000,

            majorTicks: 7,
            labelFormat: d3.format('~s'),
            labelInset: 50,

            arcColorFn: d3.interpolateHsl(d3.rgb('#d92121'), d3.rgb('#12af5a'))
        }

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

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.update();
        }
    }

    updateConfig() {
        /*Input values */
        let p = this.props, c = this.config;
        c.size = p.size || c.size
        c.width = p.width || c.width;
        c.height = p.height || c.height;

        c.minValue = p.minValue || c.minValue;
        c.maxValue = p.maxValue || c.maxValue;
        c.majorTicks = p.majorTicks || c.majorTicks;

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
        let {config} = this;

        this.range = config.maxAngle - config.minAngle;
        this.r = config.size / 2;
        let r = this.r;
        this.pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

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
        this.arc = innerRadius(r - config.ringWidth - config.ringInset - config.mainRingWidth)
            .outerRadius(r - config.ringInset - config.mainRingWidth)
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
        let elem = document.getElementById("#" + this.uniqueId);
        let {config} = this;
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
            .attr("fill", "#b3b3b3") // mainArc Color
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
                return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r ) + ')';
            })
            .text(config.labelFormat)
            .style('fill', '#666')
            .style('text-anchor', 'middle')
            .style('font-size', '13px')
            .style('font-weight', 'bold')

        let lineData = [[config.pointerWidth, 0],
            [0, -that.pointerHeadLength],
            [-(config.pointerWidth), 0],
            [0, config.pointerTailLength],
            [config.pointerWidth, 0]];

        let pointerLine = d3.line().curve(d3.curveMonotoneY);

        let pg = svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx)
            .style('fill', '#ff0500')
            .style('stroke', '#ff0500');

        let circle = pg.append('circle')
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
        let {config} = this;
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
        return (
            <div className={`${styles['sr-guage-chart-wrapper']} sr-guage-chart-wrapper`}>
                <div id={`#${this.uniqueId}`} className={styles['sr-guage-chart']}>
                </div>
                <div className={styles['sr-guage-chart-value']} style={{width: this.config.width}}>
                    <strong>{this.props.value}</strong><br/>
                </div>
            </div>
        )
    }
}
