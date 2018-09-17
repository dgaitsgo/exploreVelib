from get import *

def save_url(queries, loc, fe):
	for query in queries:
		raw = simple_get(query['query'])
		with open(loc + query['name'] + fe, 'wb') as file:
			file.write(raw)
