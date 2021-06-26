import { UseFilters, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { RoomActionDTO } from "@wewatch/actions";
import { AuthService } from "modules/auth";
import { WsValidationPipe } from "pipes/validation";
import { isHttpException } from "utils/types";

import { RoomService } from "./service";

interface SocketInfo {
  roomId: string;
  userId: string;
}

interface SocketsInfo {
  [key: string]: SocketInfo;
}

@UseFilters(new BaseWsExceptionFilter())
@UsePipes(new WsValidationPipe())
@WebSocketGateway({
  namespace: "rooms",
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly socketsInfo: SocketsInfo;

  constructor(
    private readonly roomService: RoomService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {
    this.socketsInfo = {};
  }

  @WebSocketServer()
  server!: Server;

  async handleConnection(socket: Socket): Promise<void> {
    try {
      const accessToken = this.getAccessToken(socket);
      const { sub } = this.jwtService.verify(accessToken);
      await this.authService.verifyJwtSubject(sub);

      const roomId = this.getRoomId(socket);
      socket.join(roomId);

      this.socketsInfo[socket.id] = {
        roomId,
        userId: sub,
      };
    } catch (e) {
      socket.disconnect();
    }
  }

  getAccessToken(socket: Socket): string {
    const accessToken: string | undefined = socket.handshake.auth?.accessToken;
    if (accessToken === undefined) {
      throw new Error("Access token is not provided");
    }

    return accessToken;
  }

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

  handleDisconnect(socket: Socket): void {
    delete this.socketsInfo[socket.id];
  }

  @SubscribeMessage("actions")
  async onActionEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() action: RoomActionDTO,
  ): Promise<void> {
    const { roomId, userId } = this.socketsInfo[socket.id];

    try {
      const newAction = await this.roomService.handleAction(
        roomId,
        userId,
        action,
      );
      this.server.to(roomId).emit("actions", {
        userId,
        action: newAction,
      });
    } catch (e) {
      if (isHttpException(e)) {
        throw new WsException(e.getResponse());
      }

      throw e;
    }
  }
}
