import { GetStaticProps } from "next";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

type File = {
  duration: string;
  url: string;
};

type ServerEpisode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  published_at: string;
  description: string;
  file: File;
};

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type HomeProps = {
  episodes: Episode[];
};

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes: Episode[] = data.map(
    (episode: ServerEpisode): Episode => {
      return {
        id: episode.id,
        title: episode.id,
        thumbnail: episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
          locale: ptBR,
        }),
        duration: Number(episode.file.duration),
        durationAsString: convertDurationToTimeString(
          Number(episode.file.duration)
        ),
        description: episode.description,
        url: episode.file.url,
      };
    }
  );

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 24,
  };
};
