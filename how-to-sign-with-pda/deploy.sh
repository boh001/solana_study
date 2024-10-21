#!/bin/bash

# Build the project
cargo build-bpf

# Deploy the program
cd .. && solana program deploy target/deploy/how_to_sign_with_pda.so

