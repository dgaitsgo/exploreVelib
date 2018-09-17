import React, { Component } from 'react'
import './ScrollerLayout.css'
import * as d3 from 'd3'
import Map from 'components/Map'

/* layers */
import './station_lookup.geojson'


const sections = [
    {
        title : `Vélib' Data`,
        vis : {
            type : 'html',
            data : `<h1>Exploring Vélib'/Vélib' Métropole station data</h1>`,
        }
    },
    {
        title : 'Background',
        content : `Vélib' was a large-scale public bicycle sharing system in Paris, France that has been replaced by Vélib' Métropole - a similar service that now includes electric bikes.
                  The objective is to explore and understand Vélib''s relationship to the city and its users. The lessons learned here might be informative for planning city bike sharing systems in general.`,
        vis : {
            type : 'map',
            data : { title : 'stations', layer : 'station_lookup.geojson' }
        }
    },
]

class ScrollerLayout extends Component {

    constructor() {
        super()
        this.state = {
            sectionPositions : []
        }
    }

    getVis = ({ type, data }) => {

        if (type == 'map') {
            console.log('here')
            return (<Map {...data} />)
        }

        if (type == 'html') {
            return (<div dangerouslySetInnerHTML={{__html: data}} />)

        }
    }

    getSection = ({ title, content, vis}, i) => {

        return (
            <section className='step' key={'section_' + i}>
                <div className='left'>
                    <div className='section-title'>
                        {title}
                    </div>
                    <div className='section-content'>
                        {content}
                    </div>
                </div>
                <div className='right'>
                    <div className='section-vis'>
                        {vis && this.getVis(vis)}
                    </div>
                </div>
            </section>
        )
    }

    position = () => {

        var pos = window.pageYOffset - 10
        var sectionIndex = d3.bisect(this.state.sectionPositions, pos)
        sectionIndex = Math.min(sections.length - 1, sectionIndex)

        if (currentIndex !== sectionIndex) {
            dispatch.active(sectionIndex)
            currentIndex = sectionIndex
        }
    }

    componentDidMount() {

        let steps = d3.selectAll('.step')
        let sectionPositions = []
        let startPos

        steps.each( function(d, i) {
            // console.log(this)
            let top = this.getBoundingClientRect().top

            if (i === 0) {
                startPos = top
            }

            sectionPositions.push(top - startPos)
        })

        d3.select(window).on('scroll.scroller', this.position)

        this.setState({ sectionPositions })

    }

    render() {
        return (
            <div id='graphic'>
                <div id='sections'>
                    { sections.map( (section, i) => this.getSection(section, i) )}
                </div>
            </div>
        )
    }

}

export default ScrollerLayout
