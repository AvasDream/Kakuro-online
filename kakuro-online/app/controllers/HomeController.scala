package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.se.kakuro.Kakuro._
import de.htwg.se.kakuro.model.fieldComponent.FieldImpl.{ Field, FieldCreator }
/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  /**
    * Create an Action to render an HTML page.
    *
    * The configuration in the `routes` file means that this method
    * will be called when the application receives a `GET` request with
    * a path of `/`.
    */


  val generator = new FieldCreator()
  val field = generator.createNewField(8)
  def kakuro() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.kakuro(field.toString()))
  }
  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }
  def introduction() = Action {implicit request: Request[AnyContent] =>
    Ok(views.html.introduction())
  }
  def rules() = Action {implicit request: Request[AnyContent] =>
    Ok(views.html.rule())
  }
}
