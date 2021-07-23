import {
  HttpException,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common";
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
import { Namespace, Socket } from "socket.io";

import { RoomActionDTO } from "@/actions/room";
import { MemberEventPayload, SocketEvent } from "@/constants";
import { COMMON_INTERCEPTORS } from "interceptors";
import { AuthService } from "modules/auth";
import { User } from "modules/user/model";
import { WsValidationPipe } from "pipes/validation";

import { RoomService } from "./service";

interface SocketData {
  roomId: string;
  user: User;
}

interface SocketWithData extends Socket {
  data: SocketData;
}

@UseFilters(new BaseWsExceptionFilter())
@UseInterceptors(...COMMON_INTERCEPTORS)
@UsePipes(new WsValidationPipe())
@WebSocketGateway({
  namespace: "rooms",
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly roomService: RoomService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server!: Namespace;

  async handleConnection(socket: Socket): Promise<void> {
    try {
      const accessToken = this.getAccessToken(socket);
      const { sub } = this.jwtService.verify(accessToken);
      const user = await this.authService.verifyJwtSubject(sub);

      const roomId = this.getRoomId(socket);
      socket.join(roomId);
      await this.roomService.handleUserJoinRoom(roomId, user);

      socket.data = {
        roomId,
        user,
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

  async handleDisconnect(socket: SocketWithData): Promise<void> {
    const { roomId, user } = socket.data;
    await this.roomService.handleUserLeaveRoom(roomId, user.id);
  }

  @SubscribeMessage(SocketEvent.Actions)
  async onActionEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() action: RoomActionDTO,
  ): Promise<void> {
    const { roomId, user } = socket.data;

    try {
      const newAction = await this.roomService.handleAction(roomId, action);
      this.server.to(roomId).emit(SocketEvent.Actions, {
        userId: user.id,
        action: newAction,
      });
    } catch (e) {
      if (e instanceof HttpException) {
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
    this.server.to(roomId).emit(SocketEvent.Actions, {
      userId: null,
      action,
    });
  }

  @SubscribeMessage(SocketEvent.Members)
  async onMemberEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: MemberEventPayload,
  ): Promise<void> {
    const { roomId, user } = socket.data;
    await this.roomService.handleMemberEvent(roomId, user.id, payload);
  }

  @SubscribeMessage(SocketEvent.SyncProgress)
  async onSyncProgress(@ConnectedSocket() socket: Socket): Promise<number> {
    let progress = 0;
    const { roomId } = socket.data;
    const socketsInRoom = await this.server.in(roomId).allSockets();

    const peerId = Array.from(socketsInRoom).find((id) => id !== socket.id);
    if (peerId !== undefined) {
      // Use Promise.race to set a timeout for getting progress from the peer
      progress = await Promise.race<Promise<number>>([
        new Promise((resolve) => setTimeout(() => resolve(0), 3000)),
        new Promise((resolve) => {
          try {
            this.server.sockets
              .get(peerId)
              ?.emit(SocketEvent.SyncProgress, (playedSeconds: number) =>
                resolve(playedSeconds),
              );
          } catch {
            resolve(0);
          }
        }),
      ]);
    }

    return progress;
  }
}
