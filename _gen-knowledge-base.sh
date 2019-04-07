#!/bin/bash
echo "Enter the name of the topic [e.g. Foam roller]:"
read title
# $(date +"%Y-%m-%d-")
name=$(echo $title | tr '[:upper:]' '[:lower:]' | sed "s/ /-/g")
filename=_info/$name.md

if [ -f "$filename" ]
then
  echo "$filename already exists"
  exit
fi

echo "---" > $filename
echo "title: '$title'" >> $filename
echo "keywords: '$title'" >> $filename
echo "description: 'ADD SHORT DESCRIPTION HERE (10-20 words)'" >> $filename
echo "image: '/images/knowledge-base/$name.jpg'" >> $filename
echo "---" >> $filename
echo "ADD FULL DESCRIPTION HERE..." >> $filename

echo "Please fill in the details in: _info/$filename"

git add $filename
echo "The file has been added to your Git repo"
