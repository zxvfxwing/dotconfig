#!/bin/bash

# NEED TO INSTALL wmctrl FIRST

# App to start
windows=(
"vivaldi-stable"
"atom"
"telegram-desktop"
"discord"
"thunar"
"spotify"
"deluge"
"xfce4-terminal"
)

# Which workspace assign
workspaces=(
"2"
"3"
"4"
"4"
"5"
"6"
"10"
"1"
)

owNB=0

for iwin in ${!windows[*]}
do
    while [ "$owNB" -lt "$iwin" ]
    do
        owNB=$(wmctrl -l | wc -l)
    done

    i3-msg workspace ${workspaces[$iwin]}
    ${windows[$iwin]} &
done

sleep 4

# Welcome message
alsi -l > /dev/pts/0
figlet "Bienvenue." > /dev/pts/0

# time boot took
boottime=$(dmesg | tail -n 1 | awk '{print $2}' | sed 's/\]//')
echo "boot time: $boottime secondes."> /dev/pts/0

# check updates
pac=$(checkupdates | wc -l)
aur=$(cower -u | wc -l)
echo "update(s): $pac(pac) - $aur(aur)" > /dev/pts/0

# weather
echo "" > /dev/pts/0
curl "fr.wttr.in/Marseille?1" > /dev/pts/0
