################################################################################
# imports
import sys
import os
import gzip
import shutil

from bs4 import BeautifulSoup
from save import *
from get import *
################################################################################

################################################################################
# constants
################################################################################
base_url = 'http://vlsstats.ifsttar.fr/rawdata/'
src_file = 'velib_source'
loc = '../raw_sets/velib/'
################################################################################
# fns
################################################################################
def get_velib_data_sets():
    raw = simple_get(base_url)
    html = BeautifulSoup(raw, 'html.parser')
    trs = html.find_all('tr')
    indices = []
    queries = []
    for idx, tr in enumerate(trs):
        td = tr.find_all('td')
        if td:
            if td[0].text == 'Paris':
                indices.append(idx)
    for idx in indices:
        link = trs[idx].find_all('a')[1]['href'][1:]
        queries.append({
            'query' : base_url + link,
            'name' : link[link.rindex('/') + 1:]
        })

    save_url(queries=queries, loc=loc, fe='')

def export_gz():
    filenames = os.listdir(loc)
    for name in filenames:
        with gzip.open(loc + name, 'rb') as file_in:
            with open(loc + name[:-3] + '.jjson', 'wb') as file_out:
                shutil.copyfileobj(file_in, file_out)

################################################################################
# calls
################################################################################
# get_velib_data_sets()
export_gz()
