# Kakuro-online


### Setup with Docker

Clone Repository in the directory *root* of your Operating System (C:// or /).

Example for *Windows*:

`git clone https://github.com/AvasDream/Kakuro-online.git`

Open Bash/Powershell and change to the `Kakuro-online`

`cd /kakuro-online`

Build Docker Image, this may take a while! Go and get a Coffe.

`docker build  -t playframework:docker-play .`

Start Docker Image and mount direcotry of your *local* kakuro-online

folder in the docker container in `usr/src/kakuro-online`.

`docker run -it -p 9000:9000 -v c:/kakuro-online:/usr/src/kakuro-online  playframework:docker-play`

Explanation of the Flags:

`-it` Run interactive shell

`-p 9000:9000` Map Port 9000 from Docker Container to Port 9000 of Host system.

`-v c:/kakuro-online:/usr/src/kakuro-online`

Mount your local kakuro-online version at `c:/kakuro-online` in Container at `/usr/src/kakur-online`.

*All the next steps are from the Bash shell inside of your docker Container!!!*

`cd /usr/src/kakuro-online/kakuro-online && sbt run`

Build the Kakuro Online Project.

After this you can change the files on your local system and the changes will be reflected into the docker container.

So programm the project on your local system and build it in the docker container.


THE END ingnore below instructions!

Now we need to save our Docker Container as Image so we dont have to build all the dependencys again the next time we run the container.

Open a new Bash/Powershell Terminal and type `docker ps`
You should see exactly one Container running. Copy the `Container ID` to your clipboard.

`docker commit <CONTAINER_ID> playframework:FinishedInit_V0.1`

After this close the old container and run new instance with

`docker run -it -p 9000:9000 -v c:/kakuro-online:/usr/src/kakuro-online  playframework:FinishedInit_V0.1`
