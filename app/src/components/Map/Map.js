import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'

import './Map.css'

class Map extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    getMapboxData(geojson, id) {

    // ret.points = GeoJSON.parse(ret.points, { Point: ['lat', 'lng'],  include: ['timestamp', 'ratio', 'size']});

	let points = {
        "id": id,
    	"type": "circle",
    	"source": {
    		"type": "geojson",
    		"data": geojson
    	},
    	'paint': {
    		'circle-radius': {
    			property : 'size',
    			'stops': [
    				[5, 5]
    			]
    		},
    		'circle-color': {
    			property: 'ratio',
    			type: 'exponential',
    			stops: [
                    // [0.0, 'orange'],
                    // [0.5, 'yellow'],
                    [1.0, 'green']
        		]
    		},
    		'circle-stroke-width' : 1,
    	}
    }

	return (ret)
}

    componentDidMount() {

        const { title, geojson } = this.props

        mapboxgl.accessToken = 'pk.eyJ1IjoiaXNhYWNsdW1wa2lucyIsImEiOiJjajNhdTVlZXMwMGFnMzJvNzdoemQ0N3phIn0.hv3Atoq7kaBU9F-YCBGBOw';
    	let map = new mapboxgl.Map({
    		container: title,
    		zoom: 11,
    		center: [2.3522, 48.8566],
    		style: 'mapbox://styles/isaaclumpkins/cj3j0p1be000g2ssatrsnvjp0',
            interactive: false
    	})

        if (geojson) {
            map.on('load', function () {
                map.addLayer(getMapboxData(geojson, title))
            })
        }
    }

    render() {

        const { geojson, title } = this.props

        return (
            <div className='map' id={title}>
            </div>
        )
    }
}

export default Map
