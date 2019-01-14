package controllers

import javax.inject._

import play.api.mvc._
import com.google.inject.Guice
import de.htwg.se.kakuro.controller.controllerComponent.ControllerInterface
import de.htwg.se.kakuro.KakuroModule
import de.htwg.se.kakuro.model.fieldComponent.{CellInterface, FieldInterface}
import play.api.Logger
import play.api.libs.json._
/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class KakuroController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  val injector = Guice.createInjector(new KakuroModule)
  val controller = injector.getInstance(classOf[ControllerInterface])
  val helper = new helper;

  def kakuro = Action {implicit request: Request[AnyContent] =>
    controller.initField
    var states = helper.getCellType(controller.getField)
    Ok(views.html.test(states))
  }

  def initGame = Action {
    controller.initField
    val jsonField = helper.gridToJson(controller.getField).toString()
    printf("%s",jsonField.toString())
    Ok(jsonField)
  }

  def setValue(row: Int, col: Int, value: Int) = Action {
    controller.set(row, col, value)
    val jsonField = helper.gridToJson(controller.getField).toString()
    printf("%s",jsonField.toString())
    Ok(jsonField)
  }

  def undoGame = Action {
    controller.undo
    val jsonField = helper.gridToJson(controller.getField).toString()
    printf("%s",jsonField.toString())
    Ok(jsonField)
  }

  def redoGame = Action {
    controller.redo
    val jsonField = helper.gridToJson(controller.getField).toString()
    printf("%s",jsonField.toString())
    Ok(jsonField)
  }

  def saveGame = Action {
    controller.save
    val jsonField = helper.gridToJson(controller.getField).toString()
    printf("%s",jsonField.toString())
    Ok(jsonField)
  }

  def loadGame = Action {
    controller.load
    val jsonField = helper.gridToJson(controller.getField).toString()
    printf("%s",jsonField.toString())
    Ok(jsonField)
  }

  def clearValue(row: Int, col: Int) = Action {
    controller.clear(row, col)
    val jsonField = helper.gridToJson(controller.getField).toString()
    printf("%s",jsonField.toString())
    Ok(jsonField)
  }
}


class helper() {

  def gridToJson(grid: FieldInterface): JsObject = {
    Json.obj(
      "grid" -> Json.obj(
        "width" -> JsNumber(grid.width),
        "height" -> JsNumber(grid.height),
        "cells" -> Json.toJson(
          for {
            row <- 0 until grid.width
            col <- 0 until grid.height
          } yield {
            Json.obj(
              "row" -> row,
              "col" -> col,
              "cell" -> Json.toJson(grid.cell(row, col))
            )
          }
        )
      )
    )
  }
  implicit val cellWrites: Writes[CellInterface] {
    def writes(cell: CellInterface): JsObject
  } = new Writes[CellInterface] {

    def writes(cell: CellInterface): JsObject = Json.obj(
      "value" -> cell.value,
      "right" -> cell.rightSum,
      "down" -> cell.downSum,
      "type" -> { if (cell.isWhite) 1 else if (cell.isBlack) 2 else 0 }
    )
  }

  def getCellType(grid: FieldInterface): scala.collection.mutable.Map[String, Int] = {
    var states = scala.collection.mutable.Map[String, Int]()
    for {
      row <- 0 until grid.width
      col <- 0 until grid.height
    } yield {
      if(grid.isWhite(row, col)) {
        states += (row.toString + "." + col.toString -> 1)
      }else if(grid.isBlack(row, col)){
        states += (row.toString + "." + col.toString -> 2)
      }else{
        states += (row.toString + "." + col.toString -> 0)
      }
    }
    states
  }
}