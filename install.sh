mkdir -p $HOME/goepserver
cp -r ./tools/* $HOME/goepserver/
sudo cp -r ./dist/goepserver-linux-amd64 /usr/bin/goepserver
echo "GoEPServer installed successfully!"
echo "You can now run GoEPServer using the command: goepserver"
echo "tools are available in $HOME/goepserver"