FROM node:alpine

COPY ./ /app
WORKDIR /app
RUN npm install --global textlint && \
    npm install --loglevel=error --no-optional
ENTRYPOINT [ "npm", "test" ]
