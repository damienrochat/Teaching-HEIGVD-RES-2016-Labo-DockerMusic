FROM node:4.3.1

MAINTAINER Damien Rochat <damien.rochat@heig-v.ch>
MAINTAINER Kevin Ponce <kevin.ponce@heig-v.ch>

WORKDIR /opt/app

COPY src .

RUN npm install

ENTRYPOINT ["node", "auditor.js"]