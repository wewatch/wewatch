import {
  Card,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

import RequestUtil from "utils/api";

const useStyles = makeStyles(() => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}));

interface PlaylistItemProps {
  url: string;
}

interface NoembedInfo {
  title: string;
  thumbnail_url: string;
}

const PlaylistItem = ({ url }: PlaylistItemProps): JSX.Element => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<NoembedInfo | null>(null);

  useEffect(() => {
    const getInfo = async () =>
      RequestUtil.get<NoembedInfo>(`https://noembed.com/embed?url=${url}`);

    getInfo().then((response) => {
      setInfo(response);
      setLoading(false);
    });
  }, [url]);

  if (loading || !info) {
    return <span>Loading</span>;
  }

  return (
    <Card>
      <CardMedia
        className={classes.media}
        image={info.thumbnail_url}
        title={info.title}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {info.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PlaylistItem;
