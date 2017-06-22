#!/bin/bash

# Select the adapter name for grep
adapterName="PCI adapter"

# Real number of row you want to pick after the grep match
# i.e :
# one for RPM
# second one for GPU Temp
nbRow=2

gpuInformation=$( sensors | grep -A 2 "PCI adapter" | tail -n 2 | awk '{ print $2 }' | sed -e 's/[+°C]//g' -e 's/\..*//g' )

infoArray=($gpuInformation)

length=${#infoArray[*]}

if [ "$length" = 1 ]; then
    index=0
else
    index=1
fi

# Define constants :
degree="°C"
temperaturesValues=(50 60 70 75 80 100)
temperaturesColors=("#6bff49" "#f4cb24" "#ff8819" "#ff3205" "#f40202" "#ef02db")

for iTemp in ${!temperaturesValues[*]}
do
    if (( "${infoArray[$index]}" < "${temperaturesValues[$iTemp]}" )); then
        temp="%{F${temperaturesColors[$iTemp]}}${infoArray[$index]}"
        break
    fi
done

DPM=$( /home/spoken/.config/polybar/amddpm.sh )

if [ "$length" = 2 ]; then
    maxRPM=3150
    percentage=$(( $(( ${infoArray[0]} * 100))  / $maxRPM ))
    #echo "GPU $temp$degree %{F-}RPM:$percentage% $DPM"
    echo "GPU $temp$degree %{F-}$DPM"
else
    echo "GPU $temp$degree %{F-}$DPM"
fi
