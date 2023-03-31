read -p "Haluatko varmasti poistaa node_modules folderit? " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
    find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
fi
