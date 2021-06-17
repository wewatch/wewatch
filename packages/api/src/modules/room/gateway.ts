import { UseFilters } from "@nestjs/common";
import {
  BaseWsExceptionFilter,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  namespace: "rooms",
})
export class RoomGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    const roomId: string | string[] | undefined =
      client.handshake.query?.roomId;

    if (roomId === undefined) {
      client.disconnect(true);
    }
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage("actions")
  async onEvent(client: Socket, data: string): Promise<Record<string, string>> {
    // console.log(`>>> ${JSON.stringify(client.handshake.query)}`);
    // console.log(data);
    // console.log(typeof data);
    // return {
    //   event: "actions",
    //   data: data,
    // };
    throw new WsException("nope");
  }
}
