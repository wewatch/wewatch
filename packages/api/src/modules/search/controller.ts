import { Body, Controller, HttpCode, Post } from "@nestjs/common";

import { SearchVideoDTO, SearchVideoResultDTO } from "@wewatch/schemas";

import { SearchService } from "./service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @HttpCode(200)
  async search(
    @Body() searchVideoDTO: SearchVideoDTO,
  ): Promise<SearchVideoResultDTO> {
    return this.searchService.search(searchVideoDTO);
  }
}
