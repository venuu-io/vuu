package org.finos.vuu.viewport

import org.finos.vuu.api._
import org.finos.vuu.core.table.{Columns, TableContainer}
import org.finos.vuu.provider.{JoinTableProviderImpl, MockProvider, ProviderContainer}
import org.finos.toolbox.jmx.MetricsProvider
import org.finos.toolbox.lifecycle.LifecycleContainer
import org.finos.toolbox.time.Clock
import org.joda.time.LocalDateTime

object OrdersAndPricesScenarioFixture {

  def setup()(implicit lifecycleContainer: LifecycleContainer, timeProvider: Clock, metrics : MetricsProvider) = {

    val dateTime = new LocalDateTime(2015, 7, 24, 11, 0).toDateTime.toInstant.getMillis

    val ordersDef = TableDef(
      name = "orders",
      keyField = "orderId",
      columns = Columns.fromNames("orderId:String", "trader:String", "ric:String", "tradeTime:Long", "quantity:Double"),
      joinFields =  "ric", "orderId")

    val pricesDef = TableDef("prices", "ric", Columns.fromNames("ric:String", "bid:Double", "ask:Double", "last:Double", "open:Double", "close:Double"), "ric")

    val joinDef = JoinTableDef(
      name          = "orderPrices",
      baseTable     = ordersDef,
      joinColumns   = Columns.allFrom(ordersDef) ++ Columns.allFromExcept(pricesDef, "ric"),
      joins  =
        JoinTo(
          table = pricesDef,
          joinSpec = JoinSpec( left = "ric", right = "ric", LeftOuterJoin)
        ),
      joinFields = Seq()
    )

    val joinProvider   = JoinTableProviderImpl()

    val tableContainer = new TableContainer(joinProvider)

    val orders = tableContainer.createTable(ordersDef)
    val prices = tableContainer.createTable(pricesDef)
    val orderPrices = tableContainer.createJoinTable(joinDef)

    val ordersProvider = new MockProvider(orders)
    val pricesProvider = new MockProvider(prices)

    val providerContainer = new ProviderContainer(joinProvider)

    val viewPortContainer = new ViewPortContainer(tableContainer, providerContainer)

    //val viewPortContainer = setupViewPort()

    //joinProvider.start()

    (joinProvider, orders, prices, orderPrices, ordersProvider, pricesProvider, viewPortContainer)
  }

}
