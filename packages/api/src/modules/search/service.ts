import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";

import { SupportedProvider } from "@/constants";
import {
  SearchDTO,
  SearchVideoErrorDTO,
  SearchVideoResultDTO,
} from "@/schemas/search";
import { ConfigService } from "modules/config";

@Injectable()
export class SearchService {
  constructor(private readonly configService: ConfigService) {}

  async search(searchVideoDTO: SearchDTO): Promise<SearchVideoResultDTO> {
    try {
      const { data } = await axios.post<SearchVideoResultDTO>(
        this.configService.cfg.SEARCH_SERVICE_URL,
        {
          ...searchVideoDTO,
          provider: SupportedProvider.YouTube,
        },
        {
          headers: {
            "X-API-KEY": this.configService.cfg.SEARCH_SERVICE_API_KEY,
          },
        },
      );

      return data as SearchVideoResultDTO;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const { message } = e.response.data as SearchVideoErrorDTO;
        throw new BadRequestException(message);
      }

      throw e;
    }
  }
}
