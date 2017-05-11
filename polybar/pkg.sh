#!/bin/bash
pac=$(checkupdates | wc -l)
aur=$(cower -u | wc -l)

check=$((pac + aur))
if [[ "$check" != "0" ]]; then
    echo "$pac %{F#fc7a00}%{F-} $aur"
else
    echo "$pac %{F#606060}%{F-} $aur"
fi
