# AskGemini

This project is a command-line tool for interacting with the Gemini protocol.

## Installation

```

```

## Usage

```
askgemini [flags] <command> [arguments]
```

### Commands

* `help`: Display help information.
* `version`: Display the version of the tool.
* `fetch`: Fetch a Gemini document.
* `browse`: Browse a Gemini document in a pager.
* `search`: Search for Gemini documents.
* `certify`: Generate a certificate for a Gemini server.

### Flags

* `-config`: Path to the configuration file.
* `-debug`: Enable debug logging.
* `-help`: Display help information.
* `-version`: Display the version of the tool.

## Configuration

The configuration file is a YAML file that contains the following settings:

```yaml
# The default certificate file.
certificate: ~/.gemini/cert.pem

# The default key file.
key: ~/.gemini/key.pem

# The default user agent.
user_agent: AskGemini/1.0

# The default timeout for requests.
timeout: 10s

# The default number of retries for requests.
retries: 3

# The default proxy server.
proxy: ""
```

