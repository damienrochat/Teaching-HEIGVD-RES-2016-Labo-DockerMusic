FROM node:4.3.1

MAINTAINER Damien Rochat <damien.rochat@heig-v.ch>
MAINTAINER Kevin Ponce <kevin.ponce@heig-v.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/app/

ENTRYPOINT ["node", "/opt/app/musician.js"]