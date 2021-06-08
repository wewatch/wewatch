import { Body, Controller, HttpCode, Post } from "@nestjs/common";

import { SearchDTO, SearchVideoResultDTO } from "@wewatch/schemas";
import { TooManyRequests } from "utils/exceptions";

import { SearchService } from "./service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @HttpCode(200)
  async search(
    @Body() searchVideoDTO: SearchDTO,
  ): Promise<SearchVideoResultDTO> {
    try {
      return await this.searchService.search(searchVideoDTO);
    } catch (e) {
      if (e?.errors?.[0]?.reason === "quotaExceeded") {
        throw new TooManyRequests();
      }

      throw e;
    }
  }
}
