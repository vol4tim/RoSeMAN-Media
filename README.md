# Robonomics Sensors Measure Analytics and Archive Node (RoSeMAN)

node.js software with substrate blockchain media data collector function!

## Running with Node.js

You need to clone the repository.

```bash
$ git clone https://github.com/vol4tim/RoSeMAN-Media.git
```

Create configuration files.

```bash
$ cp config/config.template.json config.json
$ cp config/agents.template.json agents.json
```

!!! The work requires the Mongodb Database server.

If necessary, change access to the database in the configuration file `/config/config.json`.

Make a white list of addresses, parachane accounts, from which we will collect data in the `/config/agents.json` file.

Install requirements.

```bash
$ yarn install
```

## Building

```bash
$ yarn build
```

## Run server

```bash
$ yarn start
```

Web server launched at http://127.0.0.1:3000

## Bug Reports

See https://github.com/vol4tim/RoSeMAN-Media/issues

## Learn

[Wiki](https://wiki.robonomics.network/)
