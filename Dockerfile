FROM ubuntu
MAINTAINER vigrimme@htwg-konstanz.com
ENV SRC /usr/src
# Install JDK and Scala
RUN uname -a
RUN apt-get update
RUN apt-get install openjdk-8-jdk wget -y
RUN wget http://scala-lang.org/files/archive/scala-2.12.1.deb
RUN dpkg -i scala-2.12.1.deb
RUN apt-get update
RUN apt-get install scala gnupg2 git -y

# Install SBT
RUN echo "deb https://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2EE0EA64E40A89B84B2DF73499E82A75642AC823
RUN apt-get update
RUN apt-get install sbt -y
RUN mkdir /usr/src/kakuro-online
RUN git clone https://github.com/AvasDream/de.htwg.se.kakuro.git /usr/src/kakuro-backend
RUN rm /scala-*
RUN cd /usr/src/kakuro-backend && sbt compile
EXPOSE 9000
