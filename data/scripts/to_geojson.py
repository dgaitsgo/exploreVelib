import json

def to_geojson(path, name):

    geojson = {
       'type': 'FeatureCollection',
       'features': []
    }

    j = json.loads(open(path, 'rb').read())

    for obj in j:
        geojson['features'].append({
            'type' : 'Feature',
                'geometry' : {
                    'type' : 'Point',
                    'coordinates' : [obj['position']['lng'], obj['position']['lat']]
                },
                'properties' : {
                    'name' : obj['name'],
                    'address' : obj['address'],
                    'number' : obj['number']
                }
            })

    with open(name, 'wb') as file:
    	file.write(json.dumps(geojson))


to_geojson('../raw_sets/tables/station_lookup.json', 'station_lookup.geojson')
