#!/usr/bin/env bash

rm -rf flats/*

./node_modules/.bin/truffle-flattener contracts/airdropper/MintableAirdropper.sol > flats/MintableAirdropper.sol
./node_modules/.bin/truffle-flattener contracts/airdropper/TransferableAirdropper.sol > flats/TransferableAirdropper.sol
./node_modules/.bin/truffle-flattener contracts/ZTX.sol > flats/ZTX.sol
