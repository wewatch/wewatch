import { Injectable } from "@nestjs/common";
import axios from "axios";

import {
  SearchDTO,
  SearchVideoResultDTO,
} from "@wewatch/common/schemas/search";
import { ConfigService } from "modules/config";

@Injectable()
export class SearchService {
  constructor(private readonly configService: ConfigService) {}

  async search(searchVideoDTO: SearchDTO): Promise<SearchVideoResultDTO> {
    const result = await axios.post<SearchVideoResultDTO>(
      this.configService.cfg.SEARCH_SERVICE_URL,
      {
        ...searchVideoDTO,
        type: "youtube",
      },
      {
        headers: {
          "X-API-KEY": this.configService.cfg.SEARCH_SERVICE_API_KEY,
        },
      },
    );

    return result.data;
  }
}
