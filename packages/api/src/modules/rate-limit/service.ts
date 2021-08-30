import { Injectable } from "@nestjs/common";
import { RateLimiterAbstract, RateLimiterMemory } from "rate-limiter-flexible";

import { ConfigService } from "../config";

@Injectable()
export class RateLimitService {
  readonly createRoomRateLimiter: RateLimiterAbstract;
  readonly searchRateLimiter: RateLimiterAbstract;
  readonly loginRateLimiter: RateLimiterAbstract;
  readonly interactionRateLimiter: RateLimiterAbstract;

  constructor(private readonly configService: ConfigService) {
    const cfg = this.configService.cfg;

    this.createRoomRateLimiter = new RateLimiterMemory({
      points: cfg.RATE_LIMIT_CREATE_ROOM_POINT,
      duration: cfg.RATE_LIMIT_CREATE_ROOM_DURATION,
    });

    this.searchRateLimiter = new RateLimiterMemory({
      points: cfg.RATE_LIMIT_SEARCH_POINT,
      duration: cfg.RATE_LIMIT_SEARCH_DURATION,
    });

    this.loginRateLimiter = new RateLimiterMemory({
      points: cfg.RATE_LIMIT_LOGIN_POINT,
      duration: cfg.RATE_LIMIT_LOGIN_DURATION,
    });

    this.interactionRateLimiter = new RateLimiterMemory({
      points: cfg.RATE_LIMIT_INTERACTION_POINT,
      duration: cfg.RATE_LIMIT_INTERACTION_DURATION,
    });
  }
}
