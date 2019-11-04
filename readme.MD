# fb2iCal

This app allows you to download *iCal* calendar files from Facebook URL / event number.

You can use it as a service at [https://fb2ical.ondrejsynacek.com](https://fb2ical.ondrejsynacek.com) or use this repository to launch your own instance.

The page that is served by the app uses a service worker and can be used offline and installed as PWA (Progressive Web App).

## Development

It can run in environment with NodeJS 10 installed. It does not use Facebook API for retrieving information, instead it relies on crawling and scraping event URL. This means that it can stop working or the results might not be reliable so use this at your own risk.

Run development server: `npm run start:dev`.

Run development server with debugger `npm run start:dev:inspect`.

### Static assets

There is no clever way to invalidate static assets (HTML, CSS, JS), so if you make any changes, just increment query parameters in view template(s) and service worker. Changing service worker should trigger new _update_ event that should also re-fetch new assets.

Sorry I wanted to keep the app simple so this is done manually. No big deal for me though.

## Deployment

The command `npm run start` will start the server in production mode. 

The app can be run as stateless and does not need any persistent storage.

The app is automatically set up to create logs in `logs/` directory each day but it's up to your environment if the file system is persisted.

### HTTPS

App contains middleware that will redirect all traffic to HTTPS if the requests contain header `X-FORWARDED-PROTO`. For this to work, the middleware has to be enabled by setting environment variable `ENFORCE_HTTPS` to value `1`.

There are environment variables for setting pu SSL certificate from Let's Encrypt (acme challenge): `CERT_ENDPOINT` and `CERT_SECRET`.

This way you can set up the endpoint that will reply with secret and this should allow you to generate key pairs.

