/**
 * Audio player — a Spotify for Podcasters embed. Renders only when the
 * article's frontmatter has an `audioUrl`. The iframe is loaded lazily so
 * the player doesn't pull network on initial article load — most readers
 * never play it.
 *
 * Spotify provides the embed URL in the format
 * `https://open.spotify.com/embed/episode/<id>`. If the host changes,
 * this component is the one place to update.
 */
export function AudioPlayer({ src, title }: { src: string; title: string }) {
  return (
    <div className="my-10">
      <iframe
        src={src}
        title={`Audio: ${title}`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        className="w-full"
        height="180"
        style={{ border: 0 }}
      />
    </div>
  );
}
