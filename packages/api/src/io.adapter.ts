import { IoAdapter as _IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";

export class IoAdapter extends _IoAdapter {
  createIOServer(port: number, options?: Partial<ServerOptions>): Server {
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: "*",
        methods: "*",
      },
    });
  }
}
