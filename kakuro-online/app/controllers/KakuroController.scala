package controllers

import javax.inject._

import play.api.mvc._
import de.htwg.se.kakuro.model.fileIOComponent.fileIOJsonImpl
import com.google.inject.Guice
import de.htwg.se.kakuro.controller.controllerComponent.ControllerInterface
import de.htwg.se.kakuro.KakuroModule
import de.htwg.se.kakuro.model.fieldComponent.{CellInterface, FieldInterface}
import play.api.Logger
import play.api.libs.json.{JsNumber, JsObject, Json, Writes}
/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class KakuroController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  // Best practice logging
  // val logger: Logger = Logger(this.getClass())
  val injector = Guice.createInjector(new KakuroModule)
  val controller = injector.getInstance(classOf[ControllerInterface])
  controller.initField
  controller.set(1,1,9)
  Logger.info("Hello World")
  val field = controller.getField
  val height = field.height
  val width = field.width

  val helper = new helper
  val jsonField = helper.gridToJson(field);
  def kakuro() = Action {implicit request: Request[AnyContent] =>
    Ok(views.html.test(jsonField))
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
}