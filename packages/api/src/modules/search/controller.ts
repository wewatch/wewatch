import { Body, Controller, HttpCode, Post } from "@nestjs/common";

import { SearchDTO, SearchVideoResultDTO } from "@/schemas/search";

import { SearchService } from "./service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @HttpCode(200)
  async search(
    @Body() searchVideoDTO: SearchDTO,
  ): Promise<SearchVideoResultDTO> {
    return await this.searchService.search(searchVideoDTO);
  }
}
