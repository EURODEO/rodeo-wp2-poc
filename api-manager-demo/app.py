from flask import Flask, request, abort, make_response
from elasticsearch import Elasticsearch, exceptions
import urllib
import json
import os

BASE_URL = os.environ["BASE_URL"]
ELASTICSEARCH_URL = os.environ["ELASTICSEARCH_URL"]
ELASTICSEARCH_TOKEN = os.environ["ELASTICSEARCH_TOKEN"]
DEFAULT_QUERY_PARAMETERS = {'f': 'json'}

client = Elasticsearch(ELASTICSEARCH_URL, bearer_auth=ELASTICSEARCH_TOKEN)

app = Flask(__name__)

@app.route('/<id>', methods=['GET'])
def withoutpath(id):
    print(request.path, id, request.args)
    return getData(id, '', request.args)

@app.route('/<id>/<path:path>', methods=['GET'])
def withpath(id, path):
    print(request.path, id, request.args, path)
    return getData(id, path, request.args)

def typeIsValid(obj):
    if 'rel' in obj and obj['rel'] == 'root':
        return False
    if 'type' in obj:
        if obj['type'] == 'application/json' or obj['type'] == 'application/ld+json' or obj['type'] == 'application/geo+json':
            return True
    return False

def mapLinkObj(obj, hits):
    possibleHits = list(filter(lambda hit: obj['href'].startswith(hit['_source']['href']) ,hits))
    if len(possibleHits) == 0:
        return obj
    possibleHits.sort(key=lambda hit: -len(hit['_source']['href']))
    obj['href'] = obj['href'].replace(possibleHits[0]['_source']['href'], BASE_URL + '/' + possibleHits[0]['_id'])
    return obj
    
def mapLinks(items, id):
    metadataHits = client.search(index="metadata_collection", query={"match":{"original_metadata_id":id}})['hits']['hits']
    return list(map(lambda x: mapLinkObj(x, metadataHits), items))

def getRealLink(id):
    try:
        # TODO: add check if platform is correct
        result = client.get(index="metadata_collection", id=id)
        return (result["_source"]['href'], result["_source"]["original_metadata_id"])
    except exceptions.NotFoundError:
        return (None, None)
    
def addQueryDictToQueryString (mutable, toBeAdded):
    for key in toBeAdded:
        mutable[key] = toBeAdded[key]

def replaceEverything (str: str, id: str) -> str:
    metadataHits = client.search(index="metadata_collection", query={"match":{"original_metadata_id":id}})['hits']['hits'] # TODO Now this is called twice
    metadataHits.sort(key=lambda hit: -len(hit['_source']['href']))
    res = "testitesti " + json.dumps(metadataHits) #str
    for hit in metadataHits:
        str = str.replace(hit['_source']['href'], BASE_URL + '/' + hit['_id'])
    return res

def getData(id, path, queryargs):
    url, metadataId = getRealLink(id)
    if url == None:
        abort(404)

    url = urllib.parse.urlparse(url)

    querystring = DEFAULT_QUERY_PARAMETERS.copy()
    addQueryDictToQueryString(querystring, urllib.parse.parse_qs(url.query))
    addQueryDictToQueryString(querystring, queryargs)
    
    url = url._replace(query = urllib.parse.urlencode(querystring, doseq=True))
    if len(path) > 0:
        url = url._replace(path = url.path + '/' + path)
    
    req = urllib.request.urlopen(urllib.parse.urlunparse(url))
    data = json.loads((req).read())
    
    if 'links' in data:
        data['links'] = mapLinks(filter(typeIsValid, data['links']), metadataId)
    
    resp = make_response(replaceEverything(json.dumps(data), metadataId))
    resp.content_type = req.getheader('Content-Type')
    return resp
