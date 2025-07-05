mkdir -p $HOME/goepserver
chmod +x ./build.sh
./build.sh
sudo cp -r ./goepserver-linux-amd64 /usr/bin/goepserver
echo "GoEPServer installed successfully!"
echo "You can now run GoEPServer using the command: goepserver"
echo "tools are available in $HOME/goepserver"