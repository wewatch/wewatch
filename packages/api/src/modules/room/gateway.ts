import { UseFilters, UsePipes } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
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

import { RoomActionDTO } from "@wewatch/common/actions/room";
import { MemberEventPayload } from "@wewatch/common/schemas/constants";
import { AuthService } from "modules/auth";
import { WsValidationPipe } from "pipes/validation";
import { isHttpException } from "utils/types";

import { RoomService } from "./service";

interface SocketInfo {
  roomId: string;
  userId: string;
}

@UseFilters(new BaseWsExceptionFilter())
@UsePipes(new WsValidationPipe())
@WebSocketGateway({
  namespace: "rooms",
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly socketsInfo: Record<string, SocketInfo>;

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
      const user = await this.authService.verifyJwtSubject(sub);

      const roomId = this.getRoomId(socket);
      socket.join(roomId);
      await this.roomService.handleUserJoinRoom(roomId, user);

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

  async handleDisconnect(socket: Socket): Promise<void> {
    const { roomId, userId } = this.socketsInfo[socket.id];
    await this.roomService.handleUserLeaveRoom(roomId, userId);
    delete this.socketsInfo[socket.id];
  }

  @SubscribeMessage("actions")
  async onActionEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() action: RoomActionDTO,
  ): Promise<void> {
    const { roomId, userId } = this.socketsInfo[socket.id];

    try {
      const newAction = await this.roomService.handleAction(roomId, action);
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

  @OnEvent("room.actions")
  onBackendActionEvent({
    roomId,
    action,
  }: {
    roomId: string;
    action: RoomActionDTO;
  }): void {
    this.server.to(roomId).emit("actions", {
      userId: null,
      action,
    });
  }

  @SubscribeMessage("members")
  async onMemberEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: MemberEventPayload,
  ): Promise<void> {
    const { roomId, userId } = this.socketsInfo[socket.id];
    await this.roomService.handleMemberEvent(roomId, userId, payload);
  }
}
