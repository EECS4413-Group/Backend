FROM python:3.10.6 AS base

RUN apt update -qq

WORKDIR /app

ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt

ADD ./ ./

