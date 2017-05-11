#!/bin/bash

# Show the actual DPM power_level
# If parameter, call amdgpu_setupDPM.sh to change DPM power_level.

bridgefile="/home/spoken/.config/amdgpu_dpm_bridge_file"
dpmvalue=$( cat $bridgefile )


if [ $1 ]; then
    case $dpmvalue in
        "high" ) /home/spoken/.config/polybar/amdgpu_setupDPM.sh 0 ;;
        "low" ) /home/spoken/.config/polybar/amdgpu_setupDPM.sh 1 ;;
        "auto" ) /home/spoken/.config/polybar/amdgpu_setupDPM.sh 0 ;;
    esac
else
    case $dpmvalue in
        "high" ) echo "DPM %{F#ff9b82}" ;;
        "low" ) echo "DPM %{F#92ff8e}" ;;
        "auto" ) echo "DPM %{F#e68eff}" ;;
    esac
fi
