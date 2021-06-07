import { Injectable } from "@nestjs/common";
import { google, youtube_v3 } from "googleapis";

import { SearchVideoDTO, SearchVideoResultDTO } from "@wewatch/schemas";
import { ConfigService } from "modules/config";

@Injectable()
export class SearchService {
  private youtube: youtube_v3.Youtube;

  constructor(private readonly configService: ConfigService) {
    this.youtube = google.youtube({
      version: "v3",
      auth: this.configService.cfg.YOUTUBE_API_KEY,
    });
  }

  async search(searchVideoDTO: SearchVideoDTO): Promise<SearchVideoResultDTO> {
    const result = await this.youtube.search.list({
      ...searchVideoDTO,
      maxResults: 10,
      part: ["snippet"],
    });
    const items = result.data.items ?? [];

    return items.map((item) => ({
      url: `https://www.youtube.com/watch?v=${item?.id?.videoId}`,
      thumbnailUrl: item?.snippet?.thumbnails?.default?.url ?? "",
      title: item?.snippet?.title ?? "Untitled",
    }));
  }
}
