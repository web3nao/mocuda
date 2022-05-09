#!/bin/bash

wad=$(seth --to-word $(seth --to-wei 2841520000000000000000 eth))
zzz=$(seth --to-word 1651686942 | sed 's/0x//')
wat=$(seth --from-ascii ETHUSD | sed 's/0x//')
hash=$(seth keccak "$wad$zzz$wat")

echo hash
