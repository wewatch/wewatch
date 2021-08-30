import { Injectable } from "@nestjs/common";
import { RateLimiterAbstract, RateLimiterMemory } from "rate-limiter-flexible";

import { ConfigService } from "modules/config";

type RateLimitTier = 1 | 2 | 3 | 4 | 5 | 6;

@Injectable()
export class RateLimitService {
  private readonly rateLimiters: Map<RateLimitTier, RateLimiterAbstract>;

  constructor(private readonly configService: ConfigService) {
    this.rateLimiters = new Map<RateLimitTier, RateLimiterAbstract>();
    for (let tier = 1; tier <= 6; ++tier) {
      this.rateLimiters.set(
        tier as RateLimitTier,
        new RateLimiterMemory({
          points: 1,
          duration: this.configService.cfg.RATE_LIMIT_DURATIONS[tier - 1],
        }),
      );
    }
  }

  getRateLimiter(tier: RateLimitTier): RateLimiterAbstract {
    return this.rateLimiters.get(tier) as RateLimiterAbstract;
  }
}
