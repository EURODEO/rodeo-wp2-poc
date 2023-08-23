FROM docker.io/python:3.11-alpine
WORKDIR /myapp
ADD * /myapp/
RUN pip install -r requirements.txt
CMD waitress-serve --host 0.0.0.0 --port 5000 app:app

