#!/bin/bash

# Specifying the icon(s) in the script
# This allows us to change its appearance conditionally
icon=""
icon_vlc=""
icon_spotify=""

player_status=$(playerctl status 2> /dev/null)
if [[ $? -eq 0 ]]; then
    artist="$(playerctl metadata artist) - "
    title="$(playerctl metadata title)"

    app="$(playerctl -l)"

    if [[ $app = "vlc" ]]; then
        icon=$icon_vlc
        metadata="$title"
    elif [[ $app = "spotify" ]]; then
        icon=$icon_spotify
        metadata="$artist$title"
    fi
fi

# Foreground color formatting tags are optional
if [[ $player_status = "Playing" ]]; then
    echo "%{F#9fdda4}$icon  $metadata"
elif [[ $player_status = "Paused" ]]; then
    echo "%{F#8c8c8c}$icon  $metadata"
else
    echo ""
fi
