name := """Kakuro-online"""
organization := "com.htwg"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.12"

libraryDependencies += guice
libraryDependencies += "com.typesafe.play" %% "play-json" % "2.6"
libraryDependencies += "com.typesafe.play" %% "play-ws-standalone-json" % "1.1.1"
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "com.htwg.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "com.htwg.binders._"
