FROM node:3.12.11-alpine3.22

WORKDIR /app

COPY 

RUN -m venv venv
RUN pip install requirement.txt

COPY . .