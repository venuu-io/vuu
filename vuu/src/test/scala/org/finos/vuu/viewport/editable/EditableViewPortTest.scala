package org.finos.vuu.viewport.editable

import org.finos.toolbox.jmx.MetricsProvider
import org.finos.toolbox.lifecycle.LifecycleContainer
import org.finos.toolbox.time.Clock
import org.finos.vuu.api._
import org.finos.vuu.core.VuuServer
import org.finos.vuu.core.module.ModuleFactory.stringToString
import org.finos.vuu.core.module.{StaticServedResource, TableDefContainer, ViewServerModule}
import org.finos.vuu.core.table._
import org.finos.vuu.net.ClientSessionId
import org.finos.vuu.net.rest.RestService
import org.finos.vuu.net.rpc.RpcHandler
import org.finos.vuu.provider.{JoinTableProviderImpl, MockProvider, Provider, ProviderContainer}
import org.finos.vuu.util.OutboundRowPublishQueue
import org.finos.vuu.viewport._
import org.scalatest.GivenWhenThen
import org.scalatest.matchers.should.Matchers

abstract class EditableViewPortTest extends AbstractViewPortTestCase with Matchers with GivenWhenThen {

  final val TEST_TIME = 1450770869442L
  //final val clock: Clock = new TestFriendlyClock(TEST_TIME)
  //var counter: Int = 0

  def createViewServerModule(theName: String): ViewServerModule = {
    new ViewServerModule {
      override def name: String = theName
      override def tableDefContainer: TableDefContainer = ???
      override def tableDefs: List[TableDef] = ???
      override def serializationMixin: AnyRef = ???
      override def rpcHandlersUnrealized: List[VuuServer => RpcHandler] = ???
      override def getProviderForTable(table: DataTable, viewserver: VuuServer)(implicit time: Clock, lifecycleContainer: LifecycleContainer): Provider = ???
      override def staticFileResources(): List[StaticServedResource] = ???
      override def restServicesUnrealized: List[VuuServer => RestService] = ???
      override def viewPortDefs: Map[String, (DataTable, Provider, ProviderContainer, TableContainer) => ViewPortDef] = ???
    }
  }

  def createRpcHandlerInstruments(mockProvider: MockProvider, tableContainer: TableContainer, clock: Clock): RpcHandler = {
    new RpcHandler {

      final val BASE_BASKET_TABLE = "basketOrders"

      def createBasket(selection: ViewPortSelection, sessionId: ClientSessionId): ViewPortAction = {

        val baseTable = tableContainer.getTable(BASE_BASKET_TABLE)

        val sessionTable = tableContainer.createSimpleSessionTable(baseTable, sessionId)

        val rows = selection.rowKeyIndex.keys.map(selection.viewPort.table.pullRow(_)).toList

        rows.foreach(row => {

          counter += 1
          val ric = row.get("ric")
          val currency = row.get("currency")
          val exchange = row.get("exchange")
          val clOrderId = "clOrderId-" + clock.now() + "-" + (counter)

          val dataMap = Map(
            "clientOrderId" -> clOrderId,
            "ric" -> ric,
            "currency" -> currency,
            "lastModifiedTime" -> clock.now(),
            "exchange" -> exchange
          )

          sessionTable.processUpdate(clOrderId, RowWithData(clOrderId, dataMap), clock.now())
        })

        OpenDialogViewPortAction(ViewPortTable(sessionTable.name, baseTable.getTableDef.getModule().name))
      }

      override def menuItems(): ViewPortMenu = ViewPortMenu("Test Menu",
        new SelectionViewPortMenuItem("Create Basket", "", this.createBasket, "CREATE_BASKET")
      )
    }
  }

  //final val TEST_TIME = 1450770869442L
  var counter: Int = 0

  def setupEditableTableInfra()(implicit clock: Clock, metrics: MetricsProvider, lifecycle: LifecycleContainer): (ViewPortContainer, DataTable, MockProvider, ClientSessionId, OutboundRowPublishQueue, DataTable, TableContainer) = {

    val module = createViewServerModule("TEST")

    val processDef = TableDef(
      name = "constituent",
      keyField = "id",
      columns = Columns.fromNames("id".string(), "name".string(), "uptime".long(), "status".string()),
      VisualLinks(),
      joinFields = "id"
    )

    val fixSequenceDef = TableDef(
      name = "instrument",
      keyField = "ric",
      columns = Columns.fromNames("ric:String", "description:String")
    )

    val pricesDef = TableDef(
      name = "prices",
      keyField = "ric",
      columns = Columns.fromNames("ric:String", "bid:Long", "ask:Long")
    )

    processDef.setModule(module)
    fixSequenceDef.setModule(module)

    val joinProvider = JoinTableProviderImpl()

    val tableContainer = new TableContainer(joinProvider)

    val process = tableContainer.createTable(processDef)
    val fixSequence = tableContainer.createTable(fixSequenceDef)

    val processProvider = new MockProvider(process)

    val providerContainer = new ProviderContainer(joinProvider)
    val viewPortContainer = setupViewPort(tableContainer, providerContainer)

    joinProvider.start()
    joinProvider.runOnce()

    val session = ClientSessionId("sess-01", "chris")

    val outQueue = new OutboundRowPublishQueue()

    (viewPortContainer, process, processProvider, session, outQueue, fixSequence, tableContainer)

  }

  def createViewPortDefFunc(tableContainer: TableContainer, rpcHandler: RpcHandler, clock: Clock): (DataTable, Provider, ProviderContainer, TableContainer) => ViewPortDef = {
    val func = (t: DataTable, provider: Provider, pc: ProviderContainer, table: TableContainer) => ViewPortDef(t.getTableDef.columns, rpcHandler)
    func
  }

}
