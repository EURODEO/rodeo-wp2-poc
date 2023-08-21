from flask import Flask, request, abort, make_response
import urllib
import json

urldictionary = {
    "id": urllib.parse.urlparse("https://wis2-pilot.imgw.pl/oapi/collections/urn:x-wmo:md:pol.poland:surface-weather-observations?f=json")
}

iddictionary = dict()

for id in urldictionary:
    url = urldictionary[id]
    print(url)
    parsed = url.scheme + '://' + url.netloc + url.path
    iddictionary.update({parsed:id})

print(iddictionary)

BASE_URL = 'http://localhost:5000'

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

def mapLink(str):
    print(str)
    if str in iddictionary:
        return BASE_URL + '/' + iddictionary[str]
    splitted = str.rpartition("/")
    if len(splitted[0]) == 0:
        return str
    return mapLink(splitted[0]) + '/' + splitted[2]
    
def mapLinks(obj):
    href = obj['href'].partition('?')
    obj['href'] = mapLink(href[0]) + '?' + href[2]
    return obj

def getRealLink(id):
    if id not in urldictionary:
        return None
    return urldictionary[id]

def getData(id, path, queryargs):
    url = getRealLink(id)
    if url == None:
        abort(404)

    querystring = urllib.parse.parse_qs(url.query).copy()
    querystringToAdd = queryargs.copy()
    for key in querystringToAdd:
        querystring[key] = querystringToAdd[key]
    
    url = url._replace(query = urllib.parse.urlencode(querystring, doseq=True))
    if len(path) > 0:
        url = url._replace(path = url.path + '/' + path)
    
    print(urllib.parse.urlunparse(url))
    print(url)
    
    req = urllib.request.urlopen(urllib.parse.urlunparse(url))
    data = json.loads((req).read())
    
    if 'links' in data:
        data['links'] = list(map(mapLinks, filter(typeIsValid, data['links'])))
    
    resp = make_response(json.dumps(data))
    resp.content_type = req.getheader('Content-Type')
    return resp


if __name__ == '__main__':
    app.debug = True
    print("Hello, World!")
    app.run(host='0.0.0.0', port=5000)