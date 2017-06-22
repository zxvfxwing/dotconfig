#!/bin/bash

# $1 == Device
# $3 == kB_read/s
# $4 == kB_wrtn/s

iostats=$(dstat -d 1 999999 | awk '{ print $1" "$3 }')
ioTab=($iostats);

echo $iostats

tabSymbols=("▁" "▂" "▃" "▄" "▅" "▆" "▇" "█")
tabValues=("10" "50" "100" "500" "1000" "10000" "100000" "1000000")

tmpEcho=""

# loop each 3 times
for ((index=0;index < ${#ioTab[*]};index+=3))
{
    echo ${ioTab[$index]}
    echo ${ioTab[$index+1]}
    echo ${ioTab[$index+2]}
}

exit 0
