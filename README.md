# IOTA CLI Wallet

Command line interface (CLI) app that acts as an IOTA wallet and node management tool., modded by raxy

## Installation

You need:
1. [Node.js](https://nodejs.org) installed on your matching.  
1. A functioning [IOTA node](https://github.com/iotaledger/iri) to connect to.  The IOTA node can be on the same computer as the CLI, but the CLI can work with remote nodes as well 

To install:
`npm install`

## Usage

After installing, execute the CLI:

`nodejs index.js`

This will connect to a node on the same computer as the CLI by default.  If your node is in another location use the `node` command to switch to the remote computer.  Make sure the remote node is configured to allow remote connections.

For a list of all the commands available in the CLI use `help`.
