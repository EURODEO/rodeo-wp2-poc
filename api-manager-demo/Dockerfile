FROM docker.io/python:3.11-alpine
WORKDIR /myapp
ADD * /myapp/
RUN pip install -r requirements.txt
CMD python -u app.py

