
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as d3Select from 'd3-selection';
import * as d3Scale from 'd3-scale';
// import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as color from 'd3-color';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
//import * as d3 from 'd3';
import * as d3 from "d3";
//const d3 = await import("d3");
// declare let d3: any;
import * as d3Hierarchy from 'd3-hierarchy';
//import * as d3 from "https://cdn.skypack.dev/d3@7";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    title = 'Tour of Heroes';
    svg: any;
    width: any = 1200;
    g: any;
    color: any;
    xAxis: any;
    yAxis: any;
    data = ULB;
    root = d3.hierarchy(this.data)
        // .sum(d => d.value)
        // .sum(d => d.children ? d.children.length : 0)
        // .sum(d => d.children ? d.children.length : 0)
        .count()
        // .sum(d => d.children ? d.children.length : 0)
        //    .sum(d => d.children ? d.children.length + d.name.length + 1 : 0)
        .sort((a:any, b:any) => b.value - a.value)
        .eachAfter((d:any) => d['index'] = d.parent ? d.parent['index'] = d.parent['index'] + 1 || 0 : 0)
    //    root = d3Hierarchy.hierarchy(MBOSTOCK)
    //    .sum(d => d.value)
    //    .sort((a, b) => b.value - a.value)
    //    .eachAfter(d => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0)

    //   root = d3.hierarchy(this.data)
    // .sum(d => d.children ? d.children.length +
    // d.name.length + 1 : undefined);

    margin = ({ top: 30, right: 30, bottom: 0, left: 100 });
    max = 1;
    barStep = 27;
    // root.each(d => d.children && (max = Math.max(max, d.children.length)));
    //   height = this.max * this.barStep + this.margin.top + this.margin.bottom;
    height = 894;
    duration = 750;
    barPadding = 3 / this.barStep;


    x = d3.scaleLinear().range([this.margin.left, this.width - this.margin.right]).domain([0, Number(this.root.value)]);;

    showMainMenu = true;
    constructor() {
        this.root.each(d => d.children && (this.max = Math.max(this.max, d.children.length)));
        this.height = this.max * this.barStep + this.margin.top + this.margin.bottom;
        // this.globalService.getObservable().subscribe((data) => {
        //     console.log('globalService Data received: ', data);
        //     this.showMainMenu = data.showMainMenu;
            
        //   });
    }

    ngOnInit() {
        this.initSvg();
        this.drawAxis();
    }
    private initSvg() {
        // this.svg = d3.select('svg');
        // this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
        // this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;


        //kk
        this.color = d3.scaleOrdinal([true, false], ["#d35400", "#897865"]);


        this.yAxis = (g:any) => g
            .attr("class", "y-axis")
            .attr("transform", `translate(${this.margin.left + 100.5},0)`)
            .call((g:any) => g.append("line")
                .attr("stroke", "currentColor")
                .attr("y1", this.margin.top)
                .attr("y2", this.height - this.margin.bottom));

        this.xAxis = (g:any) => g
            .attr("class", "x-axis")
            .attr("transform", `translate(100,${this.margin.top})`)
            .call(d3.axisTop(this.x).ticks(this.width / 80, "s"))
            .style('color', 'black')
            .call((g:any) => (g.selection ? g.selection() : g).select(".domain").remove())
        // .sum(d => d.value)
        // .sort((a, b) => b.value - a.value)
        // .eachAfter(d => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0);


        const svg = d3.select('svg#hierarchical')
            .attr("width", this.width)
            .attr("height", this.height);



        svg.append("rect")
            .attr("class", "background")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("cursor", "pointer")
            .on("click", (event, d) => this.up(svg, d));

        svg.append("g")
            .call(this.xAxis);

        svg.append("g")
            .call(this.yAxis);

        this.down(svg, this.root);

        svg.node();




        // this.g = this.svg.append('g')
        //     .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        //     .call(this.xAxis)
        //     .call(this.yAxis);


    }

    private drawAxis() {

        // this.g.append('g')
        //   .attr("class", "x-axis")
        //   .attr("transform", `translate(0,${this.margin.top})`)
        //   .call(d3.axisTop(this.x).ticks(this.width / 80, "s"))
        //   .call(g => (g.selection ? g.selection() : g).select(".domain").remove())
        //  this.g.append('g')
        //     .attr("class", "y-axis")
        //     .attr("transform", `translate(${this.margin.left + 0.5},0)`)
        //     .call(g => g.append("line")
        //         .attr("stroke", "currentColor")
        //         .attr("y1", this.margin.top)
        //         .attr("y2", this.height - this.margin.bottom));    
    }

    stagger() {
        let value = 0;
        return (d:any, i:any) => {
            const t = `translate(${this.x(value) - this.x(0)},${this.barStep * i})`;
            value += d.value;
            return t;
        };
    }
    stack(i:any) {
        let value = 0;
        return (d:any) => {
            const t = `translate(${this.x(value) - this.x(0)},${this.barStep * i})`;
            value += d.value;
            return t;
        };
    }
    up(svg:any, d:any) {
        if (!d.parent || !svg.selectAll(".exit").empty()) return;

        // Rebind the current node to the background.
        svg.select(".background").datum(d.parent);

        // Define two sequenced transitions.
        const transition1 = svg.transition().duration(this.duration);
        const transition2 = transition1.transition();

        // Mark any currently-displayed bars as exiting.
        const exit = svg.selectAll(".enter")
            .attr("class", "exit");

        // Update the x-scale domain.
        //kk
        var xscale = d3.max(d.parent.children, (d:any) => d['value']);
        

        this.x.domain([0, Number(xscale)]);


        // Update the x-axis.
        svg.selectAll(".x-axis").transition(transition1)
            .call(this.xAxis);

        // Transition exiting bars to the new x-scale.
        exit.selectAll("g").transition(transition1)
            .attr("transform", this.stagger());

        // Transition exiting bars to the parent’s position.
        exit.selectAll("g").transition(transition2)
            .attr("transform", this.stack(d.index));

        // Transition exiting rects to the new scale and fade to parent color.
        exit.selectAll("rect").transition(transition1)
            .attr("width", (d:any) => this.x(d.value) - this.x(0))
            .attr("fill", this.color(true));

        // Transition exiting text to fade out.
        // Remove exiting nodes.
        exit.transition(transition2)
            .attr("fill-opacity", 0)
            .remove();

        // Enter the new bars for the clicked-on data's parent.
        const enter = this.bar(svg, this.down, d.parent, ".exit")
            .attr("fill-opacity", 0);

        enter.selectAll("g")
            .attr("transform", (d:any, i:any) => `translate(0,${this.barStep * i})`);

        // Transition entering bars to fade in over the full duration.
        enter.transition(transition2)
            .attr("fill-opacity", 1);

        // Color the bars as appropriate.
        // Exiting nodes will obscure the parent bar, so hide it.
        // Transition entering rects to the new x-scale.
        // When the entering parent rect is done, make it visible!
       // _this = this
        enter.selectAll("rect")
            .attr("fill", (d:any) => this.color(!!d.children))
            .attr("fill-opacity", (p:any) => p === d ? 0 : null)
            .transition(transition2)
            .attr("width", (d:any) => this.x(d.value) - this.x(0))
            //.on("end",  (p:any) => { d3.select(this).attr("fill-opacity", 1); });
    }
    down(svg:any, d:any) {
        if (!d.children || d3.active(svg.node())) return;

        // Rebind the current node to the background.
        svg.select(".background").datum(d);

        // Define two sequenced transitions.
        const transition1 = svg.transition().duration(this.duration);
        const transition2 = transition1.transition();

        // Mark any currently-displayed bars as exiting.
        const exit = svg.selectAll(".enter")
            .attr("class", "exit");

        // Entering nodes immediately obscure the clicked-on bar, so hide it.
        exit.selectAll("rect")
            .attr("fill-opacity", (p:any) => p === d ? 0 : null);

        // Transition exiting bars to fade out.
        exit.transition(transition1)
            .attr("fill-opacity", 0)
            .remove();

        // Enter the new bars for the clicked-on data.
        // Per above, entering bars are immediately visible.
        const enter = this.bar(svg, this.down, d, ".y-axis")
            .attr("fill-opacity", 0);

        // Have the text fade-in, even though the bars are visible.
        enter.transition(transition1)
            .attr("fill-opacity", 1);

        // Transition entering bars to their new y-position.
        enter.selectAll("g")
            .attr("transform", this.stack(d.index))
            .transition(transition1)
            .attr("transform", this.stagger());

        // Update the x-scale domain.
        //kk
        var xscale = d3.max(d.children, (d:any) => d['value']);
        
        this.x.domain([0, Number(xscale)]);

        // Update the x-axis.
        svg.selectAll(".x-axis").transition(transition2)
            .call(this.xAxis);

        // Transition entering bars to the new x-scale.
        enter.selectAll("g").transition(transition2)
            .attr("transform", (d:any, i:any) => `translate(0,${this.barStep * i})`);

        // Color the bars as parents; they will fade to children if appropriate.
        enter.selectAll("rect")
            .attr("fill", this.color(true))
            .attr("fill-opacity", 1)
            .transition(transition2)
            .attr("fill", (d:any) => this.color(!!d.children))
            .attr("width", (d:any) => this.x(d.value) - this.x(0));
    }
    bar(svg:any, down:any, d:any, selector:any) {
        const g = svg.insert("g", selector)
            .attr("class", "enter")
            .attr("transform", `translate(100,${this.margin.top + this.barStep * this.barPadding})`)
            .attr("text-anchor", "end")
            .style("font", "10px sans-serif");

        const bar = g.selectAll("g")
            .data(d.children)
            .join("g")
            .attr("cursor", (d:any) => !d.children ? null : "pointer")
            .on("click", (event:any, d:any) => this.down(svg, d));

        bar.append("text")
            .attr("x", this.margin.left - 6)
            .attr("y", this.barStep * (1 - this.barPadding) / 2)
            .attr("dy", ".35em")
            .style('fill', 'black')
            .text((d:any) => d.data.name);

        bar.append("rect")
            .attr("x", this.x(0))
            .attr("width", (d:any) => this.x(d.value) - this.x(0))
            .attr("height", this.barStep * (1 - this.barPadding));

        return g;
    }


}
export const ULB =
{
    "name": "India",
    "value": 0,
    "children": [
        {
            "name": "ANDAMAN AND NICOBAR ISLANDS",
            "value": 1, "children": []
        },
        {
            "name": "ANDHRA PRADESH",
            "value": 1, "children": []
        },
        {
            "name": "ARUNACHAL PRADESH",
            "value": 1, "children": []
        },
        {
            "name": "ASSAM",
            "value": 1, "children": []
        },
        {
            "name": "BIHAR",
            "value": 1, "children": []
        },
        {
            "name": "CHANDIGARH",
            "value": 1, "children": []
        },
        {
            "name": "CHHATTISGARH",
            "value": 1, "children": []
        },
        {
            "name": "DELHI",
            "value": 1, "children": []
        },
        {
            "name": "GOA",
            "value": 1, "children": []
        },
        {
            "name": "GUJARAT",
            "value": 1, "children": []
        },
        {
            "name": "HARYANA",
            "value": 1, "children": []
        },
        {
            "name": "HIMACHAL PRADESH",
            "value": 1, "children": []
        },
        {
            "name": "JAMMU AND KASHMIR",
            "value": 1, "children": []
        },
        {
            "name": "JHARKHAND",
            "value": 1, "children": []
        },
        {
            "name": "KARNATAKA",
            "value": 1, "children": []
        },
        {
            "name": "KERALA",
            "value": 1, "children": []
        },
        {
            "name": "LADAKH",
            "value": 1, "children": []
        },
        {
            "name": "LAKSHADWEEP",
            "value": 1, "children": []
        },
        {
            "name": "MADHYA PRADESH",
            "value": 1, "children": []
        },
        {
            "name": "MAHARASHTRA",
            "value": 1, "children": []
        },
        {
            "name": "MANIPUR",
            "value": 1, "children": []
        },
        {
            "name": "MEGHALAYA",
            "value": 1, "children": []
        },
        {
            "name": "MIZORAM",
            "value": 1, "children": []
        },
        {
            "name": "NAGALAND",
            "value": 1, "children": []
        },
        {
            "name": "ODISHA",
            "value": 1, "children": []
        },
        {
            "name": "PUDUCHERRY",
            "value": 1, "children": []
        },
        {
            "name": "PUNJAB",
            "value": 1, "children": []
        },
        {
            "name": "RAJASTHAN",
            "value": 1, "children": []
        },
        {
            "name": "SIKKIM",
            "value": 1, "children": []
        },
        {
            "name": "TAMIL NADU",
            "value": 0,
            "children": [
                {
                    "name": "ARIYALUR",
                    "value": 1, "children": []
                },
                {
                    "name": "CHENGALPATTU",
                    "value": 1, "children": []
                },
                {
                    "name": "CHENNAI",
                    "value": 0,
                    "children": [
                        {
                            "name": "THIRUVOTRIYUR",
                            "children": [
                                {
                                    "name": "Ward No . 1",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 2",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 3",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 4",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 5",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 6",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 7",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 8",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 9",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 10",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 11",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 12",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 13",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 14",
                                    "value": 1, "children": []
                                }
                            ]
                        },
                        {
                            "name": "MANALI",
                            "children": [{
                                "name": "Ward No . 5",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 15", "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 17", "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 18", "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 19",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 20",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 21",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "MADHAVARAM",
                            "children": [{
                                "name": "Ward No . 22",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 23",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 24",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 25",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 26",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 27",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 28",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 29",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 30",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 31",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 32",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 33",
                                "value": 1, "children": []
                            }
                            ]
                        },
                        {
                            "name": "TONDIARPET",
                            "children": [
                                {
                                    "name": "Ward No . 34",
                                    "value": 1, "children": []
                                },
                                {
                                    "name": "Ward No . 35",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 36",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 37",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 38",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 39",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 40",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 41",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 42",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 43",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 44",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 45",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 46",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 47",
                                    "value": 1, "children": []
                                }, {
                                    "name": "Ward No . 48",
                                    "value": 1, "children": []
                                }
                            ]
                        },
                        {
                            "name": "ROYAPURAM",
                            "children": [{
                                "name": "Ward No . 49",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 50",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 51",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 52",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 53",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 54",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 55",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 56",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 57",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 58",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 59",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 60",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 61",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 62",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 63",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "THIRU-VI-KA NAGAR",
                            "children": [{
                                "name": "Ward No . 64",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 65",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 66",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 67",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 68",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 69",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 70",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 71",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 72",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 73",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 74",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 75",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 76",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 77",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 78",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "AMBATTUR",
                            "children": [{
                                "name": "Ward No . 79",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 80",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 81",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 82",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 83",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 84",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 85",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 86",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 87",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 88",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 89",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 90",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 91",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 92",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 93",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "ANNA NAGAR",
                            "children": [{
                                "name": "Ward No . 94",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 95",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 96",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 97",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 98",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 99",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 100",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 101",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 102",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 103",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 104",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 105",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 106",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 107",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 108",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "TEYNAMPET",
                            "children": [{
                                "name": "Ward No . 109",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 110",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 111",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 112",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 113",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 114",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 115",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 116",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 117",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 118",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 119",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 120",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 121",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 122",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 123",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 124",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 125",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 126",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "KODAMBAKKAM",
                            "children": [{
                                "name": "Ward No . 127",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 128",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 129",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 130",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 131",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 132",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 133",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 134",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 135",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 136",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 137",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 138",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 139",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 140",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 141",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 142",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "VALASARAVAKKAM",
                            "children": [{
                                "name": "Ward No . 143",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 144",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 145",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 146",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 147",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 148",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 149",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 150",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 151",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 152",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 153",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 154",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 155",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "ALANDUR",
                            "children": [{
                                "name": "Ward No . 156",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 157",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 158",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 159",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 160",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 161",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 162",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 163",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 164",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 165",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 166",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 167",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "ADYAR",
                            "children": [{
                                "name": "Ward No . 170",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 171",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 172",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 173",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 174",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 175",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 176",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 177",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 178",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 179",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 180",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "PERUNGUDI",
                            "children": [{
                                "name": "Ward No . 168",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 169",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 184",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 185",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 186",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 187",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 188",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 189",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 190",
                                "value": 1, "children": []
                            }, {
                                "name": "Ward No . 191",
                                "value": 1, "children": []
                            }]
                        },
                        {
                            "name": "SOZHANGANALLUR",
                            "children": [{
                                "name": "Ward No . 192",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 193",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 194",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 195",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 196",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 197",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 198",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 199",
                                "value": 1, "children": []
                            },
                            {
                                "name": "Ward No . 200",
                                "value": 1, "children": []
                            }
                            ]
                        }
                    ]
                },
                {
                    "name": "COIMBATORE",
                    "value": 1, "children": []
                },
                {
                    "name": "CUDDALORE",
                    "value": 1, "children": []
                },
                {
                    "name": "DHARMAPURI",
                    "value": 1, "children": []
                },
                {
                    "name": "DINDIGUL",
                    "value": 1, "children": []
                },
                {
                    "name": "ERODE",
                    "value": 1, "children": []
                },
                {
                    "name": "KALLAKURICHI",
                    "value": 1, "children": []
                },
                {
                    "name": "KANCHIPURAM",
                    "value": 1, "children": []
                },
                {
                    "name": "KANNIYAKUMARI",
                    "value": 1, "children": []
                },
                {
                    "name": "KARUR",
                    "value": 1, "children": []
                },
                {
                    "name": "KRISHNAGIRI",
                    "value": 1, "children": []
                },
                {
                    "name": "MADURAI",
                    "value": 1, "children": []
                },
                {
                    "name": "NAGAPATTINAM",
                    "value": 1, "children": []
                },
                {
                    "name": "NAMAKKAL",
                    "value": 1, "children": []
                },
                {
                    "name": "PERAMBALUR",
                    "value": 1, "children": []
                },
                {
                    "name": "PUDUKKOTTAI",
                    "value": 1, "children": []
                },
                {
                    "name": "RAMANATHAPURAM",
                    "value": 1, "children": []
                },
                {
                    "name": "Ranipet",
                    "value": 1, "children": []
                },
                {
                    "name": "SALEM",
                    "value": 1, "children": []
                },
                {
                    "name": "SIVAGANGA",
                    "value": 1, "children": []
                },
                {
                    "name": "TENKASI",
                    "value": 1, "children": []
                },
                {
                    "name": "THANJAVUR",
                    "value": 1, "children": []
                },
                {
                    "name": "THENI",
                    "value": 1, "children": []
                },
                {
                    "name": "THE NILGIRIS",
                    "value": 1, "children": []
                },
                {
                    "name": "THIRUVALLUR",
                    "value": 1, "children": []
                },
                {
                    "name": "THIRUVARUR",
                    "value": 1, "children": []
                },
                {
                    "name": "TIRUCHIRAPPALLI",
                    "value": 1, "children": []
                },
                {
                    "name": "TIRUNELVELI",
                    "value": 1, "children": []
                },
                {
                    "name": "Tirupathur",
                    "value": 1, "children": []
                },
                {
                    "name": "TIRUPPUR",
                    "value": 1, "children": []
                },
                {
                    "name": "TIRUVANNAMALAI",
                    "value": 1, "children": []
                },
                {
                    "name": "TUTICORIN",
                    "value": 1, "children": []
                },
                {
                    "name": "VELLORE",
                    "value": 1, "children": []
                },
                {
                    "name": "VILLUPURAM",
                    "value": 1, "children": []
                },
                {
                    "name": "VIRUDHUNAGAR",
                    "value": 1, "children": []
                }
            ]
        },
        {
            "name": "TELANGANA",
            "value": 1, "children": []
        },
        {
            "name": "THE DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
            "value": 1, "children": []
        },
        {
            "name": "TRIPURA",
            "value": 1, "children": []
        },
        {
            "name": "UTTARAKHAND",
            "value": 1, "children": []
        },
        {
            "name": "UTTAR PRADESH",
            "value": 1, "children": []
        },
        {
            "name": "WEST BENGAL",
            "value": 1, "children": []
        }
    ]
};
