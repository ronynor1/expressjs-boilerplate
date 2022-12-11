FROM 706795323543.dkr.ecr.eu-west-1.amazonaws.com/node:latest
WORKDIR /src/
COPY . .
RUN npm install

EXPOSE 8080
CMD [ "node", "index.js" ]
