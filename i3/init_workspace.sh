#!/bin/bash

# NEED TO INSTALL wmctrl FIRST

# App to start
windows=(
"vivaldi-stable"
"atom"
"telegram-desktop"
"thunar"
"spotify"
"deluge"
"gnome-terminal"
)

# Which workspace assign
workspaces=(
"2"
"3"
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
        owNB=$(wmctrl -l > owindows && wc -l owindows | awk '{ print $1 }')
    done

    i3-msg workspace ${workspaces[$iwin]}
    ${windows[$iwin]} &
done
