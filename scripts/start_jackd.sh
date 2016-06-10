#!/usr/bin/env bash

#/usr/local/bin/jackd -p128 -dalsa -dhw:1,0 -p2048 -r32000 -s -P
#/usr/local/bin/jackd -p128 -dalsa -dhw:0,0 -p2048 -r32000 -s -P
#/usr/local/bin/jackd -P75 -dalsa -dhw:1,0 -p2048 -n3 -s -r32000
/usr/local/bin/jackd -Rv -d alsa -d hw:1,0 -p2048 -n3 -s -r32000
