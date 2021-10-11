import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import VideoPlayer from "../components/Video";

const superSecretAPIKey = process.env.REACT_APP_PRIVATE_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_API = "https://www.googleapis.com/youtube/v3/search";

const useStyles = makeStyles({
  root: { fontFamily: "Helvetica Neue, Arial, sans-serif" },
  iframeContainer: {
    position: "relative",
    width: "100%",
    height: 0,
    paddingBottom: "56.25%"
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  },
  searchForVideoText: {
    fontSize: 20,
    textAlign: "center",
    paddingTop: 50
  },
  videoWrapper: {
    display: "flex"
  },
  extraSpaceContainer: { width: 333, padding: "0px 10px" },
  pausePlayButton: {
    padding: "12px 16px",
    backgroundColor: "#ff0000",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    borderRadius: 12,
    textAlign: "center",
    cursor: "pointer"
  }
});

interface Video {
  id: string;
  info: {
    title: string;
    channelTitle: string;
    description: string;
  };
}

export default function App() {
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const [video, setVideo] = useState({} as Video);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const setSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const getYoutubeVideo = async (searchStr: string) => {
    const query = `part=snippet&maxResults=1&q=${searchStr}`;
    try {
      setLoading(true);
      setErr("");
      const response: any = await axios.get(
        `${YOUTUBE_SEARCH_API}?${query}&key=${superSecretAPIKey}`
      );

      const videoObject = {
        id: response.data.items[0].id.videoId,
        info: response.data.items[0].snippet
      };

      setVideo(videoObject);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErr("error occured getting video...");
      console.log(err);
    }
  };
  const handleSearchVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    await getYoutubeVideo(search);
  };

  const Player = () => {
    return video && (video.id || video.info) ? (
      <div className={classes.videoWrapper}>
        <div>
          <div className={classes.iframeContainer}>
            <VideoPlayer className={classes.video} videoId={video.id} />
          </div>
          <div style={{ paddingTop: 24 }} />
          <h1>{video.info.title}</h1>
          <h2>{video.info.channelTitle}</h2>
          <h3>{video.info.description}</h3>
        </div>
        <div className={classes.extraSpaceContainer}></div>
      </div>
    ) : (
      <div className={classes.searchForVideoText}>Search for a video</div>
    );
  };

  return (
    <div className={classes.root}>
      <Navbar onChange={setSearchValue} onSubmit={handleSearchVideo} />
      <div style={{ padding: "32px 8px" }}>
        {loading ? (
          <div className={classes.searchForVideoText}>loading...</div>
        ) : (
          <Player />
        )}
        {err ?? null}
      </div>
    </div>
  );
}
