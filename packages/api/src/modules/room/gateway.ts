import { UseFilters, UsePipes } from "@nestjs/common";
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { RoomActionDTO } from "@wewatch/actions";
import { WsValidationPipe } from "pipes/validation";
import { isHttpException } from "utils/types";

import { RoomService } from "./service";

@UseFilters(new BaseWsExceptionFilter())
@UsePipes(new WsValidationPipe())
@WebSocketGateway({
  namespace: "rooms",
})
export class RoomGateway implements OnGatewayConnection {
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer()
  server!: Server;

  getRoomId(socket: Socket): string {
    const roomId = socket.handshake.query?.roomId;

    if (roomId === undefined) {
      throw new Error("roomId is not provided");
    }

    if (typeof roomId === "string") {
      return roomId;
    }

    return roomId[0];
  }

  handleConnection(socket: Socket): void {
    try {
      const roomId = this.getRoomId(socket);
      socket.join(roomId);
    } catch {
      socket.disconnect();
    }
  }

  @SubscribeMessage("actions")
  async onActionEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() action: RoomActionDTO,
  ): Promise<void> {
    const roomId = this.getRoomId(socket);

    try {
      const newAction = await this.roomService.handleAction(roomId, action);
      this.server.to(roomId).emit("actions", newAction);
    } catch (e) {
      if (isHttpException(e)) {
        throw new WsException(e.getResponse());
      }

      throw e;
    }
  }
}
