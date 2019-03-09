#!/bin/bash

# Converts all the images

for f in _images/backgrounds/*; 
do 
  name=${f#_}
  name=${name%.*}
  # convert $f -background "#FFFFFF" -flatten ./$name.jpg
  convert $f -resize 1600x -quality 50 ${name}.jpg
done

for f in _images/icons/*; 
do 
  name=${f#_}
  name=${name%.*}
  convert $f  -background "#FFFFFF" -flatten -resize 200x -quality 50 ${name}.jpg
done

for f in _images/logos/*; 
do 
  name=${f#_}
  # compressed
  convert $f -quality 80 ${name}
done

for f in _images/logos/*.png; 
do 
  name=${f#_}
  name=${name%.*}
  # flatterned
  convert $f  -background "#FFFFFF" -flatten -resize 200x -quality 80 ${name}.jpg
done