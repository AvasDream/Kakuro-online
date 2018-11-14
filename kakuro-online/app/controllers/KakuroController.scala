package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.se.kakuro.Kakuro._
import de.htwg.se.kakuro.model.fieldComponent.FieldImpl.{ Field, FieldCreator }
import com.google.inject.Guice
import de.htwg.se.kakuro.controller.controllerComponent.ControllerInterface
import de.htwg.se.kakuro.KakuroModule
import de.htwg.se.kakuro.aview.Tui

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class KakuroController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {


  val injector = Guice.createInjector(new KakuroModule)
  val controller = injector.getInstance(classOf[ControllerInterface])
  val tui = new Tui(controller)
  val string = tui.toString()
  def kakuro() = Action {implicit request: Request[AnyContent] =>
    Ok(views.html.test(string))
  }
}
