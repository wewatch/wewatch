import { Body, Controller, HttpCode, Post, Request } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { SearchDTO, SearchVideoResultDTO } from "@/schemas/search";
import { UseAuthGuard } from "modules/auth";
import { RateLimitService } from "modules/rate-limit";
import { getClientIP } from "utils/misc";

import { SearchService } from "./service";

@UseAuthGuard
@Controller("search")
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Post()
  @HttpCode(200)
  async search(
    @Body() searchVideoDTO: SearchDTO,
    @Request() request: FastifyRequest,
  ): Promise<SearchVideoResultDTO> {
    const clientIp = getClientIP(request);
    await this.rateLimitService.getRateLimiter(2).consume(`search:${clientIp}`);

    return await this.searchService.search(searchVideoDTO);
  }
}
